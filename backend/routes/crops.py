from flask import Blueprint, request, jsonify

crops_bp = Blueprint('crops', __name__)

def get_mysql():
    from app import mysql
    return mysql

@crops_bp.route('/', methods=['GET'])
def get_all_crops():
    mysql = get_mysql()
    season = request.args.get('season')
    region = request.args.get('region')
    search = request.args.get('search')

    query = "SELECT * FROM crops WHERE 1=1"
    params = []

    if season:
        query += " AND season=%s"
        params.append(season)
    if region:
        query += " AND region LIKE %s"
        params.append(f'%{region}%')
    if search:
        query += " AND (name LIKE %s OR nepali_name LIKE %s)"
        params.extend([f'%{search}%', f'%{search}%'])

    cur = mysql.connection.cursor()
    cur.execute(query, params)
    rows = cur.fetchall()
    cur.close()

    crops = []
    for row in rows:
        crops.append({
            'id': row[0], 'name': row[1], 'nepali_name': row[2],
            'season': row[3], 'region': row[4], 'description': row[5],
            'fertilizer_tips': row[6], 'water_requirements': row[7],
            'harvest_duration': row[8]
        })
    return jsonify(crops), 200

@crops_bp.route('/<int:crop_id>', methods=['GET'])
def get_crop(crop_id):
    mysql = get_mysql()
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM crops WHERE id=%s", (crop_id,))
    row = cur.fetchone()
    cur.close()

    if not row:
        return jsonify({'error': 'Crop not found'}), 404

    return jsonify({
        'id': row[0], 'name': row[1], 'nepali_name': row[2],
        'season': row[3], 'region': row[4], 'description': row[5],
        'fertilizer_tips': row[6], 'water_requirements': row[7],
        'harvest_duration': row[8]
    }), 200