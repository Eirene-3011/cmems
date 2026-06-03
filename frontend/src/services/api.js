import axios from 'axios';

// ✅ FIX: use full backend URL in production via env variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cmems_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cmems_token');
      localStorage.removeItem('cmems_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
