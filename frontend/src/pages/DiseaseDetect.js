import { useState, useRef } from 'react';
import axios from 'axios';
import './DiseaseDetect.css';

export default function DiseaseDetect() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();
  const token = localStorage.getItem('token');

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = async () => {
      const fullResult = reader.result;
      const base64 = fullResult.split(',')[1];
      const mimeType = fullResult.split(';')[0].split(':')[1];
      try {
        const res = await axios.post('http://localhost:5000/api/disease/analyze',
          { image: base64, mime_type: mimeType, filename: image.name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResult(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Analysis failed. Please try again.');
      }
      setLoading(false);
    };
    reader.readAsDataURL(image);
  };

  const severityColor = (s) => {
    if (!s) return '#888';
    if (s.toLowerCase().includes('severe')) return '#c62828';
    if (s.toLowerCase().includes('moderate')) return '#f57f17';
    return '#2e7d32';
  };

  return (
    <div className="disease-page">
      <div className="disease-hero">
        <h2>🔬 Crop Disease Detection</h2>
        <p>Upload a photo of your crop and AI will identify diseases instantly</p>
        <p className="nepali">आफ्नो बालीको फोटो अपलोड गर्नुहोस् — AI ले रोग पहिचान गर्नेछ</p>
      </div>

      <div className="disease-layout">
        <div className="upload-box">
          <h3>📷 Upload Crop Photo</h3>
          <div className={`drop-zone ${preview ? 'has-image' : ''}`}
            onClick={() => fileRef.current.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}>
            {preview ? (
              <img src={preview} alt="crop" className="preview-img" />
            ) : (
              <div className="drop-placeholder">
                <span>📸</span>
                <p>Click or drag & drop a photo here</p>
                <small>JPG, PNG supported • Max 10MB</small>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />

          {preview && (
            <div className="upload-actions">
              <button className="btn-change" onClick={() => fileRef.current.click()}>📁 Change Photo</button>
              <button className="btn-analyze-img" onClick={analyze} disabled={loading}>
                {loading ? '⏳ Analyzing...' : '🔬 Analyze Disease'}
              </button>
            </div>
          )}

          {error && <div className="error-msg">❌ {error}</div>}

          <div className="tips-box">
            <h4>📌 Tips for Better Results</h4>
            <ul>
              <li>Take photo in good lighting</li>
              <li>Focus on affected leaves or stems</li>
              <li>Include both healthy and diseased parts</li>
              <li>Avoid blurry or dark photos</li>
            </ul>
          </div>
        </div>

        {result && (
          <div className="disease-result">
            <div className="result-header">
              <h3>🔍 Analysis Result</h3>
              <span className="confidence-badge">AI Confidence: High</span>
            </div>

            <div className="disease-name-card">
              <div>
                <h2>{result.disease}</h2>
                {result.nepali_name && <p className="disease-nepali">{result.nepali_name}</p>}
              </div>
              {result.severity && (
                <span className="severity-badge" style={{ background: severityColor(result.severity) + '20', color: severityColor(result.severity) }}>
                  {result.severity}
                </span>
              )}
            </div>

            <div className="result-grid">
              {result.description && (
                <div className="result-item">
                  <h4>📋 Description</h4>
                  <p>{result.description}</p>
                </div>
              )}
              {result.symptoms && (
                <div className="result-item">
                  <h4>🔍 Symptoms</h4>
                  <p>{result.symptoms}</p>
                </div>
              )}
              {result.treatment && (
                <div className="result-item">
                  <h4>💊 Treatment</h4>
                  <p>{result.treatment}</p>
                </div>
              )}
              {result.prevention && (
                <div className="result-item">
                  <h4>🛡️ Prevention</h4>
                  <p>{result.prevention}</p>
                </div>
              )}
            </div>

            {result.affected_crops && (
              <div className="affected-note">
                🌱 <strong>Commonly affects:</strong> {result.affected_crops}
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <div className="disease-placeholder">
            <span>🌿</span>
            <h3>Upload a crop photo to get started</h3>
            <p>Our AI can detect common crop diseases including rice blast, late blight, aphid damage, stem borer, and more.</p>
            <div className="sample-diseases">
              {['Rice Blast', 'Late Blight', 'Aphid Damage', 'Stem Borer', 'Powdery Mildew'].map((d, i) => (
                <span key={i} className="disease-chip">{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}