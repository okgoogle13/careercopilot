/**
 * Analysis API Service
 * Handles ATS scoring, document analysis, and resume intelligence
 */

import { axiosInstance } from '@/api/axiosConfig';

export interface AtsScoreResponse {
  overallScore: number;
  categories: Array<{
    name: string;
    score: number;
    status: string;
    suggestions: string[];
  }>;
  matched_keywords: string[];
  missing_keywords: string[];
}

export interface CorporateProfile {
  name: string;
  mission_statement: string;
  core_values: string[];
  strategic_focus: string;
  communication_style: string;
  known_for: string;
}

export interface StrategyResponse {
  job_details: {
    role_title?: string;
    key_responsibilities?: string[];
  };
  corporate_profile: CorporateProfile | null;
  optimized_resume: {
    resume_text: string;
  };
  strategy_summary: string;
  gap_analysis?: {
    missing_skills: string[];
    evidence_found: string[];
    strategy_advice: string;
  };
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

const apiClient = axiosInstance;

export const analysisService = {
  async getATSScore(resumeText: string, jobDescription: string): Promise<AtsScoreResponse> {
    try {
      const response = await apiClient.post('/analysis/ats-score', {
        resume_text: resumeText,
        job_description: jobDescription,
      });
      return response.data;
    } catch (error) {
      console.error('Get ATS score error:', error);
      throw error;
    }
  },

  async getContentOptimization(
    content: string,
    jobDescription: string
  ): Promise<OptimizationSuggestions> {
    try {
      const response = await apiClient.post('/analysis/optimize-content', {
        content,
        jobDescription,
      });
      return response.data;
    } catch (error) {
      console.error('Get content optimization error:', error);
      throw error;
    }
  },

  async getResumeIntelligence(resumeId: string): Promise<IntelligenceReport> {
    try {
      const response = await apiClient.post('/analysis/resume-intelligence', {
        resumeId,
      });
      return response.data;
    } catch (error) {
      console.error('Get resume intelligence error:', error);
      throw error;
    }
  },

  async getStrategy(request: {
    resumeText: string;
    jobUrl: string;
    missingKeywords?: string[];
  }): Promise<StrategyResponse> {
    try {
      const response = await apiClient.post('/analysis/strategy', {
        resume_text: request.resumeText,
        job_url: request.jobUrl,
        missing_keywords: request.missingKeywords,
      });
      return response.data;
    } catch (error) {
      console.error('Get strategy error:', error);
      throw error;
    }
  },
};
