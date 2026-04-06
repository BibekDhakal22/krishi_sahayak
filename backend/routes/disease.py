from flask import Blueprint, request, jsonify, current_app
from groq import Groq
import base64
import os
import jwt

disease_bp = Blueprint('disease', __name__)

def get_user_from_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload.get('user_id')
    except:
        return None

@disease_bp.route('/analyze', methods=['POST'])
def analyze_disease():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    data = request.get_json()
    image_b64 = data.get('image')

    if not image_b64:
        return jsonify({'error': 'No image provided'}), 400

    try:
        client = Groq(api_key=os.getenv('GROQ_API_KEY'))
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_b64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": """You are an expert plant pathologist specializing in Nepal's crops.
                            Analyze this crop image and identify any disease or pest damage.
                            Respond ONLY in this exact JSON format:
                            {
                                "disease": "Disease name in English",
                                "nepali_name": "Disease name in Nepali if known",
                                "severity": "Mild/Moderate/Severe",
                                "description": "Brief description of the disease",
                                "symptoms": "Visible symptoms in the image",
                                "treatment": "Recommended treatment with specific chemicals/methods",
                                "prevention": "Prevention measures",
                                "affected_crops": "Crops commonly affected"
                            }
                            If the image is healthy or not a crop, set disease to "No Disease Detected" and explain in description."""
                        }
                    ]
                }
            ]
        )

        import json
        text = response.choices[0].message.content
        text = text.replace('```json', '').replace('```', '').strip()
        result = json.loads(text)
        return jsonify(result), 200

    except Exception as e:
        print("DISEASE ERROR:", str(e))
        return jsonify({'error': str(e)}), 500