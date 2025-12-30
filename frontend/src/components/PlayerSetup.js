import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayerSetup.css';

const PlayerSetup = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [level, setLevel] = useState('Easy');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Tafadhali ingiza jina lako');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('Jina lazima liwe na angalau herufi 2');
      return;
    }

    // Save to sessionStorage
    sessionStorage.setItem('playerName', playerName.trim());
    sessionStorage.setItem('level', level);

    // Navigate to quiz
    navigate('/quiz');
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <div className="setup-header">
          <h1>Karibu! 👋</h1>
          <p>Ingiza jina lako na chagua kiwango</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="playerName">Jina Lako</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              placeholder="Ingiza jina lako hapa..."
              maxLength={30}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="level">Chagua Kiwango</label>
            <div className="level-buttons">
              <button
                type="button"
                className={`level-btn ${level === 'Easy' ? 'active' : ''}`}
                onClick={() => setLevel('Easy')}
              >
                <span className="level-emoji">⭐</span>
                <div>
                  <div className="level-name">Rahisi</div>
                  <div className="level-age">Umri 5-7</div>
                </div>
              </button>
              <button
                type="button"
                className={`level-btn ${level === 'Medium' ? 'active' : ''}`}
                onClick={() => setLevel('Medium')}
              >
                <span className="level-emoji">⭐⭐</span>
                <div>
                  <div className="level-name">Wastani</div>
                  <div className="level-age">Umri 8-10</div>
                </div>
              </button>
              <button
                type="button"
                className={`level-btn ${level === 'Hard' ? 'active' : ''}`}
                onClick={() => setLevel('Hard')}
              >
                <span className="level-emoji">⭐⭐⭐</span>
                <div>
                  <div className="level-name">Gumu</div>
                  <div className="level-age">Umri 11-13</div>
                </div>
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-start">
            Anza Mchezo 🎮
          </button>
        </form>

        <button className="btn-back" onClick={() => navigate('/')}>
          Rudi Nyuma
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;

