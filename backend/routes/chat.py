from flask import Blueprint, request, jsonify, current_app
from groq import Groq
import jwt
import os

chat_bp = Blueprint('chat', __name__)

def get_mysql():
    from app import mysql
    return mysql

def get_user_from_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload.get('user_id')
    except:
        return None

@chat_bp.route('/message', methods=['POST'])
def send_message():
    mysql = get_mysql()
    data = request.get_json()
    message = data.get('message')
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user_id = get_user_from_token(token) if token else None

    if not message:
        return jsonify({'error': 'Message is required'}), 400

    try:
        client = Groq(api_key=os.getenv('GROQ_API_KEY'))
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1024,
            messages=[
                {
                    "role": "system",
                    "content": """You are Krishi Sahayak, an expert agricultural assistant for Nepal.
                    You help farmers with crop advice, pest control, fertilizer recommendations,
                    and farming best practices specific to Nepal's climate and geography.
                    Answer in simple language. If the user writes in Nepali, respond in Nepali.
                    Keep answers practical and actionable for small-scale Nepali farmers."""
                },
                {"role": "user", "content": message}
            ]
        )
        ai_response = response.choices[0].message.content

        if user_id:
            cur = mysql.connection.cursor()
            cur.execute(
                "INSERT INTO chat_history (user_id, message, response) VALUES (%s, %s, %s)",
                (user_id, message, ai_response)
            )
            mysql.connection.commit()
            cur.close()

        return jsonify({'response': ai_response}), 200

    except Exception as e:
        print("CHAT ERROR:", str(e))
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/history', methods=['GET'])
def get_history():
    mysql = get_mysql()
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user_id = get_user_from_token(token)

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    cur = mysql.connection.cursor()
    cur.execute(
        "SELECT message, response, created_at FROM chat_history WHERE user_id=%s ORDER BY created_at DESC LIMIT 20",
        (user_id,)
    )
    rows = cur.fetchall()
    cur.close()

    history = [{'message': r[0], 'response': r[1], 'created_at': str(r[2])} for r in rows]
    return jsonify(history), 200