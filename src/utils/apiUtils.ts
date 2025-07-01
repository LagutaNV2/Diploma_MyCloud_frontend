// File: cloud_storage/frontend/src/utils/apiUtils.ts

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});


// Перехватчик ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error('Forbidden access - check permissions');
    } else {
      console.error('API error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Функция для получения CSRF токена
export const getCSRFToken = async () => {
  try {
    await api.get('/auth/csrf/');
  } catch (error) {
    console.error('CSRF token fetch error:', error);
  }
};

// Перехватчик для обработки CSRF
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];

  if (token && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
    config.headers = config.headers || {};
    config.headers['X-CSRFToken'] = token;
  }
  return config;
});


export default api;
