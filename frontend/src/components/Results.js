import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Results.css';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [level, setLevel] = useState('Easy');
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    if (location.state) {
      setScore(location.state.score);
      setTotalQuestions(location.state.totalQuestions);
      setLevel(location.state.level);
    }
    
    const name = sessionStorage.getItem('playerName');
    if (name) {
      setPlayerName(name);
    }

    // Clear session storage
    sessionStorage.removeItem('playerName');
    sessionStorage.removeItem('level');
  }, [location]);

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getMessage = () => {
    if (percentage === 100) {
      return {
        title: 'Hongera! 🎉',
        message: 'Umejibu maswali yote kwa usahihi! Mungu amekubariki sana!',
        verse: 'Mathayo 19:26 - Kwa Mungu hakuna kitu kisichowezekana.'
      };
    } else if (percentage >= 80) {
      return {
        title: 'Vizuri sana! ⭐',
        message: 'Umejifunza mengi leo! Endelea kujifunza Biblia.',
        verse: 'Mathayo 5:6 - Heri wale walio na njaa na kiu ya haki, maana watajaziwa.'
      };
    } else if (percentage >= 60) {
      return {
        title: 'Vizuri! 👍',
        message: 'Umejifunza mambo mazuri. Endelea kusoma Biblia kila siku.',
        verse: 'Yoshua 1:8 - Kitabu hiki cha sheria kisikuependuke kinywani mwako.'
      };
    } else if (percentage >= 40) {
      return {
        title: 'Vizuri! 💪',
        message: 'Umeanza vizuri! Endelea kujifunza zaidi.',
        verse: 'Zaburi 119:105 - Neno lako ni taa kwa mguu wangu, na nuru kwa njia yangu.'
      };
    } else {
      return {
        title: 'Karibu tena! 📖',
        message: 'Soma Biblia zaidi na uje kujaribu tena. Mungu anakupenda!',
        verse: 'Yeremia 29:11 - Maana mimi najua mawazo niliyonayo juu yenu, asema BWANA.'
      };
    }
  };

  const motivationalMessage = getMessage();

  return (
    <div className="results-container">
      <div className="results-card">
        <div className="results-header">
          <h1>Matokeo Yako</h1>
          <p className="player-name">👤 {playerName}</p>
        </div>

        <div className="score-display">
          <div className="score-circle">
            <div className="score-number">{score}</div>
            <div className="score-total">/ {totalQuestions}</div>
          </div>
          <div className="percentage">{percentage}%</div>
        </div>

        <div className="motivational-message">
          <h2 className="message-title">{motivationalMessage.title}</h2>
          <p className="message-text">{motivationalMessage.message}</p>
          <div className="bible-verse">
            <strong>📖 Aya ya Biblia:</strong>
            <p>"{motivationalMessage.verse}"</p>
          </div>
        </div>

        <div className="results-actions">
          <button className="btn btn-primary" onClick={() => navigate('/setup')}>
            Cheza Tena 🎮
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/leaderboard')}>
            Matokeo ya Wote 🏆
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            Rudi Nyumbani 🏠
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;

