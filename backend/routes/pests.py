from flask import Blueprint, request, jsonify

pests_bp = Blueprint('pests', __name__)

def get_mysql():
    from app import mysql
    return mysql

@pests_bp.route('/', methods=['GET'])
def get_all_pests():
    mysql = get_mysql()
    search = request.args.get('search')

    query = "SELECT * FROM pests WHERE 1=1"
    params = []

    if search:
        query += " AND (name LIKE %s OR affected_crops LIKE %s OR nepali_name LIKE %s)"
        params.extend([f'%{search}%', f'%{search}%', f'%{search}%'])

    cur = mysql.connection.cursor()
    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()

    pests = []
    for row in rows:
        pests.append({
            'id': row[0], 'name': row[1], 'nepali_name': row[2],
            'affected_crops': row[3], 'symptoms': row[4],
            'treatment': row[5], 'prevention': row[6]
        })
    return jsonify(pests), 200