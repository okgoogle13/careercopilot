import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { aiServices } from '../aiServices';
import { apiClient } from '../../utils/apiClient';
import type {
  JobMatchingRequest,
  JobMatchingResult,
  ContentOptimizationRequest,
  ContentOptimizationResult,
  ResumeIntelligenceRequest,
  ResumeIntelligenceResult,
  SmartCoverLetterRequest,
  SmartCoverLetterResult
} from '../aiServices';

// Mock the apiClient
jest.mock('../../utils/apiClient');
const mockedApiClient = jest.mocked(apiClient);

describe('AI Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Job Matching Service', () => {
    it('should call job matching API with correct parameters', async () => {
      const mockRequest: JobMatchingRequest = {
        document_id: 'test-resume-123',
        preferences: {
          job_type: 'full-time',
          experience_level: 'mid-level',
          remote_preference: 'hybrid',
          location_preference: 'San Francisco, CA',
          salary_range: { min: 100000, max: 150000 }
        }
      };

      const mockResponse: JobMatchingResult = {
        matches: [
          {
            job_id: 'job-123',
            title: 'Senior Software Engineer',
            company: 'TechCorp',
            location: 'San Francisco, CA',
            match_score: 85,
            match_reasons: ['Strong technical skills', 'Experience with React'],
            salary_range: { min: 120000, max: 160000 },
            required_skills: ['React', 'TypeScript', 'Node.js'],
            missing_skills: ['GraphQL'],
            job_description: 'We are looking for a senior software engineer...'
          }
        ],
        analysis: {
          total_jobs_analyzed: 150,
          avg_match_score: 72.5,
          top_skills_in_demand: ['React', 'Python', 'AWS'],
          skill_gaps: ['Machine Learning', 'Docker'],
          recommendations: ['Consider learning GraphQL', 'Enhance cloud skills']
        }
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await aiServices.getJobMatching(mockRequest);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/ai-career/job-matching', mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should handle job matching API errors', async () => {
      const mockRequest: JobMatchingRequest = {
        document_id: 'test-resume-123'
      };

      const errorMessage = 'Failed to process job matching request';
      mockedApiClient.post.mockRejectedValue(new Error(errorMessage));

      await expect(aiServices.getJobMatching(mockRequest)).rejects.toThrow(errorMessage);
      expect(mockedApiClient.post).toHaveBeenCalledWith('/ai-career/job-matching', mockRequest);
    });
  });

  describe('Content Optimization Service', () => {
    it('should call content optimization API with correct parameters', async () => {
      const mockRequest: ContentOptimizationRequest = {
        content: 'John Doe\nSoftware Engineer\nExperienced developer...',
        content_type: 'resume',
        target_role: 'Senior Software Engineer',
        target_company: 'Google',
        optimization_goals: ['ats_optimization', 'keyword_enhancement']
      };

      const mockResponse: ContentOptimizationResult = {
        optimized_content: 'John Doe\nSenior Software Engineer\nHighly experienced developer...',
        improvements: [
          {
            type: 'Title Enhancement',
            original: 'Software Engineer',
            improved: 'Senior Software Engineer',
            reason: 'Better matches target role level',
            impact_score: 8
          }
        ],
        metrics: {
          readability_score: 85,
          ats_score: 92,
          keyword_density: {
            'software': 0.05,
            'engineer': 0.04,
            'react': 0.03
          },
          impact_score: 88
        },
        suggestions: [
          'Add more quantified achievements',
          'Include relevant technical keywords'
        ]
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await aiServices.optimizeContent(mockRequest);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/ai-career/content-optimization', mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Resume Intelligence Service', () => {
    it('should call resume intelligence API with correct parameters', async () => {
      const mockRequest: ResumeIntelligenceRequest = {
        document_id: 'test-resume-123',
        target_roles: ['Senior Software Engineer', 'Tech Lead'],
        career_goals: 'Transition to technical leadership role'
      };

      const mockResponse: ResumeIntelligenceResult = {
        career_progression: {
          current_level: 'Mid-Level Software Engineer',
          suggested_next_roles: ['Senior Software Engineer', 'Tech Lead'],
          timeline_projection: '12-18 months with focused skill development',
          required_skills_for_growth: ['Team Leadership', 'System Architecture', 'Mentoring']
        },
        skills_analysis: {
          technical_skills: [
            {
              skill: 'React',
              proficiency_level: 'Advanced',
              market_demand: 'High',
              improvement_suggestions: ['Learn React 18 features', 'Master performance optimization']
            }
          ],
          soft_skills: [
            {
              skill: 'Communication',
              evidence_strength: 'Strong',
              improvement_suggestions: ['Seek presentation opportunities', 'Write technical blogs']
            }
          ],
          skill_gaps: [
            {
              skill: 'System Design',
              importance: 'High',
              learning_resources: ['System Design Interview book', 'Online courses']
            }
          ]
        },
        experience_insights: {
          achievements_impact: ['Led successful product launch with 40% user growth'],
          quantification_opportunities: ['Add metrics to project descriptions'],
          experience_narrative: 'Strong technical contributor with growing leadership potential',
          missing_experience_areas: ['Cross-functional team leadership', 'Budget management']
        },
        market_positioning: {
          unique_value_proposition: 'Full-stack developer with strong product sense and user focus',
          competitive_advantages: ['Rare combination of technical and product skills'],
          market_fit_score: 82,
          positioning_recommendations: ['Emphasize product impact', 'Highlight cross-functional collaboration']
        }
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await aiServices.getResumeIntelligence(mockRequest);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/ai-career/resume-intelligence', mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Smart Cover Letter Service', () => {
    it('should call cover letter generation API with correct parameters', async () => {
      const mockRequest: SmartCoverLetterRequest = {
        document_id: 'test-resume-123',
        job_description: 'We are seeking a Senior Software Engineer...',
        company_name: 'Google',
        position_title: 'Senior Software Engineer',
        user_background: {
          name: 'John Doe',
          current_role: 'Software Engineer',
          years_experience: 5,
          key_achievements: ['Led team of 3 developers', 'Increased performance by 40%']
        },
        tone: 'professional',
        length: 'standard'
      };

      const mockResponse: SmartCoverLetterResult = {
        cover_letter: 'Dear Hiring Manager,\n\nI am excited to apply for the Senior Software Engineer position at Google...',
        company_research: {
          company_info: 'Google is a leading technology company known for innovation...',
          recent_news: ['Launched new AI product', 'Expanded cloud services'],
          company_culture: 'Data-driven, collaborative, innovation-focused culture',
          values_alignment: ['Innovation', 'User Focus', 'Technical Excellence']
        },
        personalization: {
          role_specific_highlights: ['5 years of software development experience', 'Team leadership skills'],
          company_specific_connections: ['Passion for Google\'s mission', 'Experience with Google Cloud'],
          value_proposition: 'Strong technical skills with proven leadership ability'
        },
        optimization_notes: [
          'Emphasized quantified achievements',
          'Connected experience to company values',
          'Highlighted relevant technical skills'
        ]
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await aiServices.generateCoverLetter(mockRequest);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/ai-career/cover-letter-generation', mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Additional AI Services', () => {
    it('should call career transition analysis API', async () => {
      const mockRequest = {
        current_role: 'Software Engineer',
        target_role: 'Product Manager',
        document_id: 'test-resume-123'
      };

      const mockResponse = {
        transition_feasibility: 75,
        required_skills: ['Product Strategy', 'Data Analysis'],
        recommended_experience: ['Cross-functional collaboration', 'Customer research'],
        timeline_estimate: '6-12 months with focused preparation',
        transition_strategy: ['Take on product-focused projects', 'Build stakeholder relationships'],
        potential_challenges: ['Technical background may be questioned'],
        success_factors: ['Leverage technical expertise', 'Develop business acumen']
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await aiServices.getCareerTransitionAnalysis(mockRequest);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/ai-career/career-transition', mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should call salary insights API', async () => {
      const mockRequest = {
        role: 'Software Engineer',
        location: 'San Francisco, CA',
        experience_level: 'Senior',
        skills: ['React', 'Node.js', 'TypeScript']
      };

      const mockResponse = {
        salary_range: {
          min: 140000,
          max: 180000,
          median: 160000
        },
        market_positioning: 'Competitive salary range for senior-level position',
        negotiation_points: ['Highlight React expertise', 'Emphasize full-stack capabilities'],
        skill_premiums: [
          { skill: 'React', premium_percentage: 15 },
          { skill: 'TypeScript', premium_percentage: 10 }
        ],
        recommendations: ['Consider negotiating for equity', 'Highlight leadership experience']
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await aiServices.getSalaryInsights(mockRequest);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/ai-career/salary-insights', mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });
});
