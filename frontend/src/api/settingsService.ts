/**
 * Settings API Service
 * Handles user settings, preferences, and configuration
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface UserSettings {
  userId: string;
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  timezone?: string;
  defaultLocation?: string;
  targetIndustries?: string[];
  apiKeys?: {
    openai?: string;
    custom?: Record<string, string>;
  };
  integrations?: {
    gmail?: boolean;
    googleCalendar?: boolean;
    linkedIn?: boolean;
    github?: boolean;
  };
  privacy?: {
    profileVisibility: 'public' | 'private' | 'connections-only';
    allowSearch: boolean;
    shareAnalytics: boolean;
  };
  notifications?: {
    email: boolean;
    push: boolean;
    sms?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type SettingsUpdate = Partial<UserSettings>

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/settings`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const settingsService = {
  /**
   * Get user settings
   */
  async getSettings(userId?: string): Promise<UserSettings> {
    try {
      const response = await apiClient.get('/', {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error('Get settings error:', error);
      throw error;
    }
  },

  /**
   * Update user settings
   */
  async updateSettings(userId: string, settings: SettingsUpdate): Promise<UserSettings> {
    try {
      const response = await apiClient.put('/', {
        userId,
        ...settings,
      });
      return response.data;
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  },

  /**
   * Add API key
   */
  async addAPIKey(
    keyName: string,
    keyValue: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/api-keys', {
        keyName,
        keyValue,
      });
      return response.data;
    } catch (error) {
      console.error('Add API key error:', error);
      throw error;
    }
  },

  /**
   * Remove API key
   */
  async removeAPIKey(keyName: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/api-keys/${keyName}`);
      return response.data;
    } catch (error) {
      console.error('Remove API key error:', error);
      throw error;
    }
  },

  /**
   * Test API key
   */
  async testAPIKey(keyName: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await apiClient.post(`/api-keys/${keyName}/test`);
      return response.data;
    } catch (error) {
      console.error('Test API key error:', error);
      throw error;
    }
  },

  /**
   * Update integration setting
   */
  async updateIntegration(
    integrationName: string,
    enabled: boolean
  ): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.put('/integrations', {
        integrationName,
        enabled,
      });
      return response.data;
    } catch (error) {
      console.error('Update integration error:', error);
      throw error;
    }
  },

  /**
   * Export user data
   */
  async exportUserData(): Promise<Blob> {
    try {
      const response = await apiClient.get('/export', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Export user data error:', error);
      throw error;
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post('/delete-account', { password });
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },
};
