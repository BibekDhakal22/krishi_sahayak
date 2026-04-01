from flask import Blueprint, request, jsonify
from database import get_db

crops_bp = Blueprint('crops', __name__)

@crops_bp.route('/', methods=['GET'])
def get_all_crops():
    season = request.args.get('season')
    region = request.args.get('region')
    search = request.args.get('search')

    query = "SELECT * FROM crops WHERE 1=1"
    params = []

    if season:
        query += " AND season=?"
        params.append(season)
    if region:
        query += " AND region LIKE ?"
        params.append(f'%{region}%')
    if search:
        query += " AND (name LIKE ? OR nepali_name LIKE ?)"
        params.extend([f'%{search}%', f'%{search}%'])

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

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
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM crops WHERE id=?", (crop_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({'error': 'Crop not found'}), 404

    return jsonify({
        'id': row[0], 'name': row[1], 'nepali_name': row[2],
        'season': row[3], 'region': row[4], 'description': row[5],
        'fertilizer_tips': row[6], 'water_requirements': row[7],
        'harvest_duration': row[8]
    }), 200