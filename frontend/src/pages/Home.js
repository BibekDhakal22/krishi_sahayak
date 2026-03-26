import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Home.css';

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

export default function Home() {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <div className={`hero ${visible ? 'hero-visible' : ''}`}>
        <div className="hero-content">
          <div className="hero-badge">🇳🇵 Made for Nepal</div>
          <h1>Smart Farming<br /><span className="hero-highlight">Starts Here</span></h1>
          <p>AI-powered agriculture assistant helping Nepali farmers grow better crops, fight pests, and make smarter decisions.</p>
          <p className="nepali">नेपाली किसानहरूको लागि स्मार्ट कृषि सहायक</p>
          <div className="hero-btns">
            {token ? (
              <>
                <Link to="/recommend" className="btn-primary">🌾 Get Crop Recommendations</Link>
                <Link to="/chat" className="btn-secondary">🤖 Ask AI Assistant</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary">🚀 Get Started Free</Link>
                <Link to="/crops" className="btn-secondary">🌱 Browse Crops</Link>
              </>
            )}
          </div>
          {token && <p className="welcome-back">👋 Welcome back, <strong>{name}</strong>!</p>}
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            <div className="circle c1">🌾</div>
            <div className="circle c2">🌱</div>
            <div className="circle c3">🤖</div>
            <div className="circle c4">🌦️</div>
            <div className="circle c5">🐛</div>
            <div className="main-circle">🏔️</div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat-item">
          <strong><CountUp target={10} />+</strong>
          <span>Crops in Database</span>
        </div>
        <div className="stat-item">
          <strong><CountUp target={4} />+</strong>
          <span>Pest & Diseases</span>
        </div>
        <div className="stat-item">
          <strong><CountUp target={15} />+</strong>
          <span>Nepal Districts</span>
        </div>
        <div className="stat-item">
          <strong><CountUp target={24} />/7</strong>
          <span>AI Assistant</span>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features-section">
        <h2>Everything a Nepali Farmer Needs</h2>
        <p className="section-sub">All tools in one place — free and easy to use</p>
        <div className="features-grid">
          {[
            { icon: '🌱', title: 'Crop Advisory', desc: 'Get fertilizer, water and care tips for Nepal\'s major crops including Rice, Wheat, Maize and more.', link: '/crops', color: '#e8f5e9' },
            { icon: '🌾', title: 'Crop Recommendation', desc: 'Enter your region, season and soil type — our algorithm suggests the best crops for your land.', link: '/recommend', color: '#fff8e1' },
            { icon: '🐛', title: 'Pest & Disease Guide', desc: 'Identify common pests and diseases affecting your crops and get treatment advice.', link: '/pests', color: '#fce4ec' },
            { icon: '🌦️', title: 'Weather Advisory', desc: 'Real-time weather for Nepal districts with farming tips based on current conditions.', link: '/weather', color: '#e3f2fd' },
            { icon: '🤖', title: 'AI Chatbot', desc: 'Ask any farming question in Nepali or English and get instant expert advice.', link: '/chat', color: '#f3e5f5' },
            { icon: '💬', title: 'Chat History', desc: 'Review your past conversations with the AI assistant anytime you need.', link: '/history', color: '#e0f7fa' },
          ].map((f, i) => (
            <Link to={f.link} key={i} className="feature-card" style={{ background: f.color }}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-link">Learn more →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!token && (
        <div className="cta-section">
          <h2>Ready to Farm Smarter?</h2>
          <p>Join thousands of Nepali farmers using Krishi Sahayak</p>
          <Link to="/register" className="btn-cta">Create Free Account →</Link>
        </div>
      )}
    </div>
  );
}