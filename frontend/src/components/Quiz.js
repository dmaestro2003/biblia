import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [bibleVerse, setBibleVerse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const playerName = sessionStorage.getItem('playerName');
  const level = sessionStorage.getItem('level');

  useEffect(() => {
    if (!playerName || !level) {
      navigate('/setup');
      return;
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !isAnswered) {
      setTimeLeft(15);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, questions, isAnswered]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/questions/random/${level}?count=10`);
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Imeshindwa kupata maswali. Tafadhali jaribu tena.');
      setLoading(false);
    }
  };

  const handleTimeUp = async () => {
    if (!isAnswered && questions.length > 0) {
      setIsAnswered(true);
      setSelectedAnswer(null);
      
      // Get correct answer for feedback
      try {
        const response = await api.post(`/questions/verify/${questions[currentQuestionIndex]._id}`, {
          answer: ''
        });
        
        setCorrectAnswer(response.data.correctAnswer);
        setBibleVerse(response.data.bibleVerse || '');
      } catch (error) {
        console.error('Error fetching correct answer:', error);
      }

      // Move to next question after 3 seconds
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setIsAnswered(false);
          setSelectedAnswer(null);
          setCorrectAnswer(null);
          setBibleVerse('');
        } else {
          finishQuiz();
        }
      }, 3000);
    }
  };

  const handleAnswerSelect = async (answer) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answer);

    // Check if answer is correct (verify with backend)
    try {
      const response = await api.post(`/questions/verify/${questions[currentQuestionIndex]._id}`, {
        answer: answer
      });
      
      setCorrectAnswer(response.data.correctAnswer);
      setBibleVerse(response.data.bibleVerse || '');

      if (response.data.isCorrect) {
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          scoreRef.current = newScore;
          return newScore;
        });
      }
    } catch (error) {
      console.error('Error checking answer:', error);
      // Still show feedback even if verification fails
    }

    // Move to next question after 3 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
        setCorrectAnswer(null);
        setBibleVerse('');
      } else {
        // Quiz finished
        finishQuiz();
      }
    }, 3000);
  };

  const finishQuiz = async () => {
    try {
      // Use ref to get the latest score value
      const finalScore = scoreRef.current;
      
      // Save score to backend
      await api.post('/scores', {
        playerName,
        score: finalScore,
        level
      });

      // Navigate to results
      navigate('/results', {
        state: { score: finalScore, totalQuestions: questions.length, level }
      });
    } catch (error) {
      console.error('Error saving score:', error);
      // Still navigate to results even if save fails
      const finalScore = scoreRef.current;
      navigate('/results', {
        state: { score: finalScore, totalQuestions: questions.length, level }
      });
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">Tunaandaa maswali yako... ⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error-message">{error}</div>
        <button className="btn-retry" onClick={() => navigate('/setup')}>
          Rudi Nyuma
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="error-message">Hakuna maswali yaliyopatikana kwa kiwango hiki.</div>
        <button className="btn-retry" onClick={() => navigate('/setup')}>
          Rudi Nyuma
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="player-info">
          <span>👤 {playerName}</span>
          <span>⭐ {level}</span>
        </div>
        <div className="score-display">
          <span>Alama: {score}</span>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question-number">
        Swali {currentQuestionIndex + 1} / {questions.length}
      </div>

      <div className="timer">
        <div className={`timer-circle ${timeLeft <= 5 ? 'warning' : ''}`}>
          {timeLeft}
        </div>
      </div>

      <div className="question-card">
        <h2 className="question-text">{currentQuestion.question}</h2>

        <div className="answers">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = 'answer-btn';
            if (isAnswered) {
              if (option === correctAnswer) {
                buttonClass += ' correct';
              } else if (option === selectedAnswer && option !== correctAnswer) {
                buttonClass += ' incorrect';
              } else {
                buttonClass += ' disabled';
              }
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="feedback">
            <div className={`feedback-message ${selectedAnswer === correctAnswer ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === correctAnswer ? '✓ Sahihi!' : '✗ Si sahihi'}
            </div>
            {bibleVerse && (
              <div className="bible-verse">
                <strong>Aya ya Biblia:</strong> {bibleVerse}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

