import React, { useState } from 'react';

const MOODS = [
  { id: 'anxieux', emoji: '😰', label: 'Anxieux' },
  { id: 'tendu', emoji: '😟', label: 'Tendu' },
  { id: 'neutre', emoji: '😐', label: 'Neutre' },
  { id: 'calme', emoji: '🌿', label: 'Calme' },
  { id: 'serein', emoji: '✨', label: 'Serein' }
];

function loadHistory() {
  return JSON.parse(localStorage.getItem('mind_history') || '[]');
}

export default function Journal() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState(loadHistory);
  const [showConfirm, setShowConfirm] = useState(false);

  // Met à jour l'état ET le localStorage en même temps
  const updateHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem('mind_history', JSON.stringify(newHistory));
  };

  const handleSave = () => {
    if (!selectedMood && !note.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      mood: selectedMood,
      note: note.trim()
    };

    updateHistory([newEntry, ...history]);
    setSelectedMood(null);
    setNote('');
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 3000);
  };

  const handleDelete = (id) => {
    updateHistory(history.filter((item) => item.id !== id));
  };

  return (
    <section className="app-view">
      <div className="card">
        <h2>Mon Journal & Ressenti</h2>
        <p className="subtitle">Comment te sens-tu en ce moment ?</p>

        <div className="mood-selector">
          {MOODS.map((m) => (
            <button
              key={m.id}
              title={m.label}
              className={`mood-btn ${selectedMood?.id === m.id ? 'selected' : ''}`}
              onClick={() => setSelectedMood(m)}
            >
              {m.emoji}
            </button>
          ))}
        </div>

        <textarea
          className="journal-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ajouter une petite note sur ton état d'esprit..."
        />

        <button className="btn-save" onClick={handleSave}>Enregistrer mon ressenti</button>

        {showConfirm && <p className="confirm-message">Enregistré avec succès !</p>}

        <div className="history-list">
          <h3>Historique des sessions</h3>

          {history.length === 0 ? (
            <p className="history-empty">Aucune entrée pour le moment.</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-item">
                <button className="delete-btn" title="Supprimer" onClick={() => handleDelete(item.id)}>
                  ✕
                </button>
                <span className="history-date">{item.date}</span>
                {item.mood && <p>Ressenti : {item.mood.emoji} {item.mood.label}</p>}
                {item.note && <p className="history-note">"{item.note}"</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}