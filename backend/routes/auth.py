from flask import Blueprint, request, jsonify, current_app
from flask_mysqldb import MySQL
import bcrypt
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)

def get_mysql():
    from app import mysql
    return mysql

@auth_bp.route('/register', methods=['POST'])
def register():
    mysql = get_mysql()
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
                    (name, email, hashed.decode('utf-8')))
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': 'Email already exists'}), 409

@auth_bp.route('/login', methods=['POST'])
def login():
    mysql = get_mysql()
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    cur = mysql.connection.cursor()
    cur.execute("SELECT id, name, email, password, role FROM users WHERE email=%s", (email,))
    user = cur.fetchone()
    cur.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):
        token = jwt.encode({
            'user_id': user[0],
            'email': user[2],
            'role': user[4],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        return jsonify({'token': token, 'name': user[1], 'role': user[4]}), 200

    return jsonify({'error': 'Invalid email or password'}), 401