import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import './Home.css';

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 30);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const features = [
  { icon: '🌾', title: 'Crop Recommendation', desc: 'Smart algorithm matches crops to your region, season and soil type.', link: '/recommend', bg: '#e8f5e9' },
  { icon: '🤖', title: 'AI Chatbot', desc: 'Ask any farming question in Nepali or English and get instant answers.', link: '/chat', bg: '#f3e5f5' },
  { icon: '🌦️', title: 'Weather Advisory', desc: 'Real-time weather with farming tips for all Nepal districts.', link: '/weather', bg: '#e3f2fd' },
  { icon: '🧪', title: 'Fertilizer Calculator', desc: 'Calculate exact fertilizer needs using Ropani, Bigha or Kattha.', link: '/fertilizer', bg: '#fff8e1' },
  { icon: '🪱', title: 'Soil Health Checker', desc: 'Analyze soil pH, nitrogen and nutrients for better yields.', link: '/soil', bg: '#fce4ec' },
  { icon: '💰', title: 'Market Prices', desc: 'Daily crop prices from Kalimati market to sell at the right time.', link: '/market', bg: '#e0f7fa' },
  { icon: '📅', title: 'Crop Calendar', desc: 'Monthly planting and harvesting schedule for Nepal crops.', link: '/calendar', bg: '#f1f8e9' },
  { icon: '🐛', title: 'Pest & Disease Guide', desc: 'Identify and treat common pests and diseases affecting your crops.', link: '/pests', bg: '#fff3e0' },
  { icon: '🌱', title: 'Crop Advisory', desc: 'Detailed fertilizer, water and care tips for Nepal major crops.', link: '/crops', bg: '#e8f5e9' },
];

export default function Home() {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  return (
    <div className="home">
      {/* HERO */}
      <section className={`hero ${visible ? 'hero-in' : ''}`}>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            🇳🇵 Built for Nepal's Farmers
          </div>
          <h1>
            Smart Farming<br />
            <span className="hero-gradient">Starts Here</span>
          </h1>
          <p className="hero-desc">
            AI-powered agriculture assistant helping Nepali farmers grow better crops,
            fight pests, and make smarter decisions — in Nepali or English.
          </p>
          <p className="hero-nepali">नेपाली किसानहरूको लागि स्मार्ट कृषि सहायक</p>
          <div className="hero-actions">
            {token ? (
              <>
                <Link to="/recommend" className="btn-hero-primary">🌾 Get Crop Recommendations</Link>
                <Link to="/chat" className="btn-hero-secondary">🤖 Ask AI Assistant</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-hero-primary">🚀 Get Started Free</Link>
                <Link to="/crops" className="btn-hero-secondary">🌱 Explore Crops</Link>
              </>
            )}
          </div>
          {token && <p className="hero-welcome">👋 Welcome back, <strong>{name}</strong>!</p>}
        </div>
        <div className="hero-visual">
          <div className="visual-ring ring-outer">
            {['🌾','🌿','🍅','🥔','🌽','🌻'].map((e, i) => (
              <div key={i} className="ring-item" style={{ '--i': i, '--total': 6 }}>{e}</div>
            ))}
          </div>
          <div className="visual-ring ring-inner">
            {['🤖','🌦️','💰','🪱'].map((e, i) => (
              <div key={i} className="ring-item" style={{ '--i': i, '--total': 4 }}>{e}</div>
            ))}
          </div>
          <div className="visual-center">🏔️</div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        {[
          { label: 'Crops in Database', target: 10, suffix: '+', icon: '🌱' },
          { label: 'Pest Records', target: 4, suffix: '+', icon: '🐛' },
          { label: 'Nepal Districts', target: 15, suffix: '+', icon: '📍' },
          { label: 'AI Available', target: 24, suffix: '/7', icon: '🤖' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <strong className="stat-num"><CountUp target={s.target} suffix={s.suffix} /></strong>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything a Nepali Farmer Needs</h2>
          <p>9 powerful tools — all free, all in one place</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <Link to={f.link} key={i} className="feature-card" style={{ '--card-bg': f.bg }}>
              <div className="feature-icon-wrap">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-header light">
          <h2>How It Works</h2>
          <p>Get started in 3 simple steps</p>
        </div>
        <div className="steps">
          {[
            { num: '01', title: 'Create Account', desc: 'Register for free in seconds with just your name and email.' },
            { num: '02', title: 'Enter Your Details', desc: 'Tell us your region, season and soil type for personalized advice.' },
            { num: '03', title: 'Get Smart Advice', desc: 'Receive AI-powered recommendations, weather tips and market prices.' },
          ].map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!token && (
        <section className="cta-section">
          <h2>Ready to Farm Smarter?</h2>
          <p>Join Krishi Sahayak — free forever for Nepali farmers</p>
          <Link to="/register" className="btn-cta">Create Free Account →</Link>
        </section>
      )}
    </div>
  );
}