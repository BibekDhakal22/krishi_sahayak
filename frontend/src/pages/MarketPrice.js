import { useState } from 'react';
import './MarketPrice.css';

const MARKET_PRICES = [
  { crop: 'Rice', nepali: 'धान', min: 35, max: 45, unit: 'kg', trend: 'up', market: 'Kalimati' },
  { crop: 'Wheat', nepali: 'गहुँ', min: 30, max: 38, unit: 'kg', trend: 'stable', market: 'Kalimati' },
  { crop: 'Maize', nepali: 'मकै', min: 25, max: 32, unit: 'kg', trend: 'down', market: 'Kalimati' },
  { crop: 'Potato', nepali: 'आलु', min: 20, max: 35, unit: 'kg', trend: 'up', market: 'Kalimati' },
  { crop: 'Tomato', nepali: 'टमाटर', min: 30, max: 60, unit: 'kg', trend: 'up', market: 'Kalimati' },
  { crop: 'Mustard', nepali: 'तोरी', min: 70, max: 90, unit: 'kg', trend: 'stable', market: 'Kalimati' },
  { crop: 'Ginger', nepali: 'अदुवा', min: 80, max: 120, unit: 'kg', trend: 'up', market: 'Kalimati' },
  { crop: 'Onion', nepali: 'प्याज', min: 25, max: 45, unit: 'kg', trend: 'down', market: 'Kalimati' },
  { crop: 'Garlic', nepali: 'लसुन', min: 150, max: 220, unit: 'kg', trend: 'up', market: 'Kalimati' },
  { crop: 'Cabbage', nepali: 'बन्दा', min: 15, max: 25, unit: 'kg', trend: 'stable', market: 'Kalimati' },
  { crop: 'Cauliflower', nepali: 'काउली', min: 20, max: 40, unit: 'kg', trend: 'up', market: 'Kalimati' },
  { crop: 'Lentil', nepali: 'मसुर', min: 120, max: 160, unit: 'kg', trend: 'stable', market: 'Kalimati' },
];

export default function MarketPrice() {
  const [search, setSearch] = useState('');
  const today = new Date().toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' });

  const filtered = MARKET_PRICES.filter(p =>
    p.crop.toLowerCase().includes(search.toLowerCase()) ||
    p.nepali.includes(search)
  );

  const trendIcon = (t) => t === 'up' ? '📈' : t === 'down' ? '📉' : '➡️';
  const trendColor = (t) => t === 'up' ? '#2e7d32' : t === 'down' ? '#c62828' : '#f57f17';
  const avg = (min, max) => Math.round((min + max) / 2);

  return (
    <div className="market-page">
      <div className="market-hero">
        <h2>💰 Nepal Market Prices</h2>
        <p>Daily crop prices from Kalimati Fruits & Vegetables Market</p>
        <p className="nepali">कालिमाटी फलफूल तथा तरकारी बजारको दैनिक मूल्य</p>
        <span className="date-badge">📅 {today}</span>
      </div>

      <div className="market-controls">
        <input className="market-search" placeholder="🔍 Search crop..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="market-note">
          ℹ️ Prices are indicative. Check <a href="https://kalimatimarket.gov.np" target="_blank" rel="noreferrer">kalimatimarket.gov.np</a> for live prices.
        </div>
      </div>

      <div className="market-grid">
        {filtered.map((item, i) => (
          <div key={i} className="price-card">
            <div className="price-header">
              <div>
                <h3>{item.crop}</h3>
                <span className="nepali-name">{item.nepali}</span>
              </div>
              <span className="trend-badge" style={{ color: trendColor(item.trend) }}>
                {trendIcon(item.trend)}
              </span>
            </div>
            <div className="price-main">
              <span className="price-avg">Rs. {avg(item.min, item.max)}</span>
              <span className="price-unit">per {item.unit}</span>
            </div>
            <div className="price-range">
              <span className="min-price">Min: Rs. {item.min}</span>
              <div className="price-bar">
                <div className="price-fill" style={{ width: `${((avg(item.min, item.max) - item.min) / (item.max - item.min)) * 100}%` }}></div>
              </div>
              <span className="max-price">Max: Rs. {item.max}</span>
            </div>
            <div className="market-name">📍 {item.market} Market</div>
          </div>
        ))}
      </div>
    </div>
  );
}