import { useState } from 'react';
import axios from 'axios';
import './Recommend.css';

export default function Recommend() {
  const [form, setForm] = useState({
    region: '', season: '', soil: '', rainfall: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/recommend/', form);
      setResults(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#2e7d32';
    if (score >= 50) return '#f57f17';
    return '#c62828';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return '⭐ Highly Recommended';
    if (score >= 50) return '👍 Moderate Match';
    return '⚠️ Low Match';
  };

  return (
    <div className="recommend-page">
      <div className="recommend-hero">
        <h2>🌱 Crop Recommendation System</h2>
        <p>Enter your farm details and get the best crop suggestions for your land</p>
        <p className="nepali-sub">आफ्नो खेतको विवरण दिनुस् र उपयुक्त बालीको सुझाव पाउनुस्</p>
      </div>

      <div className="recommend-layout">
        <div className="recommend-form-box">
          <h3>🔍 Your Farm Details</h3>
          <form onSubmit={handleSubmit} className="recommend-form">

            <div className="field-group">
              <label>📍 Region</label>
              <select value={form.region} onChange={e => setForm({...form, region: e.target.value})} required>
                <option value="">Select Region</option>
                <option value="Terai">Terai (तराई)</option>
                <option value="Inner Terai">Inner Terai (भित्री तराई)</option>
                <option value="Low Hill">Low Hill (निचला पहाड)</option>
                <option value="Hill">Hill (पहाड)</option>
                <option value="High Hill">High Hill (माथिल्लो पहाड)</option>
                <option value="Mountain">Mountain (हिमाल)</option>
              </select>
            </div>

            <div className="field-group">
              <label>🗓️ Season</label>
              <select value={form.season} onChange={e => setForm({...form, season: e.target.value})} required>
                <option value="">Select Season</option>
                <option value="summer">Summer / Bhadra (गर्मी)</option>
                <option value="winter">Winter / Rabi (जाडो)</option>
                <option value="spring">Spring / Chaite (बसन्त)</option>
              </select>
            </div>

            <div className="field-group">
              <label>🪨 Soil Type</label>
              <select value={form.soil} onChange={e => setForm({...form, soil: e.target.value})} required>
                <option value="">Select Soil Type</option>
                <option value="clay">Clay (चिल्लो माटो)</option>
                <option value="loam">Loam (दोमट माटो)</option>
                <option value="sandy loam">Sandy Loam (बलौटे दोमट)</option>
                <option value="clay loam">Clay Loam (चिल्लो दोमट)</option>
                <option value="sandy">Sandy (बालुवे माटो)</option>
              </select>
            </div>

            <div className="field-group">
              <label>🌧️ Rainfall Level</label>
              <select value={form.rainfall} onChange={e => setForm({...form, rainfall: e.target.value})} required>
                <option value="">Select Rainfall</option>
                <option value="high">High (धेरै वर्षा)</option>
                <option value="moderate">Moderate (मध्यम वर्षा)</option>
                <option value="low">Low (कम वर्षा)</option>
              </select>
            </div>

            <button type="submit" className="btn-recommend" disabled={loading}>
              {loading ? '⏳ Analyzing...' : '🌾 Get Recommendations'}
            </button>
          </form>
        </div>

        {searched && (
          <div className="results-box">
            <h3>📊 Recommended Crops for Your Farm</h3>
            <p className="results-sub">Sorted by suitability score</p>
            <div className="results-list">
              {results.map((crop, index) => (
                <div key={index} className="result-card" style={{ borderLeftColor: getScoreColor(crop.score) }}>
                  <div className="result-header">
                    <div>
                      <h4>{index + 1}. {crop.name} <span className="nepali-name">{crop.nepali_name}</span></h4>
                      <p className="result-desc">{crop.description}</p>
                    </div>
                    <div className="score-badge" style={{ background: getScoreColor(crop.score) }}>
                      <span className="score-num">{crop.score}%</span>
                      <span className="score-label">{getScoreLabel(crop.score)}</span>
                    </div>
                  </div>

                  <div className="score-bar-wrap">
                    <div className="score-bar" style={{ width: `${crop.score}%`, background: getScoreColor(crop.score) }}></div>
                  </div>

                  <div className="result-details">
                    <span>🗓️ Seasons: {crop.seasons.join(', ')}</span>
                    <span>🪨 Best Soil: {crop.best_soil}</span>
                  </div>

                  <div className="reasons-list">
                    {crop.reasons.map((r, i) => (
                      <span key={i} className={`reason ${r.startsWith('✅') ? 'good' : 'warn'}`}>{r}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}