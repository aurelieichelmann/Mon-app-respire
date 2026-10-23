import React, { useState, useEffect } from 'react';

const TECHNIQUES = [
  { id: 'libre', label: 'Respiration Libre', duration: 8, description: 'Sans limite de temps' },
  { id: 'coherence', label: 'Cohérence Cardiaque (10s)', duration: 10, description: '5s inspiration, 5s expiration' },
  { id: 'relaxation', label: 'Relaxation (8s)', duration: 8, description: '4s inspiration, 4s expiration' },
  { id: 'rapide', label: 'Apaisement rapide (6s)', duration: 6, description: '3s inspiration, 3s expiration' }
];

const AFFIRMATIONS = [
  "Chaque respiration profonde m'apporte un peu plus de sérénité.",
  "Je prends le temps de me déposer, ici et maintenant.",
  "Mon corps sait comment se détendre et retrouver son calme.",
  "Je ne suis pas mes pensées, je suis l'espace dans lequel elles passent.",
  "Aujourd'hui, je choisis d'être doux(ce) avec moi-même."
];

// Une affirmation par jour, gardée dans le localStorage
function getDailyAffirmation() {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem('daily_affirmation') || '{}');

  if (saved.date === today && saved.text) return saved.text;

  const text = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
  localStorage.setItem('daily_affirmation', JSON.stringify({ date: today, text }));
  return text;
}

export default function Respiration({ userName }) {
  const [technique, setTechnique] = useState(TECHNIQUES[0]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('Inspire...');
  const [timeLeft, setTimeLeft] = useState(0);
  const [affirmation] = useState(getDailyAffirmation);

  // Change "Inspire..." / "Expire..." pendant la séance
  useEffect(() => {
    if (!isBreathing) return;
    const interval = setInterval(() => {
      setBreathText((prev) => (prev === 'Inspire...' ? 'Expire...' : 'Inspire...'));
    }, (technique.duration * 1000) / 2);
    return () => clearInterval(interval);
  }, [technique, isBreathing]);

  // Décompte du temps (sauf en mode libre, où timeLeft vaut -1)
  useEffect(() => {
    if (!isBreathing || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isBreathing, timeLeft]);

  // Fin de la séance quand le temps arrive à 0
  useEffect(() => {
    if (isBreathing && timeLeft === 0) setIsBreathing(false);
  }, [isBreathing, timeLeft]);

  const startSession = (t) => {
  setTechnique(t);
  setBreathText('Inspire...');
  setTimeLeft(t.id === 'libre' ? -1 : t.duration * 6);
  setIsBreathing(true);
};

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <section className="app-view">
      <div className="card">
        {!isBreathing ? (
          <>
            <h1>Bonjour {userName || 'à toi'},</h1>
            <p className="subtitle">Prêt pour une pause ?</p>
            <p className="affirmation">{affirmation}</p>

          <div className="controls">
              {TECHNIQUES.map((t) => (
                <button key={t.id} className="btn-rhythm" onClick={() => startSession(t)}>
              {t.label}
             </button>
              ))}
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

            <p className="subtitle">
              {timeLeft === -1
                ? 'Mode libre : respire à ton rythme.'
                : `Temps restant : ${minutes}:${seconds}`}
            </p>

            <button className="btn-rhythm btn-stop" onClick={() => setIsBreathing(false)}>
              Arrêter
            </button>
          </>
        )}
      </div>
    </section>
  );
}