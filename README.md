# í¼¾ Krishi Sahayak - Smart Agriculture Assistant for Nepal

A full-stack web application that helps Nepali farmers with crop advisory, pest management, weather-based farming tips, and AI-powered assistance.

## Features
- í¼± Crop Advisory with search and filters
- í°› Pest & Disease Guide
- í¼¦ï¸ Real-time Weather + Farming Advisory
- í¼¾ Crop Recommendation Algorithm
- í´– AI Chatbot (supports Nepali & English)
- í²¬ Chat History
- âš™ï¸ Admin Panel

## Tech Stack
- **Frontend:** React.js
- **Backend:** Python Flask
- **Database:** MySQL (XAMPP)
- **AI:** Groq API (LLaMA 3.3)
- **Weather:** OpenWeatherMap API

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Create .env file from .env.example
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Project Structure
```
krishi_sahayak/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ app.py
â”‚   â”œâ”€â”€ requirements.txt
â”‚   â””â”€â”€ routes/
â””â”€â”€ frontend/
    â””â”€â”€ src/
```

## Developed by
Bibek Dhakal â€” BCA 8th Semester Project, Tribhuvan University Nepal
