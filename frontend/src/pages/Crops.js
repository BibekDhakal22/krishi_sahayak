import { useState, useEffect } from 'react';
import axios from 'axios';
import { SkeletonGrid } from '../components/Skeleton';
import './Crops.css';

const cropIcons = { Rice:'🌾', Wheat:'🌿', Maize:'🌽', Potato:'🥔', Tomato:'🍅', Mustard:'🌻', Sugarcane:'🎋', Lentil:'🫘', Ginger:'🫚', Buckwheat:'🌰' };
const seasonColors = { summer: '#ff8f00', winter: '#1565c0', all: '#2e7d32' };
const seasonBg = { summer: '#fff8e1', winter: '#e3f2fd', all: '#e8f5e9' };

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/crops/', { params: { search, season } })
      .then(r => { setCrops(r.data); setLoading(false); });
  }, [search, season]);

  return (
    <div className="crops-page">
      <div className="page-hero green">
        <h1>🌱 Crop Advisory</h1>
        <p>Detailed growing guides for Nepal's major crops</p>
      </div>

      <div className="page-content">
        <div className="filters-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input placeholder="Search crops in English or Nepali..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="season-pills">
            {['','summer','winter','all'].map(s => (
              <button key={s} className={`pill ${season === s ? 'active' : ''}`}
                onClick={() => setSeason(s)}>
                {s === '' ? 'All' : s === 'summer' ? '☀️ Summer' : s === 'winter' ? '❄️ Winter' : '🔄 Year Round'}
              </button>
            ))}
          </div>
        </div>

        {loading ? <SkeletonGrid count={6} /> : (
          <div className="cards-grid">
            {crops.map(crop => (
              <div key={crop.id} className="crop-card-new" onClick={() => setSelected(crop)}>
                <div className="card-icon-wrap">{cropIcons[crop.name] || '🌱'}</div>
                <div className="card-body">
                  <h3>{crop.name} <span className="nepali-tag">{crop.nepali_name}</span></h3>
                  <div className="card-tags">
                    <span className="tag" style={{ background: seasonBg[crop.season], color: seasonColors[crop.season] }}>
                      {crop.season}
                    </span>
                    <span className="tag region-tag">📍 {crop.region}</span>
                    <span className="tag harvest-tag">⏱ {crop.harvest_duration}</span>
                  </div>
                  <p className="card-desc">{crop.description}</p>
                </div>
                <div className="card-arrow">→</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-new" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">{cropIcons[selected.name] || '🌱'}</span>
              <div>
                <h2>{selected.name}</h2>
                <span className="nepali-big">{selected.nepali_name}</span>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-tags">
              <span className="tag" style={{ background: seasonBg[selected.season], color: seasonColors[selected.season] }}>{selected.season}</span>
              <span className="tag region-tag">📍 {selected.region}</span>
              <span className="tag harvest-tag">⏱ {selected.harvest_duration}</span>
            </div>
            <div className="modal-info-grid">
              <div className="info-box">
                <h4>📝 Description</h4>
                <p>{selected.description}</p>
              </div>
              <div className="info-box">
                <h4>🧪 Fertilizer Tips</h4>
                <p>{selected.fertilizer_tips}</p>
              </div>
              <div className="info-box">
                <h4>💧 Water Requirements</h4>
                <p>{selected.water_requirements}</p>
              </div>
              <div className="info-box">
                <h4>⏱ Harvest Duration</h4>
                <p>{selected.harvest_duration}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}