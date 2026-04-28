import axios from 'axios';
import { getToken, clearSession } from '../utils/token';

const api = axios.create({
  baseURL: 'https://llw-nupreco-backend-api.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearSession();

      if (window.location.pathname !== '/entrar') {
        window.location.href = '/entrar';
      }
    }

    return Promise.reject(error);
  }
);

export default api;