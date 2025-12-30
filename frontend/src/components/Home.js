import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-icon">
          <div className="book-icon">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="15" width="60" height="70" rx="3" stroke="white" strokeWidth="3" fill="none"/>
              <line x1="50" y1="15" x2="50" y2="85" stroke="white" strokeWidth="2"/>
              <line x1="30" y1="40" x2="70" y2="40" stroke="white" strokeWidth="2"/>
              <line x1="30" y1="55" x2="70" y2="55" stroke="white" strokeWidth="2"/>
              <circle cx="75" cy="25" r="8" fill="#FFD700"/>
              <line x1="45" y1="12" x2="55" y2="8" stroke="white" strokeWidth="3"/>
              <line x1="45" y1="8" x2="55" y2="12" stroke="white" strokeWidth="3"/>
            </svg>
          </div>
        </div>
        
        <h1 className="home-title">
          <span className="title-icon">📖</span>
          Bible Quiz ya Watoto
        </h1>
        <p className="home-subtitle">Jifunze Biblia kwa Furaha</p>

        <div className="home-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/setup')}>
            <span className="btn-icon">🎮</span>
            Anza Mchezo
          </button>
          
          <button className="btn btn-secondary" onClick={() => navigate('/leaderboard')}>
            <span className="btn-icon">🏆</span>
            Matokeo
          </button>
        </div>

        <p className="home-footer">Mungu Anakupenda ❤️</p>
      </div>
    </div>
  );
};

export default Home;

