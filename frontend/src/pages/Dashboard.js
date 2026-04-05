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
  const [activityData] = useState([4, 7, 3, 8, 5, 10, 6]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/crops/').then(r => setStats(s => ({ ...s, crops: r.data.length }))).catch(() => {});
    axios.get('http://localhost:5000/api/pests/').then(r => setStats(s => ({ ...s, pests: r.data.length }))).catch(() => {});
    axios.get('http://localhost:5000/api/chat/history', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setStats(s => ({ ...s, chats: r.data.length })); setRecentChats(r.data.slice(0, 3)); })
      .catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? '🌅 Good Morning' : hour < 17 ? '☀️ Good Afternoon' : '🌙 Good Evening';
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxActivity = Math.max(...activityData);

  return (
    <div className="dashboard-new">
      {/* HERO */}
      <div className="dash-hero-new">
        <div className="dash-hero-left">
          <p className="greeting-label">{greeting}</p>
          <h2>{name}! 👋</h2>
          <p className="dash-sub">Here's your Krishi Sahayak overview for today</p>
        </div>
        {role === 'admin' && (
          <Link to="/admin" className="admin-chip">⚙️ Admin Panel</Link>
        )}
      </div>

      {/* STATS ROW */}
      <div className="dash-stats-new">
        {[
          { icon: '🌱', val: stats.crops, label: 'Crops Available', color: '#1b5e20', bg: '#e8f5e9' },
          { icon: '🐛', val: stats.pests, label: 'Pest Records', color: '#e65100', bg: '#fff3e0' },
          { icon: '💬', val: stats.chats, label: 'AI Conversations', color: '#1565c0', bg: '#e3f2fd' },
          { icon: '🤖', val: '24/7', label: 'AI Available', color: '#6a1b9a', bg: '#f3e5f5' },
        ].map((s, i) => (
          <div key={i} className="stat-pill" style={{ '--sc': s.color, '--sb': s.bg }}>
            <div className="stat-pill-icon">{s.icon}</div>
            <div>
              <strong>{s.val}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid-new">
        {/* QUICK ACTIONS */}
        <div className="dash-card-new">
          <h3>🚀 Quick Actions</h3>
          <div className="qa-grid">
            {[
              { to: '/chat', icon: '🤖', label: 'AI Chat', color: '#f3e5f5', tc: '#6a1b9a' },
              { to: '/recommend', icon: '🌾', label: 'Recommend', color: '#e8f5e9', tc: '#2e7d32' },
              { to: '/weather', icon: '🌦️', label: 'Weather', color: '#e3f2fd', tc: '#1565c0' },
              { to: '/fertilizer', icon: '🧪', label: 'Fertilizer', color: '#fff8e1', tc: '#f57f17' },
              { to: '/market', icon: '💰', label: 'Market', color: '#fce4ec', tc: '#c62828' },
              { to: '/soil', icon: '🪱', label: 'Soil', color: '#efebe9', tc: '#4e342e' },
              { to: '/calendar', icon: '📅', label: 'Calendar', color: '#e0f7fa', tc: '#00838f' },
              { to: '/crops', icon: '🌱', label: 'Crops', color: '#f1f8e9', tc: '#558b2f' },
            ].map((a, i) => (
              <Link key={i} to={a.to} className="qa-item" style={{ background: a.color, color: a.tc }}>
                <span>{a.icon}</span>
                <p>{a.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* ACTIVITY CHART */}
        <div className="dash-card-new">
          <h3>📊 Chat Activity (This Week)</h3>
          <div className="bar-chart">
            {activityData.map((val, i) => (
              <div key={i} className="bar-item">
                <div className="bar-fill" style={{ height: `${(val / maxActivity) * 100}%` }}>
                  <span className="bar-val">{val}</span>
                </div>
                <span className="bar-label">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT CHATS */}
        <div className="dash-card-new full-width">
          <div className="card-header-row">
            <h3>💬 Recent AI Conversations</h3>
            <Link to="/history" className="view-all-link">View all →</Link>
          </div>
          {recentChats.length === 0 ? (
            <div className="no-data">
              <span>🤖</span>
              <p>No conversations yet. <Link to="/chat">Start chatting →</Link></p>
            </div>
          ) : (
            <div className="chats-list">
              {recentChats.map((chat, i) => (
                <div key={i} className="chat-item-new">
                  <div className="chat-q-new">
                    <span className="chat-q-icon">❓</span>
                    <p>{chat.message}</p>
                  </div>
                  <div className="chat-a-new">
                    <span className="chat-a-icon">🤖</span>
                    <p>{chat.response?.substring(0, 120)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}