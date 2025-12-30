import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    level: 'Easy',
    bibleVerse: ''
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadData();
  }, [navigate, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'questions') {
        const response = await api.get('/questions/all');
        setQuestions(response.data);
      } else if (activeTab === 'scores') {
        const scoresResponse = await api.get('/admin/scores');
        setScores(scoresResponse.data);
        
        const statsResponse = await api.get('/admin/stats');
        setStats(statsResponse.data);
      }
      
      setError('');
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/admin/login');
      } else {
        setError('Imeshindwa kupakua data. Tafadhali jaribu tena.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!questionForm.question.trim()) {
      setError('Swali ni lazima');
      return;
    }
    if (questionForm.options.some(opt => !opt.trim())) {
      setError('Chagua zote 4 lazima zimejazwa');
      return;
    }
    if (!questionForm.correctAnswer.trim()) {
      setError('Jibu sahihi ni lazima');
      return;
    }
    if (!questionForm.bibleVerse.trim()) {
      setError('Aya ya Biblia ni lazima');
      return;
    }
    if (!questionForm.options.includes(questionForm.correctAnswer)) {
      setError('Jibu sahihi lazima liwe moja ya chaguo zilizopewa');
      return;
    }

    try {
      setLoading(true);
      
      if (editingQuestion) {
        // Update question
        await api.put(`/questions/${editingQuestion._id}`, questionForm);
      } else {
        // Create question
        await api.post('/questions', questionForm);
      }

      // Reset form
      setQuestionForm({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        level: 'Easy',
        bibleVerse: ''
      });
      setEditingQuestion(null);
      setShowQuestionForm(false);
      
      // Reload questions
      await loadData();
    } catch (error) {
      console.error('Error saving question:', error);
      setError(error.response?.data?.message || 'Imeshindwa kuhifadhi swali');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionForm({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      level: question.level,
      bibleVerse: question.bibleVerse
    });
    setShowQuestionForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Je, una uhakika unataka kufuta swali hili?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/questions/${id}`);
      await loadData();
    } catch (error) {
      console.error('Error deleting question:', error);
      setError('Imeshindwa kufuta swali');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-panel">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <button className="btn-logout" onClick={handleLogout}>
            Toka
          </button>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            Maswali
          </button>
          <button
            className={`tab ${activeTab === 'scores' ? 'active' : ''}`}
            onClick={() => setActiveTab('scores')}
          >
            Matokeo
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {activeTab === 'questions' && (
          <div className="admin-content">
            <div className="content-header">
              <h2>Usimamizi wa Maswali</h2>
              <button
                className="btn-add"
                onClick={() => {
                  setShowQuestionForm(!showQuestionForm);
                  setEditingQuestion(null);
                  setQuestionForm({
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: '',
                    level: 'Easy',
                    bibleVerse: ''
                  });
                }}
              >
                {showQuestionForm ? 'Funga Fomu' : '+ Ongeza Swali'}
              </button>
            </div>

            {showQuestionForm && (
              <form onSubmit={handleQuestionSubmit} className="question-form">
                <div className="form-group">
                  <label>Swali *</label>
                  <textarea
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                    placeholder="Andika swali hapa..."
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Chaguo (4) *</label>
                  {questionForm.options.map((opt, index) => (
                    <input
                      key={index}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options];
                        newOptions[index] = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOptions });
                      }}
                      placeholder={`Chaguo ${index + 1}`}
                      required
                    />
                  ))}
                </div>

                <div className="form-group">
                  <label>Jibu Sahihi *</label>
                  <select
                    value={questionForm.correctAnswer}
                    onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                    required
                  >
                    <option value="">Chagua jibu sahihi</option>
                    {questionForm.options.map((opt, index) => (
                      opt && (
                        <option key={index} value={opt}>
                          {opt}
                        </option>
                      )
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Kiwango *</label>
                  <select
                    value={questionForm.level}
                    onChange={(e) => setQuestionForm({ ...questionForm, level: e.target.value })}
                    required
                  >
                    <option value="Easy">Rahisi (Umri 5-7)</option>
                    <option value="Medium">Wastani (Umri 8-10)</option>
                    <option value="Hard">Gumu (Umri 11-13)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Aya ya Biblia *</label>
                  <textarea
                    value={questionForm.bibleVerse}
                    onChange={(e) => setQuestionForm({ ...questionForm, bibleVerse: e.target.value })}
                    placeholder="Andika aya ya Biblia..."
                    rows={2}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={loading}>
                    {editingQuestion ? 'Sasisha' : 'Hifadhi'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setShowQuestionForm(false);
                      setEditingQuestion(null);
                      setQuestionForm({
                        question: '',
                        options: ['', '', '', ''],
                        correctAnswer: '',
                        level: 'Easy',
                        bibleVerse: ''
                      });
                    }}
                  >
                    Ghairi
                  </button>
                </div>
              </form>
            )}

            {loading && questions.length === 0 ? (
              <div className="loading">Inapakua...</div>
            ) : (
              <div className="questions-list">
                {questions.map((q) => (
                  <div key={q._id} className="question-item">
                    <div className="question-content">
                      <div className="question-header">
                        <h3>{q.question}</h3>
                        <span className="question-level">{q.level}</span>
                      </div>
                      <div className="question-options">
                        {q.options.map((opt, index) => (
                          <div
                            key={index}
                            className={`option ${opt === q.correctAnswer ? 'correct' : ''}`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                      <div className="question-verse">
                        <strong>Aya:</strong> {q.bibleVerse}
                      </div>
                    </div>
                    <div className="question-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditQuestion(q)}
                      >
                        Hariri
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteQuestion(q._id)}
                      >
                        Futa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'scores' && (
          <div className="admin-content">
            <h2>Matokeo ya Wote</h2>

            {stats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalScores}</div>
                  <div className="stat-label">Jumla ya Matokeo</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalQuestions}</div>
                  <div className="stat-label">Jumla ya Maswali</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{Math.round(stats.averageScore)}</div>
                  <div className="stat-label">Wastani wa Alama</div>
                </div>
              </div>
            )}

            {loading && scores.length === 0 ? (
              <div className="loading">Inapakua...</div>
            ) : (
              <div className="scores-table">
                <table>
                  <thead>
                    <tr>
                      <th>Jina</th>
                      <th>Kiwango</th>
                      <th>Alama</th>
                      <th>Tarehe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score) => (
                      <tr key={score._id}>
                        <td>{score.playerName}</td>
                        <td>{score.level}</td>
                        <td>{score.score}</td>
                        <td>{formatDate(score.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

