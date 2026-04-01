import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    crops: 'Crops', pests: 'Pests', weather: 'Weather',
    recommend: 'Recommend', chat: 'AI Chat', history: 'History',
    dashboard: 'Dashboard', profile: 'My Profile', logout: 'Logout',
    login: 'Login', register: 'Register', home_title: 'Smart Farming Starts Here',
    home_sub: 'AI-powered agriculture assistant helping Nepali farmers',
  },
  np: {
    crops: 'बाली', pests: 'कीरा', weather: 'मौसम',
    recommend: 'सिफारिस', chat: 'AI कुरा', history: 'इतिहास',
    dashboard: 'ड्यासबोर्ड', profile: 'मेरो प्रोफाइल', logout: 'बाहिर जानुस्',
    login: 'लगइन', register: 'दर्ता', home_title: 'स्मार्ट खेती यहाँबाट सुरु हुन्छ',
    home_sub: 'नेपाली किसानहरूको लागि AI कृषि सहायक',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = (key) => translations[lang][key] || key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);