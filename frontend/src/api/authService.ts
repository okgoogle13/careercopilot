/**
 * Authentication API Service
 * Handles user login, registration, authentication, and session management
 */

import type { AxiosError } from 'axios';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Types
export interface AuthResponse {
  success: boolean;
  user: UserProfile;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  voiceProfileFile?: File;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  expiresIn: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  personalInfo?: {
    fullName: string;
    phone?: string;
    address?: string;
    linkedIn?: string;
    portfolio?: string;
  };
  preferences?: {
    themeId?: string;
    defaultLocation?: string;
    targetIndustries?: string[];
  };
  voiceProfile?: {
    tone: 'professional' | 'conversational' | 'formal';
    commonPhrases?: string[];
    writingStyle?: 'concise' | 'detailed' | 'balanced';
  };
}

export interface ProfileUpdate {
  displayName?: string;
  personalInfo?: Partial<UserProfile['personalInfo']>;
  preferences?: Partial<UserProfile['preferences']>;
  voiceProfile?: Partial<UserProfile['voiceProfile']>;
}

export interface VoiceProfile {
  tone: string;
  commonPhrases: string[];
  writingStyle: string;
}

// API Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
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

          const { token } = response.data;
          localStorage.setItem('auth_token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Service methods
export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('displayName', data.displayName);
      if (data.voiceProfileFile) {
        formData.append('voiceProfileFile', data.voiceProfileFile);
      }

      const response = await apiClient.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { token, refreshToken, expiresIn, user } = response.data;
      localStorage.setItem('auth_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      return {
        success: true,
        user,
        token,
        refreshToken,
        expiresIn,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', credentials);

      const { token, refreshToken, expiresIn, user } = response.data;
      localStorage.setItem('auth_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      return {
        success: true,
        user,
        token,
        refreshToken,
        expiresIn,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<TokenResponse> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { token, expiresIn } = response.data;
      localStorage.setItem('auth_token', token);

      return { token, expiresIn };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateUserProfile(data: ProfileUpdate): Promise<UserProfile> {
    try {
      const response = await apiClient.put('/auth/me', data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Create or update voice profile
   */
  async createVoiceProfile(voiceFile: File): Promise<VoiceProfile> {
    try {
      const formData = new FormData();
      formData.append('voiceFile', voiceFile);

      const response = await apiClient.post('/auth/voice-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error) {
      console.error('Create voice profile error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};
