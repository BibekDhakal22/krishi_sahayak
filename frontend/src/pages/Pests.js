import { useState, useEffect } from 'react';
import axios from 'axios';
import './Pests.css';

export default function Pests() {
  const [pests, setPests] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/pests/', { params: { search } })
      .then(res => setPests(res.data));
  }, [search]);

  return (
    <div className="pests-page">
      <h2>🐛 Pest & Disease Guide</h2>
      <input className="search" placeholder="Search by pest name or crop..."
        value={search} onChange={e => setSearch(e.target.value)} />
      <div className="pests-grid">
        {pests.map(pest => (
          <div key={pest.id} className="pest-card" onClick={() => setSelected(pest)}>
            <h3>{pest.name} <span className="nepali">{pest.nepali_name}</span></h3>
            <p className="affected">Affects: {pest.affected_crops}</p>
            <p>{pest.symptoms?.substring(0, 80)}...</p>
            <button>View Treatment →</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>🐛 {selected.name} ({selected.nepali_name})</h2>
            <p><strong>Affected Crops:</strong> {selected.affected_crops}</p>
            <p><strong>🔍 Symptoms:</strong> {selected.symptoms}</p>
            <p><strong>💊 Treatment:</strong> {selected.treatment}</p>
            <p><strong>🛡 Prevention:</strong> {selected.prevention}</p>
            <button onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}