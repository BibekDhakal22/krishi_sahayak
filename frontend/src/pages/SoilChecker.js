import { useState } from 'react';
import './SoilChecker.css';

export default function SoilChecker() {
  const [form, setForm] = useState({ ph: '', nitrogen: '', phosphorus: '', potassium: '', organic: '', texture: '' });
  const [result, setResult] = useState(null);

  const analyze = (e) => {
    e.preventDefault();
    const ph = parseFloat(form.ph);
    const n = parseFloat(form.nitrogen);
    const p = parseFloat(form.phosphorus);
    const k = parseFloat(form.potassium);
    const om = parseFloat(form.organic);

    const issues = [];
    const recommendations = [];
    const suitableCrops = [];
    let healthScore = 100;

    // pH analysis
    if (ph < 5.5) {
      issues.push({ type: 'warning', msg: '⚠️ Soil is too acidic (pH < 5.5)' });
      recommendations.push('🪨 Apply agricultural lime (300-500 kg/ha) to raise pH');
      healthScore -= 20;
    } else if (ph > 7.5) {
      issues.push({ type: 'warning', msg: '⚠️ Soil is too alkaline (pH > 7.5)' });
      recommendations.push('🌿 Apply sulfur or organic matter to lower pH');
      healthScore -= 15;
    } else {
      issues.push({ type: 'good', msg: '✅ pH level is ideal (5.5 - 7.5)' });
    }

    // Nitrogen
    if (n < 0.3) {
      issues.push({ type: 'warning', msg: '⚠️ Low nitrogen content' });
      recommendations.push('🌱 Apply urea or compost to increase nitrogen');
      healthScore -= 15;
    } else {
      issues.push({ type: 'good', msg: '✅ Nitrogen level is adequate' });
    }

    // Phosphorus
    if (p < 15) {
      issues.push({ type: 'warning', msg: '⚠️ Low phosphorus content' });
      recommendations.push('🔶 Apply DAP or SSP fertilizer for phosphorus');
      healthScore -= 10;
    } else {
      issues.push({ type: 'good', msg: '✅ Phosphorus level is adequate' });
    }

    // Potassium
    if (k < 120) {
      issues.push({ type: 'warning', msg: '⚠️ Low potassium content' });
      recommendations.push('💊 Apply MOP (Muriate of Potash) for potassium');
      healthScore -= 10;
    } else {
      issues.push({ type: 'good', msg: '✅ Potassium level is adequate' });
    }

    // Organic matter
    if (om < 1.5) {
      issues.push({ type: 'warning', msg: '⚠️ Low organic matter' });
      recommendations.push('🌿 Add compost, FYM, or green manure to improve organic matter');
      healthScore -= 15;
    } else {
      issues.push({ type: 'good', msg: '✅ Organic matter is sufficient' });
    }

    // Suitable crops based on pH and texture
    if (ph >= 5.5 && ph <= 6.5) {
      suitableCrops.push('Rice 🌾', 'Maize 🌽', 'Potato 🥔', 'Ginger 🫚');
    }
    if (ph >= 6.0 && ph <= 7.5) {
      suitableCrops.push('Wheat 🌿', 'Mustard 🌻', 'Tomato 🍅', 'Lentil 🫘');
    }

    const healthLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Poor';
    const healthColor = healthScore >= 80 ? '#2e7d32' : healthScore >= 60 ? '#f57f17' : '#c62828';

    setResult({ issues, recommendations, suitableCrops: [...new Set(suitableCrops)], healthScore, healthLabel, healthColor });
  };

  return (
    <div className="soil-page">
      <div className="soil-hero">
        <h2>🪱 Soil Health Checker</h2>
        <p>Enter your soil test results to get farming recommendations</p>
        <p className="nepali">माटो परीक्षण नतिजा दिनुहोस् र खेती सल्लाह पाउनुहोस्</p>
      </div>

      <div className="soil-layout">
        <div className="soil-form-box">
          <h3>🔬 Soil Test Results</h3>
          <form onSubmit={analyze} className="soil-form">
            {[
              { key: 'ph', label: 'pH Level', placeholder: 'e.g. 6.5 (range: 0-14)', min: 0, max: 14, step: 0.1 },
              { key: 'nitrogen', label: 'Nitrogen (%)', placeholder: 'e.g. 0.5', min: 0, max: 5, step: 0.01 },
              { key: 'phosphorus', label: 'Phosphorus (kg/ha)', placeholder: 'e.g. 25', min: 0, max: 200 },
              { key: 'potassium', label: 'Potassium (kg/ha)', placeholder: 'e.g. 150', min: 0, max: 1000 },
              { key: 'organic', label: 'Organic Matter (%)', placeholder: 'e.g. 2.5', min: 0, max: 20, step: 0.1 },
            ].map(f => (
              <div key={f.key} className="field-group">
                <label>{f.label}</label>
                <input type="number" placeholder={f.placeholder} min={f.min} max={f.max} step={f.step || 1}
                  value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} required />
              </div>
            ))}
            <div className="field-group">
              <label>Soil Texture</label>
              <select value={form.texture} onChange={e => setForm({...form, texture: e.target.value})} required>
                <option value="">Select Texture</option>
                <option value="clay">Clay (चिल्लो)</option>
                <option value="loam">Loam (दोमट)</option>
                <option value="sandy">Sandy (बालुवे)</option>
                <option value="sandy-loam">Sandy Loam (बलौटे दोमट)</option>
              </select>
            </div>
            <button type="submit" className="btn-analyze">🔍 Analyze Soil Health</button>
          </form>
        </div>

        {result && (
          <div className="soil-results">
            <div className="health-score-card" style={{ borderColor: result.healthColor }}>
              <div className="score-circle" style={{ background: result.healthColor }}>
                <span>{result.healthScore}</span>
                <small>/100</small>
              </div>
              <div>
                <h3>Soil Health: <span style={{ color: result.healthColor }}>{result.healthLabel}</span></h3>
                <p>Based on your soil test parameters</p>
              </div>
            </div>

            <div className="analysis-card">
              <h4>📊 Analysis Results</h4>
              {result.issues.map((issue, i) => (
                <div key={i} className={`issue-item ${issue.type}`}>{issue.msg}</div>
              ))}
            </div>

            {result.recommendations.length > 0 && (
              <div className="rec-card">
                <h4>💡 Recommendations</h4>
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="rec-item">{rec}</div>
                ))}
              </div>
            )}

            <div className="crops-card">
              <h4>🌱 Suitable Crops for Your Soil</h4>
              <div className="suitable-crops">
                {result.suitableCrops.map((crop, i) => (
                  <span key={i} className="crop-tag">{crop}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}