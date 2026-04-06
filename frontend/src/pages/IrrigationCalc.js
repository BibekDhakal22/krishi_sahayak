import { useState } from 'react';
import './IrrigationCalc.css';

const CROP_WATER = {
  Rice:      { daily: 8, stages: ['Land prep: 150mm', 'Transplanting: 50mm', 'Tillering: 40mm/week', 'Heading: 50mm/week', 'Ripening: 30mm/week'] },
  Wheat:     { daily: 4, stages: ['Germination: 30mm', 'Tillering: 40mm', 'Jointing: 50mm', 'Heading: 60mm', 'Grain fill: 40mm'] },
  Maize:     { daily: 5, stages: ['Germination: 25mm', 'Vegetative: 50mm/week', 'Tasseling: 70mm/week', 'Grain fill: 50mm/week'] },
  Potato:    { daily: 5, stages: ['Emergence: 25mm', 'Vegetative: 40mm/week', 'Tuber init: 60mm/week', 'Bulking: 50mm/week'] },
  Tomato:    { daily: 4.5, stages: ['Transplant: 30mm', 'Vegetative: 40mm/week', 'Flowering: 50mm/week', 'Fruiting: 60mm/week'] },
  Mustard:   { daily: 3, stages: ['Germination: 20mm', 'Rosette: 30mm', 'Flowering: 40mm', 'Pod fill: 35mm'] },
  Ginger:    { daily: 5, stages: ['Establishment: 40mm', 'Vegetative: 50mm/week', 'Rhizome: 60mm/week'] },
  Lentil:    { daily: 2.5, stages: ['Germination: 20mm', 'Vegetative: 25mm', 'Flowering: 35mm', 'Pod fill: 30mm'] },
};

const METHODS = {
  'Flood':   { efficiency: 0.50, desc: 'Traditional flood irrigation — 50% efficiency' },
  'Furrow':  { efficiency: 0.65, desc: 'Furrow irrigation — 65% efficiency' },
  'Sprinkler': { efficiency: 0.80, desc: 'Sprinkler system — 80% efficiency' },
  'Drip':    { efficiency: 0.95, desc: 'Drip irrigation — 95% efficiency' },
};

const toHectare = (area, unit) => {
  if (unit === 'ropani') return area * 0.0509;
  if (unit === 'bigha') return area * 0.6772;
  if (unit === 'kattha') return area * 0.0339;
  return parseFloat(area);
};

export default function IrrigationCalc() {
  const [form, setForm] = useState({ crop: '', area: '', unit: 'ropani', method: 'Flood', duration: 30 });
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const crop = CROP_WATER[form.crop];
    const ha = toHectare(parseFloat(form.area), form.unit);
    const method = METHODS[form.method];
    const days = parseInt(form.duration);

    const dailyNeed = crop.daily * 10 * ha; // mm * 10 = liters per m2, * 10000 m2/ha
    const totalNeed = dailyNeed * days;
    const actualWater = totalNeed / method.efficiency;
    const irrigSessions = Math.ceil(days / 7);
    const perSession = actualWater / irrigSessions;

    setResult({
      ha: ha.toFixed(3),
      dailyNeed: (dailyNeed / 1000).toFixed(2),
      totalNeed: (totalNeed / 1000).toFixed(1),
      actualWater: (actualWater / 1000).toFixed(1),
      irrigSessions,
      perSession: (perSession / 1000).toFixed(2),
      efficiency: (method.efficiency * 100).toFixed(0),
      stages: crop.stages,
      savings: (((actualWater - totalNeed) / actualWater) * 100).toFixed(0),
    });
  };

  return (
    <div className="irrig-page">
      <div className="irrig-hero">
        <h2>💧 Irrigation Calculator</h2>
        <p>Calculate precise water requirements for your crops</p>
        <p className="nepali">आफ्नो बालीको लागि सिँचाइ आवश्यकता गणना गर्नुहोस्</p>
      </div>

      <div className="irrig-layout">
        <div className="irrig-form-box">
          <h3>🌾 Farm Details</h3>
          <form onSubmit={calculate} className="irrig-form">
            <div className="field-group">
              <label>🌱 Crop Type</label>
              <select value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} required>
                <option value="">Select Crop</option>
                {Object.keys(CROP_WATER).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>📐 Land Area</label>
              <div className="area-input">
                <input type="number" placeholder="Area" min="0.1" step="0.1"
                  value={form.area} onChange={e => setForm({...form, area: e.target.value})} required />
                <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                  <option value="ropani">Ropani</option>
                  <option value="bigha">Bigha</option>
                  <option value="kattha">Kattha</option>
                  <option value="hectare">Hectare</option>
                </select>
              </div>
            </div>
            <div className="field-group">
              <label>🚿 Irrigation Method</label>
              <select value={form.method} onChange={e => setForm({...form, method: e.target.value})}>
                {Object.entries(METHODS).map(([k, v]) => (
                  <option key={k} value={k}>{k} ({(v.efficiency*100).toFixed(0)}% efficient)</option>
                ))}
              </select>
              <small>{METHODS[form.method]?.desc}</small>
            </div>
            <div className="field-group">
              <label>📅 Crop Duration (days): <strong>{form.duration}</strong></label>
              <input type="range" min="20" max="180" value={form.duration}
                onChange={e => setForm({...form, duration: e.target.value})} />
              <div className="range-labels"><span>20 days</span><span>180 days</span></div>
            </div>
            <button type="submit" className="btn-irrig">💧 Calculate Water Need</button>
          </form>
        </div>

        {result && (
          <div className="irrig-results">
            <div className="irrig-summary">
              <div className="summary-card blue">
                <span>💧</span>
                <strong>{result.totalNeed} m³</strong>
                <p>Total Water Needed</p>
              </div>
              <div className="summary-card teal">
                <span>🚿</span>
                <strong>{result.actualWater} m³</strong>
                <p>Water to Apply ({result.efficiency}% eff.)</p>
              </div>
              <div className="summary-card green">
                <span>📅</span>
                <strong>{result.irrigSessions}</strong>
                <p>Irrigation Sessions</p>
              </div>
              <div className="summary-card orange">
                <span>⏱</span>
                <strong>{result.perSession} m³</strong>
                <p>Per Session</p>
              </div>
            </div>

            <div className="irrig-detail-card">
              <h4>📊 Daily Requirements</h4>
              <p>For <strong>{form.area} {form.unit}</strong> ({result.ha} ha) of <strong>{form.crop}</strong>:</p>
              <div className="detail-row">
                <span>Daily water need:</span>
                <strong>{result.dailyNeed} m³/day</strong>
              </div>
              <div className="detail-row">
                <span>Irrigation frequency:</span>
                <strong>Every 7 days</strong>
              </div>
              <div className="detail-row">
                <span>Irrigation method:</span>
                <strong>{form.method}</strong>
              </div>
              <div className="detail-row">
                <span>Method efficiency:</span>
                <strong>{result.efficiency}%</strong>
              </div>
            </div>

            <div className="irrig-detail-card">
              <h4>🌱 Crop Stage Water Requirements</h4>
              {result.stages.map((s, i) => (
                <div key={i} className="stage-row">
                  <span className="stage-num">{i + 1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="irrig-note">
              💡 <strong>Tip:</strong> Switching from Flood to Drip irrigation can save up to 45% water while maintaining crop yield. Consider drip irrigation for water-scarce areas of Nepal.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}