import axios from 'axios';

// Get base URL and remove trailing /api if present (since all routes include /api)
let API_BASE_URL = 'http://localhost:5000';
// Remove trailing /api to avoid double /api/api/ in URLs
API_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

