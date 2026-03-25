from flask import Flask
from flask_cors import CORS
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# MySQL Configuration
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

mysql = MySQL(app)

# Import routes
from routes.auth import auth_bp
from routes.crops import crops_bp
from routes.pests import pests_bp
from routes.chat import chat_bp
from routes.weather import weather_bp
from routes.admin import admin_bp
from routes.recommend import recommend_bp


app.register_blueprint(recommend_bp, url_prefix='/api/recommend')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(crops_bp, url_prefix='/api/crops')
app.register_blueprint(pests_bp, url_prefix='/api/pests')
app.register_blueprint(chat_bp, url_prefix='/api/chat')
app.register_blueprint(weather_bp, url_prefix='/api/weather')

if __name__ == '__main__':
    app.run(debug=True, port=5000)