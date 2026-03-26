import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Admin.css';

const API = 'http://localhost:5000/api/admin';
const emptyCrop = { name: '', nepali_name: '', season: 'summer', region: '', description: '', fertilizer_tips: '', water_requirements: '', harvest_duration: '' };
const emptyPest = { name: '', nepali_name: '', affected_crops: '', symptoms: '', treatment: '', prevention: '' };

export default function Admin() {
  const [tab, setTab] = useState('crops');
  const [crops, setCrops] = useState([]);
  const [pests, setPests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [cropForm, setCropForm] = useState(emptyCrop);
  const [pestForm, setPestForm] = useState(emptyPest);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchCrops(); fetchPests(); }, []);

  const fetchCrops = async () => {
    const res = await axios.get(`${API}/crops`, { headers });
    setCrops(res.data);
  };

  const fetchPests = async () => {
    const res = await axios.get(`${API}/pests`, { headers });
    setPests(res.data);
  };

  if (role !== 'admin') {
    return (
      <div className="admin-denied">
        <h2>⛔ Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  // ── CROP HANDLERS ──
  const handleCropSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/crops/${editing}`, cropForm, { headers });
        toast.success('Crop updated!');
      } else {
        await axios.post(`${API}/crops`, cropForm, { headers });
        toast.success('Crop added!');
      }
      fetchCrops();
      setShowForm(false);
      setEditing(null);
      setCropForm(emptyCrop);
    } catch { toast.error('Something went wrong'); }
  };

  const editCrop = (crop) => {
    setEditing(crop.id);
    setCropForm(crop);
    setShowForm(true);
    setTab('crops');
  };

  const deleteCrop = async (id) => {
    if (!window.confirm('Delete this crop?')) return;
    await axios.delete(`${API}/crops/${id}`, { headers });
    toast.success('Crop deleted!');
    fetchCrops();
  };

  // ── PEST HANDLERS ──
  const handlePestSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${API}/pests/${editing}`, pestForm, { headers });
        toast.success('Pest updated!');
      } else {
        await axios.post(`${API}/pests`, pestForm, { headers });
        toast.success('Pest added!');
      }
      fetchPests();
      setShowForm(false);
      setEditing(null);
      setPestForm(emptyPest);
    } catch { toast.error('Something went wrong'); }
  };

  const editPest = (pest) => {
    setEditing(pest.id);
    setPestForm(pest);
    setShowForm(true);
    setTab('pests');
  };

  const deletePest = async (id) => {
    if (!window.confirm('Delete this pest?')) return;
    await axios.delete(`${API}/pests/${id}`, { headers });
    toast.success('Pest deleted!');
    fetchPests();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>⚙️ Admin Panel</h2>
        <button className="btn-add" onClick={() => { setShowForm(true); setEditing(null); setCropForm(emptyCrop); setPestForm(emptyPest); }}>
          + Add New
        </button>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'crops' ? 'active' : ''} onClick={() => setTab('crops')}>🌱 Crops ({crops.length})</button>
        <button className={tab === 'pests' ? 'active' : ''} onClick={() => setTab('pests')}>🐛 Pests ({pests.length})</button>
      </div>

      {/* CROP FORM */}
      {showForm && tab === 'crops' && (
        <div className="admin-form-box">
          <h3>{editing ? 'Edit Crop' : 'Add New Crop'}</h3>
          <form onSubmit={handleCropSubmit} className="admin-form">
            <div className="form-row">
              <input placeholder="Crop Name (English)" value={cropForm.name} onChange={e => setCropForm({...cropForm, name: e.target.value})} required />
              <input placeholder="Crop Name (Nepali)" value={cropForm.nepali_name} onChange={e => setCropForm({...cropForm, nepali_name: e.target.value})} />
            </div>
            <div className="form-row">
              <select value={cropForm.season} onChange={e => setCropForm({...cropForm, season: e.target.value})}>
                <option value="summer">Summer</option>
                <option value="winter">Winter</option>
                <option value="all">All Season</option>
              </select>
              <input placeholder="Region (e.g. Terai, Hill, All)" value={cropForm.region} onChange={e => setCropForm({...cropForm, region: e.target.value})} required />
            </div>
            <textarea placeholder="Description" value={cropForm.description} onChange={e => setCropForm({...cropForm, description: e.target.value})} required />
            <textarea placeholder="Fertilizer Tips" value={cropForm.fertilizer_tips} onChange={e => setCropForm({...cropForm, fertilizer_tips: e.target.value})} />
            <textarea placeholder="Water Requirements" value={cropForm.water_requirements} onChange={e => setCropForm({...cropForm, water_requirements: e.target.value})} />
            <input placeholder="Harvest Duration (e.g. 90-120 days)" value={cropForm.harvest_duration} onChange={e => setCropForm({...cropForm, harvest_duration: e.target.value})} />
            <div className="form-btns">
              <button type="submit" className="btn-save">{editing ? 'Update Crop' : 'Add Crop'}</button>
              <button type="button" className="btn-cancel" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* PEST FORM */}
      {showForm && tab === 'pests' && (
        <div className="admin-form-box">
          <h3>{editing ? 'Edit Pest' : 'Add New Pest'}</h3>
          <form onSubmit={handlePestSubmit} className="admin-form">
            <div className="form-row">
              <input placeholder="Pest Name (English)" value={pestForm.name} onChange={e => setPestForm({...pestForm, name: e.target.value})} required />
              <input placeholder="Pest Name (Nepali)" value={pestForm.nepali_name} onChange={e => setPestForm({...pestForm, nepali_name: e.target.value})} />
            </div>
            <input placeholder="Affected Crops (e.g. Rice, Wheat)" value={pestForm.affected_crops} onChange={e => setPestForm({...pestForm, affected_crops: e.target.value})} required />
            <textarea placeholder="Symptoms" value={pestForm.symptoms} onChange={e => setPestForm({...pestForm, symptoms: e.target.value})} required />
            <textarea placeholder="Treatment" value={pestForm.treatment} onChange={e => setPestForm({...pestForm, treatment: e.target.value})} required />
            <textarea placeholder="Prevention" value={pestForm.prevention} onChange={e => setPestForm({...pestForm, prevention: e.target.value})} />
            <div className="form-btns">
              <button type="submit" className="btn-save">{editing ? 'Update Pest' : 'Add Pest'}</button>
              <button type="button" className="btn-cancel" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* CROPS TABLE */}
      {tab === 'crops' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Nepali</th><th>Season</th><th>Region</th><th>Harvest</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.map(crop => (
                <tr key={crop.id}>
                  <td>{crop.id}</td>
                  <td>{crop.name}</td>
                  <td>{crop.nepali_name}</td>
                  <td><span className="badge-season">{crop.season}</span></td>
                  <td>{crop.region}</td>
                  <td>{crop.harvest_duration}</td>
                  <td>
                    <button className="btn-edit" onClick={() => editCrop(crop)}>✏️ Edit</button>
                    <button className="btn-delete" onClick={() => deleteCrop(crop.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PESTS TABLE */}
      {tab === 'pests' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Nepali</th><th>Affected Crops</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pests.map(pest => (
                <tr key={pest.id}>
                  <td>{pest.id}</td>
                  <td>{pest.name}</td>
                  <td>{pest.nepali_name}</td>
                  <td>{pest.affected_crops}</td>
                  <td>
                    <button className="btn-edit" onClick={() => editPest(pest)}>✏️ Edit</button>
                    <button className="btn-delete" onClick={() => deletePest(pest.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}