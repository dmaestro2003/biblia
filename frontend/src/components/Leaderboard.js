import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './Leaderboard.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/scores/leaderboard');
      setScores(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Imeshindwa kupata matokeo. Tafadhali jaribu tena.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMedalEmoji = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${index + 1}.`;
    }
  };

  const getLevelEmoji = (level) => {
    switch (level) {
      case 'Easy':
        return '⭐';
      case 'Medium':
        return '⭐⭐';
      case 'Hard':
        return '⭐⭐⭐';
      default:
        return '⭐';
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading">Inapakua matokeo... ⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error-message">{error}</div>
        <button className="btn-retry" onClick={fetchLeaderboard}>
          Jaribu Tena
        </button>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <div className="leaderboard-header">
          <h1>🏆 Matokeo ya Wote</h1>
          <p>Washindi wa Kwanza 10</p>
        </div>

        {scores.length === 0 ? (
          <div className="no-scores">
            <p>Bado hakuna matokeo yaliyowekwa.</p>
            <p>Uwe wa kwanza kujaza fomu!</p>
          </div>
        ) : (
          <div className="scores-list">
            {scores.map((score, index) => (
              <div key={score._id} className="score-item">
                <div className="score-rank">
                  <span className="medal">{getMedalEmoji(index)}</span>
                </div>
                <div className="score-info">
                  <div className="score-player">
                    <strong>{score.playerName}</strong>
                    <span className="score-level">
                      {getLevelEmoji(score.level)} {score.level}
                    </span>
                  </div>
                  <div className="score-date">{formatDate(score.createdAt)}</div>
                </div>
                <div className="score-value">
                  <span className="score-number">{score.score}</span>
                  <span className="score-label">Alama</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="leaderboard-actions">
          <button className="btn btn-primary" onClick={() => navigate('/setup')}>
            Anza Mchezo 🎮
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            Rudi Nyumbani 🏠
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

