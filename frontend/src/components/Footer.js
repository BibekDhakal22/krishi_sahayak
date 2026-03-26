import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>🌾 Krishi Sahayak</h3>
          <p>Smart Agriculture Assistant for Nepal</p>
          <p className="nepali">नेपाली किसानहरूको लागि स्मार्ट कृषि सहायक</p>
        </div>
        <div className="footer-links">
          <h4>Features</h4>
          <Link to="/crops">Crop Advisory</Link>
          <Link to="/pests">Pest Guide</Link>
          <Link to="/weather">Weather</Link>
          <Link to="/recommend">Crop Recommendation</Link>
          <Link to="/chat">AI Chatbot</Link>
        </div>
        <div className="footer-links">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/history">Chat History</Link>
        </div>
        <div className="footer-info">
          <h4>Project Info</h4>
          <p>BCA 8th Semester Project</p>
          <p>Tribhuvan University, Nepal</p>
          <p>Course: CACS452</p>
          <p>Developer: Bibek Dhakal</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Krishi Sahayak — BCA Final Year Project, Tribhuvan University Nepal</p>
        <p>Built with React, Flask, MySQL & AI</p>
      </div>
    </footer>
  );
}