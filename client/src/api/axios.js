import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach customer or admin token automatically depending on which is present.
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');
  const isAdminRoute = config.url && config.url.includes('/admin');
  const token = isAdminRoute && adminToken ? adminToken : userToken || adminToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
