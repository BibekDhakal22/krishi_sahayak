import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) {
      toast.error('New passwords do not match!');
      return;
    }
    if (form.new_password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/change-password', form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password changed successfully!');
      setForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    }
    setLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">{name?.charAt(0).toUpperCase()}</div>
        <div>
          <h2>{name}</h2>
          <span className={`role-badge ${role}`}>{role === 'admin' ? '⚙️ Admin' : '👤 User'}</span>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h3>👤 Account Info</h3>
          <div className="info-row">
            <span>Name</span>
            <strong>{name}</strong>
          </div>
          <div className="info-row">
            <span>Role</span>
            <strong>{role}</strong>
          </div>
          <div className="info-row">
            <span>Status</span>
            <strong className="status-active">● Active</strong>
          </div>
        </div>

        <div className="profile-card">
          <h3>🔒 Change Password</h3>
          <form onSubmit={handlePasswordChange} className="password-form">
            <input type="password" placeholder="Current Password"
              value={form.current_password}
              onChange={e => setForm({...form, current_password: e.target.value})} required />
            <input type="password" placeholder="New Password"
              value={form.new_password}
              onChange={e => setForm({...form, new_password: e.target.value})} required />
            <input type="password" placeholder="Confirm New Password"
              value={form.confirm_password}
              onChange={e => setForm({...form, confirm_password: e.target.value})} required />
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="profile-card full-width">
          <h3>🌾 Quick Links</h3>
          <div className="quick-links">
            {[
              { to: '/dashboard', icon: '📊', label: 'Dashboard' },
              { to: '/chat', icon: '🤖', label: 'AI Chat' },
              { to: '/history', icon: '💬', label: 'Chat History' },
              { to: '/recommend', icon: '🌱', label: 'Crop Recommendation' },
              { to: '/weather', icon: '🌦️', label: 'Weather' },
            ].map((link, i) => (
              <a key={i} href={link.to} className="quick-link">
                <span>{link.icon}</span>
                <p>{link.label}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}