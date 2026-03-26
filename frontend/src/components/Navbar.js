import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ setToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.clear();
    setToken(null);
    navigate('/');
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        {token && <Link to="/chat" className={`nav-chat ${isActive('/chat')}`} onClick={() => setMenuOpen(false)}>🤖 AI Chat</Link>}

        {token ? (
          <div className="nav-profile" ref={dropdownRef}>
            <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="profile-initial">{name?.charAt(0).toUpperCase()}</div>
              <span className="profile-name">{name}</span>
              <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-initial">{name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{name}</strong>
                    <span className={`dropdown-role ${role}`}>{role === 'admin' ? '⚙️ Admin' : '👤 User'}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  📊 Dashboard
                </Link>
                <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  👤 My Profile
                </Link>
                <Link to="/history" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  💬 Chat History
                </Link>
                {role === 'admin' && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    ⚙️ Admin Panel
                  </Link>
                )}
                <div className="dropdown-divider"></div>
                <button onClick={logout} className="dropdown-logout">
                  🚪 Logout
                </button>
              </div>
            )}
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