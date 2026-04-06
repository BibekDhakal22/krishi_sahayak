from flask import Blueprint, request, jsonify, current_app
from database import get_db
import jwt

forum_bp = Blueprint('forum', __name__)

def get_user_from_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except:
        return None

@forum_bp.route('/posts', methods=['GET'])
def get_posts():
    category = request.args.get('category', '')
    conn = get_db()
    cursor = conn.cursor()
    if category:
        cursor.execute("""
            SELECT p.id, p.title, p.content, p.category, p.likes, p.created_at,
                   u.name, (SELECT COUNT(*) FROM forum_replies WHERE post_id = p.id) as reply_count
            FROM forum_posts p JOIN users u ON p.user_id = u.id
            WHERE p.category = ? ORDER BY p.created_at DESC
        """, (category,))
    else:
        cursor.execute("""
            SELECT p.id, p.title, p.content, p.category, p.likes, p.created_at,
                   u.name, (SELECT COUNT(*) FROM forum_replies WHERE post_id = p.id) as reply_count
            FROM forum_posts p JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        """)
    rows = cursor.fetchall()
    conn.close()
    posts = [{'id': r[0], 'title': r[1], 'content': r[2], 'category': r[3],
              'likes': r[4], 'created_at': str(r[5]), 'author': r[6], 'reply_count': r[7]} for r in rows]
    return jsonify(posts), 200

@forum_bp.route('/posts', methods=['POST'])
def create_post():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO forum_posts (user_id, title, content, category) VALUES (?, ?, ?, ?)",
        (user['user_id'], data['title'], data['content'], data.get('category', 'general')))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Post created'}), 201

@forum_bp.route('/posts/<int:post_id>/replies', methods=['GET'])
def get_replies(post_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.id, r.content, r.created_at, u.name
        FROM forum_replies r JOIN users u ON r.user_id = u.id
        WHERE r.post_id = ? ORDER BY r.created_at ASC
    """, (post_id,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify([{'id': r[0], 'content': r[1], 'created_at': str(r[2]), 'author': r[3]} for r in rows]), 200

@forum_bp.route('/posts/<int:post_id>/replies', methods=['POST'])
def add_reply(post_id):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    user = get_user_from_token(token)
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO forum_replies (post_id, user_id, content) VALUES (?, ?, ?)",
        (post_id, user['user_id'], data['content']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Reply added'}), 201

@forum_bp.route('/posts/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE forum_posts SET likes = likes + 1 WHERE id = ?", (post_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Liked'}), 200