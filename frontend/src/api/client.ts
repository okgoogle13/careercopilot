import axios from 'axios';
import { auth } from '../config/firebase';

// Create generic Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/careercopilot-1/us-central1',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
