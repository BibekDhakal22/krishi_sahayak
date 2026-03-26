import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '🌾 Namaste! I am Krishi Sahayak. Ask me anything about farming in Nepal! You can write in Nepali or English.', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/chat/message',
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.response, time: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Error connecting to AI. Please try again.', time: new Date() }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const formatTime = (date) => date.toLocaleTimeString('en-NP', { hour: '2-digit', minute: '2-digit' });

  const suggestions = ['धानमा कुन मल राम्रो हुन्छ?', 'How to treat late blight on potato?', 'Best crops for Terai in summer?', 'आलुमा कीरा लाग्यो, के गर्ने?'];

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="ai-avatar">🤖</div>
          <div>
            <h2>AI Krishi Assistant</h2>
            <span className="online-dot">● Online</span>
          </div>
        </div>
        <p className="chat-subtitle">Ask farming questions in Nepali or English</p>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.role === 'assistant' && <div className="msg-avatar">🤖</div>}
            <div className="msg-content">
              <div className="bubble">{msg.text}</div>
              <span className="msg-time">{formatTime(msg.time)}</span>
            </div>
            {msg.role === 'user' && <div className="msg-avatar user-avatar">👤</div>}
          </div>
        ))}

        {loading && (
          <div className="message assistant">
            <div className="msg-avatar">🤖</div>
            <div className="msg-content">
              <div className="bubble typing-bubble">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="suggestions">
          <p>💡 Try asking:</p>
          <div className="suggestion-chips">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)} className="chip">{s}</button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-input">
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey} placeholder="Type your question... (Enter to send, Shift+Enter for new line)"
          rows={2} />
        <button onClick={sendMessage} disabled={loading || !input.trim()} className="send-btn">
          {loading ? '⏳' : '🚀'}
        </button>
      </div>
    </div>
  );
}