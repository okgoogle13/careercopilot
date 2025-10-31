/**
 * Analytics API Service
 * Handles performance analytics, trends, and competitive analysis
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

export interface DashboardStats {
  totalApplications: number;
  successRate: number;
  averageTimeToResponse: number;
  interviewRate: number;
  topMatchingJobs: Array<{
    title: string;
    company: string;
    matchScore: number;
  }>;
  recentApplications: Array<{
    id: string;
    title: string;
    company: string;
    date: string;
    status: string;
  }>;
}

export interface TrendData {
  period: string;
  data: Array<{
    date: string;
    value: number;
    metric: string;
  }>;
  summary: {
    totalValue: number;
    averageValue: number;
    trend: 'up' | 'down' | 'stable';
    percentageChange: number;
  };
}

export interface CompetitiveAnalysis {
  userProfile: {
    skillScore: number;
    experienceScore: number;
    educationScore: number;
  };
  marketComparison: {
    percentile: number;
    competitorCount: number;
    averageQualifications: Record<string, number>;
  };
  insights: string[];
  recommendations: string[];
}

export interface PerformanceMetrics {
  applicationSuccessRate: number;
  averageResponseTime: number;
  interviewConversionRate: number;
  offerRate: number;
  topPerformingKeywords: Array<{ keyword: string; frequency: number }>;
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/analytics`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const analyticsService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(userId?: string): Promise<DashboardStats> {
    try {
      const response = await apiClient.get('/dashboard', {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  },

  /**
   * Get performance trends
   */
  async getPerformanceTrends(userId: string, timeRange: TimeRange = 'month'): Promise<TrendData> {
    try {
      const response = await apiClient.get('/trends', {
        params: { userId, timeRange },
      });
      return response.data;
    } catch (error) {
      console.error('Get performance trends error:', error);
      throw error;
    }
  },

  /**
   * Get competitive analysis
   */
  async getCompetitiveAnalysis(userId: string): Promise<CompetitiveAnalysis> {
    try {
      const response = await apiClient.get('/competitive-analysis', {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error('Get competitive analysis error:', error);
      throw error;
    }
  },

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(userId: string): Promise<PerformanceMetrics> {
    try {
      const response = await apiClient.get('/metrics', {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error('Get performance metrics error:', error);
      throw error;
    }
  },

  /**
   * Get application statistics
   */
  async getApplicationStats(
    userId: string,
    timeRange: TimeRange = 'month'
  ): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byCompany: Array<{ company: string; count: number }>;
  }> {
    try {
      const response = await apiClient.get('/applications', {
        params: { userId, timeRange },
      });
      return response.data;
    } catch (error) {
      console.error('Get application stats error:', error);
      throw error;
    }
  },

  /**
   * Get success rate analytics
   */
  async getSuccessRateAnalytics(
    userId: string,
    timeRange: TimeRange = 'month'
  ): Promise<{
    successRate: number;
    applicationCount: number;
    successCount: number;
    trend: 'up' | 'down' | 'stable';
  }> {
    try {
      const response = await apiClient.get('/success-rate', {
        params: { userId, timeRange },
      });
      return response.data;
    } catch (error) {
      console.error('Get success rate analytics error:', error);
      throw error;
    }
  },
};
