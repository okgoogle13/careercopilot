import axios from 'axios';
import { auth } from '../firebase-config';

// Create generic Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/careercopilot-1/us-central1', // Update based on your Firebase Functions URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Firebase ID token
api.interceptors.request.use(
    async (config) => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const token = await currentUser.getIdToken();
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
