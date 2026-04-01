from flask import Blueprint, request, jsonify, current_app
from database import get_db
import jwt

admin_bp = Blueprint('admin', __name__)

def is_admin(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload.get('role') == 'admin'
    except:
        return False

@admin_bp.route('/crops', methods=['GET'])
def get_crops():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token):
        return jsonify({'error': 'Admin access required'}), 403
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM crops")
    rows = cursor.fetchall()
    conn.close()
    crops = [{'id': r[0], 'name': r[1], 'nepali_name': r[2], 'season': r[3],
              'region': r[4], 'description': r[5], 'fertilizer_tips': r[6],
              'water_requirements': r[7], 'harvest_duration': r[8]} for r in rows]
    return jsonify(crops), 200

@admin_bp.route('/crops', methods=['POST'])
def add_crop():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token): return jsonify({'error': 'Admin access required'}), 403
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""INSERT INTO crops (name, nepali_name, season, region, description,
                fertilizer_tips, water_requirements, harvest_duration)
                VALUES (?,?,?,?,?,?,?,?)""",
                (data['name'], data['nepali_name'], data['season'], data['region'],
                 data['description'], data['fertilizer_tips'],
                 data['water_requirements'], data['harvest_duration']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Crop added successfully'}), 201

@admin_bp.route('/crops/<int:crop_id>', methods=['PUT'])
def update_crop(crop_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token): return jsonify({'error': 'Admin access required'}), 403
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""UPDATE crops SET name=?, nepali_name=?, season=?, region=?,
                description=?, fertilizer_tips=?, water_requirements=?,
                harvest_duration=? WHERE id=?""",
                (data['name'], data['nepali_name'], data['season'], data['region'],
                 data['description'], data['fertilizer_tips'],
                 data['water_requirements'], data['harvest_duration'], crop_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Crop updated successfully'}), 200

@admin_bp.route('/crops/<int:crop_id>', methods=['DELETE'])
def delete_crop(crop_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token): return jsonify({'error': 'Admin access required'}), 403
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM crops WHERE id=?", (crop_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Crop deleted successfully'}), 200

@admin_bp.route('/pests', methods=['GET'])
def get_pests():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token): return jsonify({'error': 'Admin access required'}), 403
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pests")
    rows = cursor.fetchall()
    conn.close()
    pests = [{'id': r[0], 'name': r[1], 'nepali_name': r[2], 'affected_crops': r[3],
              'symptoms': r[4], 'treatment': r[5], 'prevention': r[6]} for r in rows]
    return jsonify(pests), 200

@admin_bp.route('/pests', methods=['POST'])
def add_pest():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token): return jsonify({'error': 'Admin access required'}), 403
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""INSERT INTO pests (name, nepali_name, affected_crops, symptoms, treatment, prevention)
                VALUES (?,?,?,?,?,?)""",
                (data['name'], data['nepali_name'], data['affected_crops'],
                 data['symptoms'], data['treatment'], data['prevention']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Pest added successfully'}), 201

@admin_bp.route('/pests/<int:pest_id>', methods=['PUT'])
def update_pest(pest_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token): return jsonify({'error': 'Admin access required'}), 403
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""UPDATE pests SET name=?, nepali_name=?, affected_crops=?,
                symptoms=?, treatment=?, prevention=? WHERE id=?""",
                (data['name'], data['nepali_name'], data['affected_crops'],
                 data['symptoms'], data['treatment'], data['prevention'], pest_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Pest updated successfully'}), 200

@admin_bp.route('/pests/<int:pest_id>', methods=['DELETE'])
def delete_pest(pest_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token): return jsonify({'error': 'Admin access required'}), 403
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM pests WHERE id=?", (pest_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Pest deleted successfully'}), 200