import axios, { type AxiosError } from 'axios';

// Safe environment access for both Vite (browser) and Jest (node)
// Safe environment access for both Vite (browser) and Jest (node)
const metaEnv = import.meta.env;
const envApiUrl = metaEnv?.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = envApiUrl.includes('/api') ? envApiUrl : `${envApiUrl}/api`;

// Debug logging (remove in production)
if (metaEnv?.DEV) {
  console.log('[axiosConfig] API_BASE_URL:', API_BASE_URL);
  console.log('[axiosConfig] VITE_API_URL:', metaEnv?.VITE_API_URL);
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          return axiosInstance(originalRequest);
        }
      } catch {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
