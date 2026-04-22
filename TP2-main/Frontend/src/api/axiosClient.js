import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosClient = axios.create({
  // URL relativa → Vite proxy la redirige a localhost:5000
  // Funciona en cualquier red sin tocar código
  baseURL: '/api',
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
