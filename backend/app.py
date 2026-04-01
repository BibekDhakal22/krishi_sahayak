from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

from routes.auth import auth_bp
from routes.crops import crops_bp
from routes.pests import pests_bp
from routes.chat import chat_bp
from routes.weather import weather_bp
from routes.admin import admin_bp
from routes.recommend import recommend_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(crops_bp, url_prefix='/api/crops')
app.register_blueprint(pests_bp, url_prefix='/api/pests')
app.register_blueprint(chat_bp, url_prefix='/api/chat')
app.register_blueprint(weather_bp, url_prefix='/api/weather')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(recommend_bp, url_prefix='/api/recommend')

if __name__ == '__main__':
    app.run(debug=True, port=5000)