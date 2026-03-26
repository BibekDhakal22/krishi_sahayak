import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './History.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chat/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-NP', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="history-page">
      <div className="history-hero">
        <h2>💬 Chat History</h2>
        <p>Your past conversations with AI Krishi Assistant</p>
      </div>

      <div className="history-container">
        {loading && (
          <div className="history-loading">⏳ Loading your conversations...</div>
        )}

        {!loading && history.length === 0 && (
          <div className="history-empty">
            <span>🤖</span>
            <h3>No conversations yet</h3>
            <p>Start chatting with the AI assistant to see your history here.</p>
            <button onClick={() => navigate('/chat')}>Go to AI Chat →</button>
          </div>
        )}

        {!loading && history.length > 0 && (
          <>
            <div className="history-stats">
              <div className="stat">
                <span>💬</span>
                <strong>{history.length}</strong>
                <p>Total Questions</p>
              </div>
              <div className="stat">
                <span>🤖</span>
                <strong>{history.length}</strong>
                <p>AI Responses</p>
              </div>
              <div className="stat">
                <span>📅</span>
                <strong>{formatDate(history[history.length - 1].created_at).split(',')[0]}</strong>
                <p>First Chat</p>
              </div>
            </div>

            <div className="history-list">
              {history.map((item, index) => (
                <div
                  key={index}
                  className={`history-card ${expanded === index ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(index)}
                >
                  <div className="history-card-header">
                    <div className="history-q">
                      <span className="q-icon">❓</span>
                      <p>{item.message}</p>
                    </div>
                    <div className="history-meta">
                      <span className="history-date">{formatDate(item.created_at)}</span>
                      <span className="expand-icon">{expanded === index ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expanded === index && (
                    <div className="history-answer">
                      <div className="answer-label">🤖 AI Response:</div>
                      <div className="answer-text">{item.response}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}