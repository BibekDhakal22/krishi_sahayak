from flask import Blueprint, request, jsonify
import urllib.request
import json
import os

weather_bp = Blueprint('weather', __name__)

NEPAL_DISTRICTS = [
    'Kathmandu', 'Pokhara', 'Bharatpur', 'Butwal', 'Dharan',
    'Biratnagar', 'Birgunj', 'Janakpur', 'Nepalgunj', 'Dhangadhi',
    'Hetauda', 'Itahari', 'Damak', 'Tulsipur', 'Gorkha'
]

@weather_bp.route('/districts', methods=['GET'])
def get_districts():
    return jsonify(NEPAL_DISTRICTS), 200

@weather_bp.route('/<city>', methods=['GET'])
def get_weather(city):
    api_key = os.getenv('WEATHER_API_KEY')
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city},NP&appid={api_key}&units=metric"

    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())

        weather = {
            'city': data['name'],
            'temperature': round(data['main']['temp']),
            'feels_like': round(data['main']['feels_like']),
            'humidity': data['main']['humidity'],
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon'],
            'wind_speed': data['wind']['speed'],
            'min_temp': round(data['main']['temp_min']),
            'max_temp': round(data['main']['temp_max']),
        }

        advice = get_farming_advice(weather)
        weather['farming_advice'] = advice
        return jsonify(weather), 200

    except urllib.error.HTTPError as e:
        if e.code == 404:
            # Fallback to Kathmandu if city not found
            fallback_url = f"http://api.openweathermap.org/data/2.5/weather?q=Kathmandu,NP&appid={api_key}&units=metric"
            with urllib.request.urlopen(fallback_url) as response:
                data = json.loads(response.read().decode())
            weather = {
                'city': f"{city} (showing Kathmandu)",
                'temperature': round(data['main']['temp']),
                'feels_like': round(data['main']['feels_like']),
                'humidity': data['main']['humidity'],
                'description': data['weather'][0]['description'],
                'icon': data['weather'][0]['icon'],
                'wind_speed': data['wind']['speed'],
                'min_temp': round(data['main']['temp_min']),
                'max_temp': round(data['main']['temp_max']),
            }
            advice = get_farming_advice(weather)
            weather['farming_advice'] = advice
            return jsonify(weather), 200
    except Exception as e:
        print("WEATHER ERROR:", str(e))
        return jsonify({'error': str(e)}), 500

def get_farming_advice(weather):
    temp = weather['temperature']
    humidity = weather['humidity']
    desc = weather['description'].lower()

    advice = []

    if 'rain' in desc:
        advice.append("🌧️ Rain expected — avoid spraying pesticides or fertilizers today.")
        advice.append("💧 Good day for transplanting seedlings.")
    elif 'clear' in desc:
        advice.append("☀️ Clear weather — good day for harvesting and field work.")
        advice.append("🌱 Ensure adequate irrigation for your crops today.")
    elif 'cloud' in desc:
        advice.append("⛅ Cloudy weather — suitable for planting and transplanting.")

    if temp > 35:
        advice.append("🌡️ Very hot — water your crops early morning or evening.")
    elif temp < 10:
        advice.append("🥶 Cold weather — protect sensitive crops from frost damage.")
    elif 20 <= temp <= 30:
        advice.append("✅ Temperature is ideal for most Nepal crops.")

    if humidity > 80:
        advice.append("💦 High humidity — watch out for fungal diseases like blight.")
    elif humidity < 30:
        advice.append("🏜️ Low humidity — increase irrigation frequency.")

    return advice if advice else ["🌾 Weather conditions are moderate for farming."]