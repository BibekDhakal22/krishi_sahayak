import { useState, useEffect } from 'react';
import axios from 'axios';
import './Crops.css';
import './Pests.css';

export default function Pests() {
  const [pests, setPests] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/pests/', { params: { search } })
      .then(r => { setPests(r.data); setLoading(false); });
  }, [search]);

  return (
    <div className="crops-page">
      <div className="page-hero red">
        <h1>🐛 Pest & Disease Guide</h1>
        <p>Identify, treat and prevent crop pests and diseases in Nepal</p>
      </div>

      <div className="page-content">
        <div className="filters-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input placeholder="Search by pest name or affected crop..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="cards-grid">
          {pests.map(pest => (
            <div key={pest.id} className="pest-card-new" onClick={() => setSelected(pest)}>
              <div className="card-icon-wrap pest-icon">🦠</div>
              <div className="card-body">
                <h3>{pest.name} <span className="nepali-tag">{pest.nepali_name}</span></h3>
                <div className="card-tags">
                  <span className="tag affected-tag">🌱 {pest.affected_crops}</span>
                </div>
                <p className="card-desc">{pest.symptoms?.substring(0, 80)}...</p>
              </div>
              <div className="card-arrow" style={{ color: '#c62828' }}>→</div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-new" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">🦠</span>
              <div>
                <h2 style={{ color: '#b71c1c' }}>{selected.name}</h2>
                <span className="nepali-big">{selected.nepali_name}</span>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-tags">
              <span className="tag affected-tag">🌱 Affects: {selected.affected_crops}</span>
            </div>
            <div className="modal-info-grid">
              <div className="info-box">
                <h4>🔍 Symptoms</h4>
                <p>{selected.symptoms}</p>
              </div>
              <div className="info-box">
                <h4>💊 Treatment</h4>
                <p>{selected.treatment}</p>
              </div>
              <div className="info-box" style={{ gridColumn: '1 / -1' }}>
                <h4>🛡️ Prevention</h4>
                <p>{selected.prevention}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}