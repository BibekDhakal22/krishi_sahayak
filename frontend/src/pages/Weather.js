import { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';

export default function Weather() {
  const [districts, setDistricts] = useState([]);
  const [selected, setSelected] = useState('Kathmandu');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/weather/districts')
      .then(res => setDistricts(res.data));
  }, []);

  useEffect(() => {
    fetchWeather(selected);
  }, [selected]);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/weather/${city}`);
      setWeather(res.data);
    } catch {
      setError('Could not fetch weather. Please try again.');
    }
    setLoading(false);
  };

  const getWeatherBg = (desc) => {
    if (!desc) return '#1b5e20';
    if (desc.includes('rain')) return '#1565c0';
    if (desc.includes('cloud')) return '#455a64';
    if (desc.includes('clear')) return '#e65100';
    return '#1b5e20';
  };

  return (
    <div className="weather-page">
      <h2>🌦️ Nepal Weather & Farming Advisory</h2>

      <div className="district-selector">
        <label>Select District:</label>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading && <div className="loading">⏳ Fetching weather...</div>}
      {error && <div className="error">{error}</div>}

      {weather && !loading && (
        <div className="weather-container">
          <div className="weather-card" style={{ background: getWeatherBg(weather.description) }}>
            <div className="weather-top">
              <div>
                <h3>{weather.city}</h3>
                <p className="desc">{weather.description}</p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="weather icon"
              />
            </div>
            <div className="temp-main">{weather.temperature}°C</div>
            <div className="weather-details">
              <div className="detail">
                <span>🌡️ Feels Like</span>
                <strong>{weather.feels_like}°C</strong>
              </div>
              <div className="detail">
                <span>💧 Humidity</span>
                <strong>{weather.humidity}%</strong>
              </div>
              <div className="detail">
                <span>💨 Wind</span>
                <strong>{weather.wind_speed} m/s</strong>
              </div>
              <div className="detail">
                <span>🔽 Min</span>
                <strong>{weather.min_temp}°C</strong>
              </div>
              <div className="detail">
                <span>🔼 Max</span>
                <strong>{weather.max_temp}°C</strong>
              </div>
            </div>
          </div>

          <div className="advice-card">
            <h3>🌾 Farming Advisory</h3>
            <ul>
              {weather.farming_advice.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}