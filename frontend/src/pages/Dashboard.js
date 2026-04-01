import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

export default function Dashboard() {
  const name = localStorage.getItem('name');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [stats, setStats] = useState({ crops: 0, pests: 0, chats: 0 });
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    // Use public routes for crops and pests
    axios.get('http://localhost:5000/api/crops/')
      .then(r => setStats(s => ({ ...s, crops: r.data.length })))
      .catch(() => {});

    axios.get('http://localhost:5000/api/pests/')
      .then(r => setStats(s => ({ ...s, pests: r.data.length })))
      .catch(() => {});

    // Chat history requires token
    axios.get('http://localhost:5000/api/chat/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        setStats(s => ({ ...s, chats: r.data.length }));
        setRecentChats(r.data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="dashboard">
      <div className="dash-hero">
        <div>
          <h2>{greeting}, {name}! 👋</h2>
          <p>Here's your Krishi Sahayak overview</p>
        </div>
        {role === 'admin' && <span className="admin-badge">⚙️ Admin</span>}
      </div>

      <div className="dash-stats">
        <div className="dash-stat green">
          <span>🌱</span>
          <strong>{stats.crops}</strong>
          <p>Crops Available</p>
        </div>
        <div className="dash-stat orange">
          <span>🐛</span>
          <strong>{stats.pests}</strong>
          <p>Pest Records</p>
        </div>
        <div className="dash-stat blue">
          <span>💬</span>
          <strong>{stats.chats}</strong>
          <p>AI Conversations</p>
        </div>
        <div className="dash-stat purple">
          <span>🤖</span>
          <strong>24/7</strong>
          <p>AI Available</p>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <h3>🚀 Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/chat" className="qa-btn ai">🤖 Ask AI Assistant</Link>
            <Link to="/recommend" className="qa-btn rec">🌾 Get Crop Recommendation</Link>
            <Link to="/weather" className="qa-btn weather">🌦️ Check Weather</Link>
            <Link to="/crops" className="qa-btn crops">🌱 Browse Crops</Link>
            <Link to="/pests" className="qa-btn pests">🐛 Pest Guide</Link>
            {role === 'admin' && <Link to="/admin" className="qa-btn admin">⚙️ Admin Panel</Link>}
          </div>
        </div>

        <div className="dash-card">
          <h3>💬 Recent AI Conversations</h3>
          {recentChats.length === 0 ? (
            <div className="no-chats">
              <p>No conversations yet.</p>
              <Link to="/chat">Start chatting →</Link>
            </div>
          ) : (
            <div className="recent-chats">
              {recentChats.map((chat, i) => (
                <div key={i} className="recent-chat-item">
                  <p className="chat-q">❓ {chat.message}</p>
                  <p className="chat-a">🤖 {chat.response.substring(0, 100)}...</p>
                </div>
              ))}
              <Link to="/history" className="view-all">View all conversations →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}