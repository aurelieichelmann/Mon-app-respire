import React from 'react';

export default function Header({ menuOpen, setMenuOpen, setCurrentView, darkMode, setDarkMode }) {
  return (
    <header className="app-header">
      <div className="logo">🍃 Respire</div>
      
      <div className="menu-container">
        <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        
        {menuOpen && (
          <nav className="dropdown-menu">
            <button className="menu-item" onClick={() => { setCurrentView('respiration'); setMenuOpen(false); }}>
              🍃 Respiration
            </button>
            <button className="menu-item" onClick={() => { setCurrentView('journal'); setMenuOpen(false); }}>
              📖 Journal
            </button>
            <hr className="menu-divider" />
            <button className="menu-action-btn" onClick={() => { setDarkMode(!darkMode); setMenuOpen(false); }}>
              {darkMode ? '☀️ Mode Jour' : '🌙 Mode Nuit'}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}