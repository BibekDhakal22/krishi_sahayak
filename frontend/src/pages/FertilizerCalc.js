import { useState } from 'react';
import './FertilizerCalc.css';

const CROP_REQUIREMENTS = {
  Rice:     { N: 100, P: 50,  K: 50  },
  Wheat:    { N: 120, P: 60,  K: 40  },
  Maize:    { N: 150, P: 75,  K: 60  },
  Potato:   { N: 120, P: 80,  K: 100 },
  Tomato:   { N: 120, P: 60,  K: 60  },
  Mustard:  { N: 80,  P: 40,  K: 30  },
  Sugarcane:{ N: 150, P: 60,  K: 100 },
  Lentil:   { N: 20,  P: 40,  K: 20  },
  Ginger:   { N: 100, P: 50,  K: 80  },
};

const FERTILIZERS = {
  Urea:       { N: 46, P: 0,  K: 0  },
  DAP:        { N: 18, P: 46, K: 0  },
  MOP:        { N: 0,  P: 0,  K: 60 },
  NPK_151515: { N: 15, P: 15, K: 15 },
};

export default function FertilizerCalc() {
  const [form, setForm] = useState({ crop: '', area: '', unit: 'ropani' });
  const [result, setResult] = useState(null);

  const toHectare = (area, unit) => {
    if (unit === 'ropani') return area * 0.0509;
    if (unit === 'bigha') return area * 0.6772;
    if (unit === 'kattha') return area * 0.0339;
    return parseFloat(area);
  };

  const calculate = (e) => {
    e.preventDefault();
    const req = CROP_REQUIREMENTS[form.crop];
    const ha = toHectare(parseFloat(form.area), form.unit);

    const totalN = req.N * ha;
    const totalP = req.P * ha;
    const totalK = req.K * ha;

    const urea = ((totalN * 0.5) / FERTILIZERS.Urea.N) * 100;
    const dap  = (totalP / FERTILIZERS.DAP.P) * 100;
    const mop  = (totalK / FERTILIZERS.MOP.K) * 100;
    const nFromDap = dap * (FERTILIZERS.DAP.N / 100);
    const remainingN = totalN - nFromDap;
    const ureaFinal = (remainingN / FERTILIZERS.Urea.N) * 100;

    setResult({
      area_ha: ha.toFixed(3),
      required: { N: totalN.toFixed(1), P: totalP.toFixed(1), K: totalK.toFixed(1) },
      fertilizers: {
        Urea: ureaFinal.toFixed(1),
        DAP:  dap.toFixed(1),
        MOP:  mop.toFixed(1),
      },
      applications: [
        { time: 'Basal (Before Planting)', urea: (ureaFinal * 0.3).toFixed(1), dap: dap.toFixed(1), mop: mop.toFixed(1) },
        { time: 'Top Dress 1 (30 days)', urea: (ureaFinal * 0.4).toFixed(1), dap: '0', mop: '0' },
        { time: 'Top Dress 2 (60 days)', urea: (ureaFinal * 0.3).toFixed(1), dap: '0', mop: '0' },
      ]
    });
  };

  return (
    <div className="calc-page">
      <div className="calc-hero">
        <h2>🧪 Fertilizer Calculator</h2>
        <p>Get precise fertilizer recommendations for your land and crop</p>
        <p className="nepali">आफ्नो जमिन र बालीको लागि मल गणना गर्नुहोस्</p>
      </div>

      <div className="calc-layout">
        <div className="calc-form-box">
          <h3>📋 Enter Farm Details</h3>
          <form onSubmit={calculate} className="calc-form">
            <div className="field-group">
              <label>🌱 Crop Type</label>
              <select value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} required>
                <option value="">Select Crop</option>
                {Object.keys(CROP_REQUIREMENTS).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label>📐 Land Area</label>
              <div className="area-input">
                <input type="number" placeholder="Enter area" min="0.1" step="0.1"
                  value={form.area} onChange={e => setForm({...form, area: e.target.value})} required />
                <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                  <option value="ropani">Ropani (रोपनी)</option>
                  <option value="bigha">Bigha (बिघा)</option>
                  <option value="kattha">Kattha (कट्ठा)</option>
                  <option value="hectare">Hectare (हेक्टर)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-calc">🧮 Calculate Fertilizer</button>
          </form>
        </div>

        {result && (
          <div className="calc-results">
            <h3>📊 Fertilizer Recommendation</h3>
            <p className="area-note">For <strong>{form.area} {form.unit}</strong> ({result.area_ha} hectares) of <strong>{form.crop}</strong></p>

            <div className="nutrient-cards">
              {[
                { label: 'Nitrogen (N)', val: result.required.N, color: '#1b5e20', icon: '🌿' },
                { label: 'Phosphorus (P)', val: result.required.P, color: '#e65100', icon: '🔶' },
                { label: 'Potassium (K)', val: result.required.K, color: '#1565c0', icon: '💧' },
              ].map((n, i) => (
                <div key={i} className="nutrient-card" style={{ borderTopColor: n.color }}>
                  <span>{n.icon}</span>
                  <strong style={{ color: n.color }}>{n.val} kg</strong>
                  <p>{n.label}</p>
                </div>
              ))}
            </div>

            <div className="fertilizer-total">
              <h4>🧴 Total Fertilizer Required</h4>
              <div className="fert-cards">
                <div className="fert-card">
                  <span>⚗️</span>
                  <strong>{result.fertilizers.Urea} kg</strong>
                  <p>Urea (46% N)</p>
                </div>
                <div className="fert-card">
                  <span>🔸</span>
                  <strong>{result.fertilizers.DAP} kg</strong>
                  <p>DAP (18N-46P)</p>
                </div>
                <div className="fert-card">
                  <span>💊</span>
                  <strong>{result.fertilizers.MOP} kg</strong>
                  <p>MOP (60% K)</p>
                </div>
              </div>
            </div>

            <div className="application-schedule">
              <h4>📅 Application Schedule</h4>
              <table className="schedule-table">
                <thead>
                  <tr><th>Time</th><th>Urea (kg)</th><th>DAP (kg)</th><th>MOP (kg)</th></tr>
                </thead>
                <tbody>
                  {result.applications.map((app, i) => (
                    <tr key={i}>
                      <td>{app.time}</td>
                      <td>{app.urea}</td>
                      <td>{app.dap}</td>
                      <td>{app.mop}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="calc-note">
              ⚠️ These are general recommendations. Soil test results may vary. Consult your local agriculture office for precise advice.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}