import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Tafadhali ingiza jina la mtumiaji na nenosiri');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', {
        username,
        password
      });

      // Store token
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));

      // Navigate to admin panel
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message || 
        'Jina la mtumiaji au nenosiri si sahihi'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>🔐 Admin Login</h1>
          <p>Ingia kwa ajili ya kusimamia maswali</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Jina la Mtumiaji</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Ingiza jina la mtumiaji"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Nenosiri</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Ingiza nenosiri"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Inapakua...' : 'Ingia'}
          </button>
        </form>

        <div className="login-footer">
          <p>Huna akaunti? 
            <button 
              className="link-button" 
              onClick={() => navigate('/admin/register')}
            >
              Sajili hapa
            </button>
          </p>
        </div>

        <button className="btn-back" onClick={() => navigate('/')}>
          Rudi Nyumbani
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;

