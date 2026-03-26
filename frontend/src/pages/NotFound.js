import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-content">
        <div className="notfound-emoji">🌾</div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! Looks like this field hasn't been planted yet.</p>
        <p className="nepali">यो पृष्ठ फेला परेन!</p>
        <div className="notfound-btns">
          <Link to="/" className="btn-home">🏠 Go Home</Link>
          <Link to="/crops" className="btn-crops">🌱 Browse Crops</Link>
        </div>
      </div>
    </div>
  );
}