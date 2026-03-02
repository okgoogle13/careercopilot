import axios from 'axios';
import { supabase } from '../config/supabase';

// Create generic Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/careercopilot-1/us-central1', // Update based on your configuration
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the Supabase JWT
api.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
