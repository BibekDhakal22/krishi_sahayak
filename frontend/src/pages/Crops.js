import { useState, useEffect } from 'react';
import axios from 'axios';
import { SkeletonGrid } from '../components/Skeleton';
import './Crops.css';

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCrops = async () => {
    setLoading(true);
    const res = await axios.get('http://localhost:5000/api/crops/', {
      params: { search, season }
    });
    setCrops(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchCrops(); }, [search, season]);

  return (
    <div className="crops-page">
      <h2>🌱 Crop Advisory</h2>
      <div className="filters">
        <input placeholder="Search crops..." value={search}
          onChange={e => setSearch(e.target.value)} />
        <select value={season} onChange={e => setSeason(e.target.value)}>
          <option value="">All Seasons</option>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
          <option value="all">Year Round</option>
        </select>
      </div>
      {loading ? <SkeletonGrid count={6} /> : (
        <div className="crops-grid">
          {crops.map(crop => (
            <div key={crop.id} className="crop-card" onClick={() => setSelected(crop)}>
              <div className="crop-icon">{getCropIcon(crop.name)}</div>
              <h3>{crop.name} <span className="nepali">{crop.nepali_name}</span></h3>
              <p className="badge">{crop.season} • {crop.region}</p>
              <p>{crop.description}</p>
              <button>View Details →</button>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">{getCropIcon(selected.name)}</div>
            <h2>{selected.name} ({selected.nepali_name})</h2>
            <p><strong>Season:</strong> {selected.season}</p>
            <p><strong>Region:</strong> {selected.region}</p>
            <p><strong>Description:</strong> {selected.description}</p>
            <p><strong>🧪 Fertilizer:</strong> {selected.fertilizer_tips}</p>
            <p><strong>💧 Water:</strong> {selected.water_requirements}</p>
            <p><strong>⏱ Harvest:</strong> {selected.harvest_duration}</p>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function getCropIcon(name) {
  const icons = { Rice: '🌾', Wheat: '🌿', Maize: '🌽', Potato: '🥔', Tomato: '🍅', Mustard: '🌻', Sugarcane: '🎋', Lentil: '🫘', Ginger: '🫚', Buckwheat: '🌰' };
  return icons[name] || '🌱';
}