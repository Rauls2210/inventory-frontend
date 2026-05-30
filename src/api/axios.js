import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Single axios instance used across the app.
const api = axios.create({ baseURL });

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s globally: clear the session and bounce to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Avoid redirect loops if we're already on the login page.
      if (!window.location.pathname.startsWith('/login')) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
