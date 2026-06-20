import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage as a fallback to the httpOnly cookie
// (useful in dev or cross-origin setups where cookies may be restricted)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('raahi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid/expired - clear local session
      localStorage.removeItem('raahi_token');
      localStorage.removeItem('raahi_user');
    }
    return Promise.reject(error);
  }
);

export default api;
