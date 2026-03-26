import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar({ setToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    setToken(null);
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
        🌾 Krishi Sahayak
      </Link>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/crops" className={isActive('/crops')} onClick={() => setMenuOpen(false)}>Crops</Link>
        <Link to="/pests" className={isActive('/pests')} onClick={() => setMenuOpen(false)}>Pests</Link>
        <Link to="/weather" className={isActive('/weather')} onClick={() => setMenuOpen(false)}>Weather</Link>
        <Link to="/recommend" className={isActive('/recommend')} onClick={() => setMenuOpen(false)}>Recommend</Link>
        <Link to="/profile" className="nav-name">👤 {name}</Link>
        {token && <Link to="/history" className={isActive('/history')} onClick={() => setMenuOpen(false)}>History</Link>}
        {token && <Link to="/chat" className={`nav-chat ${isActive('/chat')}`} onClick={() => setMenuOpen(false)}>🤖 AI Chat</Link>}
        {role === 'admin' && <Link to="/admin" className={isActive('/admin')} onClick={() => setMenuOpen(false)}>⚙️ Admin</Link>}

        {token ? (
          <div className="nav-user">
            <Link to="/dashboard" className="nav-name" onClick={() => setMenuOpen(false)}>👤 {name}</Link>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}