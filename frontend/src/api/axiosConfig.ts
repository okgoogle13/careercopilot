import axios, { type AxiosError } from 'axios';
import { auth } from '../config/firebase';

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
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 401 Unauthorized - could mean the auth token is expired or invalid
      // Firebase/JWT refresh should normally handle this, but if we get a 401,
      // we might want to trigger a sign-out or session check.
      console.warn('Backend returned 401 Unauthorized');
    }
    return Promise.reject(error);
  }
);
