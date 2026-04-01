import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Crops from './pages/Crops';
import Pests from './pages/Pests';
import Chat from './pages/Chat';
import Weather from './pages/Weather';
import Recommend from './pages/Recommend';
import History from './pages/History';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import FertilizerCalc from './pages/FertilizerCalc';
import CropCalendar from './pages/CropCalendar';
import MarketPrice from './pages/MarketPrice';
import SoilChecker from './pages/SoilChecker';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar setToken={setToken} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/pests" element={<Pests />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/fertilizer" element={<FertilizerCalc />} />
          <Route path="/calendar" element={<CropCalendar />} />
          <Route path="/market" element={<MarketPrice />} />
          <Route path="/soil" element={<SoilChecker />} />
          <Route path="/chat" element={token ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/history" element={token ? <History /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/admin" element={token ? <Admin /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </LanguageProvider>
  );
}
export default App;