import { useState } from 'react';
import './CropCalendar.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const NEPALI_MONTHS = ['माघ','फागुन','चैत','बैशाख','जेठ','असार','साउन','भदौ','असोज','कार्तिक','मंसिर','पुस'];

const CROP_CALENDAR = [
  { crop: 'Rice', nepali: 'धान', color: '#2e7d32', planting: [5,6], growing: [6,7,8], harvesting: [9,10], region: 'Terai/Hill' },
  { crop: 'Wheat', nepali: 'गहुँ', color: '#f57f17', planting: [10,11], growing: [11,0,1], harvesting: [2,3], region: 'Terai/Hill' },
  { crop: 'Maize', nepali: 'मकै', color: '#e65100', planting: [3,4], growing: [4,5,6], harvesting: [7,8], region: 'Hill' },
  { crop: 'Potato', nepali: 'आलु', color: '#6a1b9a', planting: [9,10], growing: [10,11,0], harvesting: [1,2], region: 'Hill' },
  { crop: 'Tomato', nepali: 'टमाटर', color: '#c62828', planting: [1,2], growing: [2,3,4], harvesting: [4,5,6], region: 'All' },
  { crop: 'Mustard', nepali: 'तोरी', color: '#f9a825', planting: [9,10], growing: [10,11], harvesting: [0,1], region: 'Terai' },
  { crop: 'Ginger', nepali: 'अदुवा', color: '#558b2f', planting: [2,3], growing: [3,4,5,6,7], harvesting: [9,10], region: 'Hill' },
  { crop: 'Lentil', nepali: 'मसुर', color: '#795548', planting: [10,11], growing: [11,0], harvesting: [1,2], region: 'Terai' },
];

const currentMonth = new Date().getMonth();

export default function CropCalendar() {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [filterRegion, setFilterRegion] = useState('All');

  const getCellType = (crop, monthIndex) => {
    if (crop.planting.includes(monthIndex)) return 'planting';
    if (crop.harvesting.includes(monthIndex)) return 'harvesting';
    if (crop.growing.includes(monthIndex)) return 'growing';
    return 'none';
  };

  const filtered = filterRegion === 'All' ? CROP_CALENDAR :
    CROP_CALENDAR.filter(c => c.region.includes(filterRegion));

  return (
    <div className="calendar-page">
      <div className="calendar-hero">
        <h2>📅 Nepal Crop Calendar</h2>
        <p>Monthly planting and harvesting schedule for Nepal's major crops</p>
        <p className="nepali">नेपालका प्रमुख बालीहरूको मासिक रोपाई तथा कटनी तालिका</p>
      </div>

      <div className="calendar-controls">
        <div className="legend">
          <span className="leg planting">🌱 Planting</span>
          <span className="leg growing">🌿 Growing</span>
          <span className="leg harvesting">🌾 Harvesting</span>
          <span className="leg current">📍 Current Month</span>
        </div>
        <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)} className="region-filter">
          <option value="All">All Regions</option>
          <option value="Terai">Terai</option>
          <option value="Hill">Hill</option>
        </select>
      </div>

      <div className="calendar-wrap">
        <table className="calendar-table">
          <thead>
            <tr>
              <th className="crop-col">Crop</th>
              {MONTHS.map((m, i) => (
                <th key={i} className={i === currentMonth ? 'current-month' : ''}>
                  <div>{m}</div>
                  <div className="nepali-month">{NEPALI_MONTHS[i]}</div>
                </th>
              ))}
              <th>Region</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((crop, ci) => (
              <tr key={ci} onClick={() => setSelectedCrop(crop === selectedCrop ? null : crop)}
                className={selectedCrop === crop ? 'selected-row' : ''}>
                <td className="crop-name-cell">
                  <strong style={{ color: crop.color }}>{crop.crop}</strong>
                  <span>{crop.nepali}</span>
                </td>
                {MONTHS.map((_, mi) => {
                  const type = getCellType(crop, mi);
                  return (
                    <td key={mi} className={`cell ${type} ${mi === currentMonth ? 'current-col' : ''}`}>
                      {type === 'planting' && '🌱'}
                      {type === 'growing' && '🌿'}
                      {type === 'harvesting' && '🌾'}
                    </td>
                  );
                })}
                <td className="region-cell">{crop.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCrop && (
        <div className="crop-detail-card">
          <h3 style={{ color: selectedCrop.color }}>{selectedCrop.crop} ({selectedCrop.nepali})</h3>
          <div className="detail-grid">
            <div><strong>🌱 Planting Months:</strong> {selectedCrop.planting.map(m => MONTHS[m]).join(', ')}</div>
            <div><strong>🌿 Growing Period:</strong> {selectedCrop.growing.map(m => MONTHS[m]).join(', ')}</div>
            <div><strong>🌾 Harvest Months:</strong> {selectedCrop.harvesting.map(m => MONTHS[m]).join(', ')}</div>
            <div><strong>📍 Best Region:</strong> {selectedCrop.region}</div>
          </div>
        </div>
      )}
    </div>
  );
}