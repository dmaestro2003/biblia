import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import './AdminRegister.css';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Tafadhali jaza sehemu zote');
      return;
    }

    if (password.length < 6) {
      setError('Nenosiri lazima liwe na angalau herufi 6');
      return;
    }

    if (password !== confirmPassword) {
      setError('Nenosiri hazifanani');
      return;
    }

    try {
      setLoading(true);
      console.log('Registering admin:', { username });
      const response = await api.post('/api/auth/register', {
        username,
        password
      });

      console.log('Registration successful!', response.data);

      // Store token
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));

      // Show success message briefly before navigating
      alert(`Admin "${username}" amesajiliwa kwa mafanikio! Sasa unaweza kuona data yako kwenye MongoDB.`);
      
      // Navigate to admin panel
      navigate('/admin');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle network errors
      if (!error.response) {
        setError(
          'Huwezi kuunganisha na seva. Hakikisha kuwa backend server inaendesha kwenye http://localhost:5000'
        );
        return;
      }
      
      setError(
        error.response?.data?.message || 
        'Hitilafu katika usajili. Tafadhali jaribu tena'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-card">
        <div className="admin-register-header">
          <h1>📝 Admin Registration</h1>
          <p>Sajili akaunti mpya ya admin</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-register-form">
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
              placeholder="Ingiza nenosiri (angalau herufi 6)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Thibitisha Nenosiri</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Ingiza nenosiri tena"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-register"
            disabled={loading}
          >
            {loading ? 'Inasajiliwa...' : 'Sajili'}
          </button>
        </form>

        <div className="register-footer">
          <p>Tayari una akaunti? 
            <button 
              className="link-button" 
              onClick={() => navigate('/admin/login')}
            >
              Ingia hapa
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

export default AdminRegister;

