import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Crops from './pages/Crops';
import Pests from './pages/Pests';
import Chat from './pages/Chat';
import Weather from './pages/Weather';
import Admin from './pages/Admin';
import Recommend from './pages/Recommend';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar setToken={setToken} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/pests" element={<Pests />} />
        <Route path="/chat" element={token ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
export default App;