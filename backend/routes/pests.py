from flask import Blueprint, request, jsonify
from database import get_db

pests_bp = Blueprint('pests', __name__)

@pests_bp.route('/', methods=['GET'])
def get_all_pests():
    search = request.args.get('search')
    query = "SELECT * FROM pests WHERE 1=1"
    params = []

    if search:
        query += " AND (name LIKE ? OR affected_crops LIKE ? OR nepali_name LIKE ?)"
        params.extend([f'%{search}%', f'%{search}%', f'%{search}%'])

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    pests = []
    for row in rows:
        pests.append({
            'id': row[0], 'name': row[1], 'nepali_name': row[2],
            'affected_crops': row[3], 'symptoms': row[4],
            'treatment': row[5], 'prevention': row[6]
        })
    return jsonify(pests), 200