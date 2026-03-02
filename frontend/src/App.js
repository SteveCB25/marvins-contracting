import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from './components/ui/toaster';
import Home from './pages/Home';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <SpeedInsights />
      </div>
    </LanguageProvider>
  );
}

export default App;