import axios from 'axios';

const api = axios.create({
  baseURL: 'https://shopez-e-commerse-application.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token into requests automatically
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
