import React, { useState, useEffect } from 'react';
import './App.css';

const AFFIRMATIONS = [
  "Chaque respiration profonde m'apporte un peu plus de sérénité.",
  "Je prends le temps de me déposer, ici et maintenant.",
  "Mon corps sait comment se détendre et retrouver son calme.",
  "Je ne suis pas mes pensées, je suis l'espace dans lequel elles passent.",
  "Aujourd'hui, je choisis d'être doux(ce) avec moi-même."
];

const MOODS = [
  { id: 'anxieux', emoji: '😰', label: 'Anxieux' },
  { id: 'tendu', emoji: '😟', label: 'Tendu' },
  { id: 'neutre', emoji: '😐', label: 'Neutre' },
  { id: 'calme', emoji: '🌿', label: 'Calme' },
  { id: 'serein', emoji: '✨', label: 'Serein' }
];

const BREATHING_TECHNIQUES = [
  { id: 'libre', label: 'Respiration Libre', duration: 8, description: 'Sans limite de temps' },
  { id: 'coherence', label: 'Cohérence Cardiaque (10s)', duration: 10, description: '5s inspiration, 5s expiration' },
  { id: 'relaxation', label: 'Relaxation (8s)', duration: 8, description: '4s inspiration, 4s expiration' },
  { id: 'rapide', label: 'Apaisement rapide (6s)', duration: 6, description: '3s inspiration, 3s expiration' }
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('respiration');
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Nouveaux états
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');
  const [showNameModal, setShowNameModal] = useState(!localStorage.getItem('user_name'));
  
  const [technique, setTechnique] = useState(BREATHING_TECHNIQUES[0]);
  const [breathText, setBreathText] = useState('Inspire...');
  const [isBreathing, setIsBreathing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [affirmation, setAffirmation] = useState('');

  // Statistiques de la semaine
  const getWeeklyStats = () => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyEntries = history.filter(item => item.timestamp > oneWeekAgo);
    return weeklyEntries.reduce((acc, entry) => {
      if (entry.mood) acc[entry.mood.label] = (acc[entry.mood.label] || 0) + 1;
      return acc;
    }, {});
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 6500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('mind_history') || '[]');
    setHistory(savedHistory);
    const today = new Date().toDateString();
    const savedData = JSON.parse(localStorage.getItem('daily_affirmation') || '{}');
    if (savedData.date === today && savedData.text) {
      setAffirmation(savedData.text);
    } else {
      const randomAffirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
      setAffirmation(randomAffirmation);
      localStorage.setItem('daily_affirmation', JSON.stringify({ date: today, text: randomAffirmation }));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathText((prev) => (prev === 'Inspire...' ? 'Expire...' : 'Inspire...'));
    }, (technique.duration * 1000) / 2);
    return () => clearInterval(interval);
  }, [technique]);

  useEffect(() => {
    if (isBreathing && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isBreathing) {
      setIsBreathing(false);
    }
  }, [isBreathing, timeLeft]);

  const startSession = () => {
    setIsBreathing(true);
    setTimeLeft(technique.id === 'libre' ? -1 : 180); 
  };

  const handleSaveEntry = () => {
    if (!selectedMood && !note.trim()) return;
    const newEntry = {
      id: Date.now(),
      timestamp: Date.now(),
      date: new Date().toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      note: note.trim()
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('mind_history', JSON.stringify(updatedHistory));
    setSelectedMood(null);
    setNote('');
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 3000);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {showNameModal && (
        <div className="modal-overlay">
          <div className="card">
            <h2>Bienvenue !</h2>
            <p>Comment souhaites-tu être appelé(e) ?</p>
            <input type="text" placeholder="Ton prénom..." onChange={(e) => setUserName(e.target.value)} />
            <button className="btn-save" onClick={() => { localStorage.setItem('user_name', userName); setShowNameModal(false); }}>
              C'est parti
            </button>
          </div>
        </div>
      )}

      {showSplash ? (
        <div className="splash-screen">
          <video autoPlay muted playsInline loop={false} onEnded={() => setShowSplash(false)} className="splash-logo-video">
            <source src="/Respire.mp4" type="video/mp4" />
          </video>
        </div>
      ) : (
        <>
          <header className="app-header">
            <div className="logo">🍃 Respire</div>
            <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
            {menuOpen && (
              <nav className="dropdown-menu">
                <button onClick={() => { setCurrentView('respiration'); setMenuOpen(false); }}>Respiration</button>
                <button onClick={() => { setCurrentView('journal'); setMenuOpen(false); }}>Journal</button>
                <button onClick={() => { setDarkMode(!darkMode); setMenuOpen(false); }}>{darkMode ? 'Mode Jour' : 'Mode Nuit'}</button>
              </nav>
            )}
          </header>

          <main className="main-wrapper">
            {currentView === 'respiration' && (
              <section className="app-view">
                <div className="card">
                  {!isBreathing ? (
                    <>
                      <h1>Bonjour {userName || 'à toi'},</h1>
                      <p className="subtitle">Prêt pour une pause ?</p>
                      <div className="controls">
                        {BREATHING_TECHNIQUES.map((t) => (
                          <button 
                            key={t.id} 
                            className={`btn-rhythm ${technique.id === t.id ? 'active' : ''}`} 
                            onClick={() => setTechnique(t)}
                          >
                            {t.label}
                          </button>
                        ))}
                        <button className="btn-save" onClick={startSession}>Commencer</button>
                      </div>
                    </>
                  ) : (
                    <>
                    <h1>{technique.label}</h1>
                    <div className="cercle-wrapper">
                      <div className="cercle" style={{ animationDuration: `${technique.duration}s` }}>
                        <span className="cercle-text">{breathText}</span>
                      </div>
                    </div>
                    
                    {timeLeft !== -1 ? (
                      <p className="subtitle">Temps restant : {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
                    ) : (
                      <p className="subtitle">Mode libre : respire à ton rythme.</p>
                    )}
                    
                    <button className="btn-rhythm" onClick={() => setIsBreathing(false)} style={{ marginTop: '20px' }}>
                      Arrêter
                    </button>
                  </>
                )}
                </div>
              </section>
            )}

            {currentView === 'journal' && (
              <section className="app-view">
                <div className="card">
                  <div className="stats-box">
                    <h3>Ton résumé de la semaine</h3>
                    {Object.entries(getWeeklyStats()).map(([mood, count]) => (
                      <span key={mood} className="stat-pill">{mood} : {count}</span>
                    ))}
                  </div>
                  {/* ... reste du code journal ... */}
                </div>
              </section>
            )}
          </main>
        </>
      )}
    </div>
  );
}