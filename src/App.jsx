import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Respiration from './components/Respiration.jsx';
import Journal from './components/Journal.jsx';
import './App.css';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('respiration');
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');
  const [showNameModal, setShowNameModal] = useState(!localStorage.getItem('user_name'));

  // Cache l'écran de démarrage après 6,5 secondes
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 6500);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveName = () => {
    if (!userName.trim()) return; // on refuse un prénom vide
    localStorage.setItem('user_name', userName.trim());
    setUserName(userName.trim());
    setShowNameModal(false);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {showNameModal && (
        <div className="modal-overlay">
          <div className="card">
            <h2>Bienvenue !</h2>
            <p>Comment souhaites-tu être appelé(e) ?</p>
            <input
              type="text"
              placeholder="Ton prénom..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button className="btn-save" onClick={handleSaveName}>
              C'est parti
            </button>
          </div>
        </div>
      )}

      {showSplash ? (
        <div className="splash-screen">
          <video
            autoPlay
            muted
            playsInline
            onEnded={() => setShowSplash(false)}
            className="splash-logo-video"
          >
            <source src="/Respire.mp4" type="video/mp4" />
          </video>
        </div>
      ) : (
        <>
          <Header
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            setCurrentView={setCurrentView}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <main className="main-wrapper">
            {currentView === 'respiration' && <Respiration userName={userName} />}
            {currentView === 'journal' && <Journal />}
          </main>
        </>
      )}
    </div>
  );
}