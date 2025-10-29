/**
 * Job Listing API Service
 * Handles job extraction, analysis, and matching
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  salary?: { min: number; max: number; currency: string };
  location?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'temporary';
  postedDate?: string;
  deadline?: string;
  url?: string;
  source?: string;
}

export interface JobAnalysis {
  jobId: string;
  keyRequirements: string[];
  technicalSkills: string[];
  softSkills: string[];
  experience: {
    years: number;
    areas: string[];
  };
  salaryRange?: { min: number; max: number };
  analysisDate: string;
}

export interface JobMatchingResult {
  jobId: string;
  profileId: string;
  matchScore: number; // 0-100
  matchBreakdown: {
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    preferenceMatch: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  improvements: string[];
  recommendation: 'strong-fit' | 'good-fit' | 'moderate-fit' | 'weak-fit';
}

export interface JobFilters {
  title?: string;
  company?: string;
  location?: string;
  jobType?: string;
  minSalary?: number;
  maxSalary?: number;
  dateRange?: { from: string; to: string };
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/jobs`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const jobService = {
  /**
   * Extract job details from a URL
   */
  async extractJobFromUrl(url: string): Promise<JobListing> {
    try {
      const response = await apiClient.post('/extract-from-url', { url });
      return response.data;
    } catch (error) {
      console.error('Extract job from URL error:', error);
      throw error;
    }
  },

  /**
   * Extract job details from text
   */
  async extractJobFromText(text: string): Promise<JobListing> {
    try {
      const response = await apiClient.post('/extract-from-text', { text });
      return response.data;
    } catch (error) {
      console.error('Extract job from text error:', error);
      throw error;
    }
  },

  /**
   * Perform advanced job analysis
   */
  async advancedJobAnalysis(jobId: string): Promise<JobAnalysis> {
    try {
      const response = await apiClient.post('/advanced-analysis', { jobId });
      return response.data;
    } catch (error) {
      console.error('Advanced job analysis error:', error);
      throw error;
    }
  },

  /**
   * Get job matching score against user profile
   */
  async getJobMatching(
    jobId: string,
    profileId: string
  ): Promise<JobMatchingResult> {
    try {
      const response = await apiClient.post('/matching', {
        jobId,
        profileId,
      });
      return response.data;
    } catch (error) {
      console.error('Get job matching error:', error);
      throw error;
    }
  },

  /**
   * List all jobs for user
   */
  async listJobs(filters?: JobFilters): Promise<JobListing[]> {
    try {
      const response = await apiClient.get('/opportunities', {
        params: filters,
      });
      return response.data.opportunities;
    } catch (error) {
      console.error('List jobs error:', error);
      throw error;
    }
  },

  /**
   * Get specific job details
   */
  async getJob(jobId: string): Promise<JobListing> {
    try {
      const response = await apiClient.get(`/opportunities/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Get job error:', error);
      throw error;
    }
  },

  /**
   * Delete a job listing
   */
  async deleteJob(jobId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/opportunities/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Delete job error:', error);
      throw error;
    }
  },
};
