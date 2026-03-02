import axios from 'axios';
<<<<<<< HEAD
import { auth } from '../config/firebase';

// Create generic Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/careercopilot-1/us-central1',
=======
import { supabase } from '../config/supabase';

// Create generic Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/careercopilot-1/us-central1', // Update based on your configuration
>>>>>>> restoration-KR-Rage-Figma-v2.0
  headers: {
    'Content-Type': 'application/json',
  },
});

<<<<<<< HEAD
// Add a request interceptor to include the Firebase JWT
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting Firebase auth token:', error);
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
