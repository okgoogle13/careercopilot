/**
 * Profile API Service
 * Handles user profile CRUD operations and profile variations
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface ProfileCreate {
  name: string;
  type: 'master' | 'specialized';
  summary?: string;
  skills?: {
    technical?: string[];
    soft?: string[];
    certifications?: string[];
  };
  experience?: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
    achievements?: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    graduationDate: string;
    gpa?: number;
  }>;
}

export type ProfileUpdate = Partial<ProfileCreate>;

export interface Profile extends ProfileCreate {
  id: string;
  userId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/profiles`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const profileService = {
  /**
   * Create a new profile
   */
  async createProfile(data: ProfileCreate): Promise<Profile> {
    try {
      const response = await apiClient.post('/', data);
      return response.data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  },

  /**
   * Get all profiles for user
   */
  async getProfiles(userId?: string): Promise<Profile[]> {
    try {
      const response = await apiClient.get('/', {
        params: { userId },
      });
      return response.data.profiles;
    } catch (error) {
      console.error('Get profiles error:', error);
      throw error;
    }
  },

  /**
   * Get specific profile by ID
   */
  async getProfileById(profileId: string): Promise<Profile> {
    try {
      const response = await apiClient.get(`/${profileId}`);
      return response.data;
    } catch (error) {
      console.error('Get profile by ID error:', error);
      throw error;
    }
  },

  /**
   * Update a profile
   */
  async updateProfile(profileId: string, data: ProfileUpdate): Promise<Profile> {
    try {
      const response = await apiClient.put(`/${profileId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Delete a profile
   */
  async deleteProfile(profileId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/${profileId}`);
      return response.data;
    } catch (error) {
      console.error('Delete profile error:', error);
      throw error;
    }
  },

  /**
   * Duplicate a profile
   */
  async duplicateProfile(sourceProfileId: string, newName: string): Promise<Profile> {
    try {
      const response = await apiClient.post(`/${sourceProfileId}/duplicate`, {
        newName,
      });
      return response.data;
    } catch (error) {
      console.error('Duplicate profile error:', error);
      throw error;
    }
  },
};
