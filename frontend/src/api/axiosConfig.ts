import axios, { type AxiosError } from 'axios';
<<<<<<< HEAD
=======
import { supabase } from '../config/supabase';
>>>>>>> restoration-KR-Rage-Figma-v2.0

// Safe environment access for both Vite (browser) and Jest (node)
// Safe environment access for both Vite (browser) and Jest (node)
const metaEnv = import.meta.env;
const envApiUrl = metaEnv?.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = envApiUrl.includes('/api') ? envApiUrl : `${envApiUrl}/api`;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for token
axiosInstance.interceptors.request.use(
<<<<<<< HEAD
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
=======
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
>>>>>>> restoration-KR-Rage-Figma-v2.0
    }
    return config;
  },
  (error) => Promise.reject(error)
);

<<<<<<< HEAD
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

=======
// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 401 Unauthorized - could mean the Supabase token is expired or invalid
      // Supabase-js usually handles refresh automatically, but if we get a 401,
      // we might want to trigger a sign-out or session check.
      console.warn('Backend returned 401 Unauthorized');
    }
>>>>>>> restoration-KR-Rage-Figma-v2.0
    return Promise.reject(error);
  }
);
