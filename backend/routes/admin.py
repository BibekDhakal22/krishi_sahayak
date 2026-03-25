from flask import Blueprint, request, jsonify, current_app
import jwt

admin_bp = Blueprint('admin', __name__)

def get_mysql():
    from app import mysql
    return mysql

def is_admin(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload.get('role') == 'admin'
    except:
        return False

# ─── CROPS ───────────────────────────────────────────

@admin_bp.route('/crops', methods=['GET'])
def get_crops():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token):
        return jsonify({'error': 'Admin access required'}), 403
    mysql = get_mysql()
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM crops")
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

@admin_bp.route('/crops', methods=['POST'])
def add_crop():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token):
        return jsonify({'error': 'Admin access required'}), 403
    mysql = get_mysql()
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("""INSERT INTO crops (name, nepali_name, season, region, description,
                fertilizer_tips, water_requirements, harvest_duration)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
                (data['name'], data['nepali_name'], data['season'], data['region'],
                 data['description'], data['fertilizer_tips'],
                 data['water_requirements'], data['harvest_duration']))
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Crop added successfully'}), 201

@admin_bp.route('/crops/<int:crop_id>', methods=['PUT'])
def update_crop(crop_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token):
        return jsonify({'error': 'Admin access required'}), 403
    mysql = get_mysql()
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("""UPDATE crops SET name=%s, nepali_name=%s, season=%s, region=%s,
                description=%s, fertilizer_tips=%s, water_requirements=%s,
                harvest_duration=%s WHERE id=%s""",
                (data['name'], data['nepali_name'], data['season'], data['region'],
                 data['description'], data['fertilizer_tips'],
                 data['water_requirements'], data['harvest_duration'], crop_id))
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Crop updated successfully'}), 200

@admin_bp.route('/crops/<int:crop_id>', methods=['DELETE'])
def delete_crop(crop_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token):
        return jsonify({'error': 'Admin access required'}), 403
    mysql = get_mysql()
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM crops WHERE id=%s", (crop_id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Crop deleted successfully'}), 200

# ─── PESTS ───────────────────────────────────────────

@admin_bp.route('/pests', methods=['GET'])
def get_pests():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token):
        return jsonify({'error': 'Admin access required'}), 403
    mysql = get_mysql()
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM pests")
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

@admin_bp.route('/pests', methods=['POST'])
def add_pest():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token):
        return jsonify({'error': 'Admin access required'}), 403
    mysql = get_mysql()
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("""INSERT INTO pests (name, nepali_name, affected_crops, symptoms, treatment, prevention)
                VALUES (%s,%s,%s,%s,%s,%s)""",
                (data['name'], data['nepali_name'], data['affected_crops'],
                 data['symptoms'], data['treatment'], data['prevention']))
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Pest added successfully'}), 201

@admin_bp.route('/pests/<int:pest_id>', methods=['PUT'])
def update_pest(pest_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token):
        return jsonify({'error': 'Admin access required'}), 403
    mysql = get_mysql()
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute("""UPDATE pests SET name=%s, nepali_name=%s, affected_crops=%s,
                symptoms=%s, treatment=%s, prevention=%s WHERE id=%s""",
                (data['name'], data['nepali_name'], data['affected_crops'],
                 data['symptoms'], data['treatment'], data['prevention'], pest_id))
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Pest updated successfully'}), 200

@admin_bp.route('/pests/<int:pest_id>', methods=['DELETE'])
def delete_pest(pest_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not is_admin(token):
        return jsonify({'error': 'Admin access required'}), 403
    mysql = get_mysql()
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM pests WHERE id=%s", (pest_id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({'message': 'Pest deleted successfully'}), 200