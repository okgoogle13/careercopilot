/**
 * Analysis API Service
 * Handles ATS scoring, document analysis, and resume intelligence
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface ATSScoreResponse {
  score: number;
  breakdown: {
    keywordMatch: number;
    formatting: number;
    structure: number;
    relevance: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface DocumentAnalysis {
  documentId: string;
  analysisType: string;
  results: Record<string, any>;
  timestamp: string;
}

export interface OptimizationSuggestions {
  suggestions: Array<{
    type: string;
    current: string;
    suggested: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  estimatedScoreImprovement: number;
}

export interface IntelligenceReport {
  resumeId: string;
  marketReadiness: number;
  skillsAnalysis: {
    technical: Array<{ skill: string; proficiency: string; demand: string }>;
    soft: Array<{ skill: string; examples: number }>;
  };
  gapAnalysis: {
    missingSkills: string[];
    improvementAreas: string[];
  };
  recommendations: string[];
  generatedAt: string;
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/analysis`,
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const analysisService = {
  /**
   * Get ATS score for a document against a job description
   */
  async getATSScore(
    documentId: string,
    jobDescription: string
  ): Promise<ATSScoreResponse> {
    try {
      const response = await apiClient.post('/ats-score', {
        documentId,
        jobDescription,
      });
      return response.data;
    } catch (error) {
      console.error('Get ATS score error:', error);
      throw error;
    }
  },

  /**
   * Analyze document content
   */
  async analyzeDocument(documentId: string): Promise<DocumentAnalysis> {
    try {
      const response = await apiClient.post('/analyze-document', {
        documentId,
      });
      return response.data;
    } catch (error) {
      console.error('Analyze document error:', error);
      throw error;
    }
  },

  /**
   * Get content optimization suggestions
   */
  async getContentOptimization(
    content: string,
    jobDescription: string
  ): Promise<OptimizationSuggestions> {
    try {
      const response = await apiClient.post('/optimize-content', {
        content,
        jobDescription,
      });
      return response.data;
    } catch (error) {
      console.error('Get content optimization error:', error);
      throw error;
    }
  },

  /**
   * Generate resume intelligence report
   */
  async getResumeIntelligence(resumeId: string): Promise<IntelligenceReport> {
    try {
      const response = await apiClient.post('/resume-intelligence', {
        resumeId,
      });
      return response.data;
    } catch (error) {
      console.error('Get resume intelligence error:', error);
      throw error;
    }
  },

  /**
   * Get keyword analysis
   */
  async getKeywordAnalysis(
    documentText: string,
    jobDescription: string
  ): Promise<{
    matched: string[];
    missing: string[];
    suggestions: Array<{ keyword: string; frequency: number }>;
  }> {
    try {
      const response = await apiClient.post('/keywords', {
        documentText,
        jobDescription,
      });
      return response.data;
    } catch (error) {
      console.error('Get keyword analysis error:', error);
      throw error;
    }
  },
};
