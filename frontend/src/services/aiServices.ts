import { apiClient } from '../utils/apiClient';

// Types for AI Services
export interface JobMatchingRequest {
  resume_content?: string;
  document_id?: string;
  preferences?: {
    job_type?: string;
    experience_level?: string;
    salary_range?: {
      min: number;
      max: number;
    };
    remote_preference?: string;
    location_preference?: string;
  };
}

export interface JobMatchingResult {
  matches: Array<{
    job_id: string;
    title: string;
    company: string;
    location: string;
    match_score: number;
    match_reasons: string[];
    salary_range?: {
      min: number;
      max: number;
    };
    required_skills: string[];
    missing_skills: string[];
    job_description: string;
  }>;
  analysis: {
    total_jobs_analyzed: number;
    avg_match_score: number;
    top_skills_in_demand: string[];
    skill_gaps: string[];
    recommendations: string[];
  };
}

export interface ContentOptimizationRequest {
  content: string;
  content_type: 'resume' | 'cover_letter' | 'linkedin' | 'portfolio';
  target_role?: string;
  target_company?: string;
  target_industry?: string;
  optimization_goals: Array<
    'ats_optimization' | 'keyword_enhancement' | 'readability' | 'impact_statements' | 'structure'
  >;
}

export interface ContentOptimizationResult {
  optimized_content: string;
  improvements: Array<{
    type: string;
    original: string;
    improved: string;
    reason: string;
    impact_score: number;
  }>;
  metrics: {
    readability_score: number;
    ats_score: number;
    keyword_density: Record<string, number>;
    impact_score: number;
  };
  suggestions: string[];
}

export interface ResumeIntelligenceRequest {
  document_id?: string;
  resume_content?: string;
  target_roles?: string[];
  career_goals?: string;
}

export interface ResumeIntelligenceResult {
  career_progression: {
    current_level: string;
    suggested_next_roles: string[];
    timeline_projection: string;
    required_skills_for_growth: string[];
  };
  skills_analysis: {
    technical_skills: Array<{
      skill: string;
      proficiency_level: string;
      market_demand: string;
      improvement_suggestions: string[];
    }>;
    soft_skills: Array<{
      skill: string;
      evidence_strength: string;
      improvement_suggestions: string[];
    }>;
    skill_gaps: Array<{
      skill: string;
      importance: string;
      learning_resources: string[];
    }>;
  };
  experience_insights: {
    achievements_impact: string[];
    quantification_opportunities: string[];
    experience_narrative: string;
    missing_experience_areas: string[];
  };
  market_positioning: {
    unique_value_proposition: string;
    competitive_advantages: string[];
    market_fit_score: number;
    positioning_recommendations: string[];
  };
}

export interface SmartCoverLetterRequest {
  document_id?: string;
  resume_content?: string;
  job_description: string;
  company_name: string;
  position_title: string;
  user_background?: {
    name?: string;
    current_role?: string;
    years_experience?: number;
    key_achievements?: string[];
  };
  tone?: 'professional' | 'enthusiastic' | 'conversational' | 'formal';
  length?: 'concise' | 'standard' | 'detailed';
}

export interface SmartCoverLetterResult {
  cover_letter: string;
  company_research: {
    company_info: string;
    recent_news: string[];
    company_culture: string;
    values_alignment: string[];
  };
  personalization: {
    role_specific_highlights: string[];
    company_specific_connections: string[];
    value_proposition: string;
  };
  optimization_notes: string[];
}

class AIServicesClient {
  private readonly baseEndpoint = '/ai-career';

  /**
   * Get intelligent job matching recommendations
   */
  async getJobMatching(request: JobMatchingRequest): Promise<JobMatchingResult> {
    return apiClient.post(`${this.baseEndpoint}/job-matching`, request);
  }

  /**
   * Optimize content (resume, cover letter, etc.) using AI
   */
  async optimizeContent(request: ContentOptimizationRequest): Promise<ContentOptimizationResult> {
    return apiClient.post(`${this.baseEndpoint}/content-optimization`, request);
  }

  /**
   * Get advanced resume intelligence and career insights
   */
  async getResumeIntelligence(
    request: ResumeIntelligenceRequest
  ): Promise<ResumeIntelligenceResult> {
    return apiClient.post(`${this.baseEndpoint}/resume-intelligence`, request);
  }

  /**
   * Generate smart, personalized cover letters
   */
  async generateCoverLetter(request: SmartCoverLetterRequest): Promise<SmartCoverLetterResult> {
    return apiClient.post(`${this.baseEndpoint}/cover-letter-generation`, request);
  }

  /**
   * Get career transition analysis and recommendations
   */
  async getCareerTransitionAnalysis(request: {
    current_role: string;
    target_role: string;
    resume_content?: string;
    document_id?: string;
  }): Promise<{
    transition_feasibility: number;
    required_skills: string[];
    recommended_experience: string[];
    timeline_estimate: string;
    transition_strategy: string[];
    potential_challenges: string[];
    success_factors: string[];
  }> {
    return apiClient.post(`${this.baseEndpoint}/career-transition`, request);
  }

  /**
   * Get salary insights and negotiation recommendations
   */
  async getSalaryInsights(request: {
    role: string;
    location: string;
    experience_level: string;
    skills: string[];
    company_size?: string;
    industry?: string;
  }): Promise<{
    salary_range: {
      min: number;
      max: number;
      median: number;
    };
    market_positioning: string;
    negotiation_points: string[];
    skill_premiums: Array<{
      skill: string;
      premium_percentage: number;
    }>;
    recommendations: string[];
  }> {
    return apiClient.post(`${this.baseEndpoint}/salary-insights`, request);
  }

  /**
   * Get interview preparation assistance
   */
  async getInterviewPrep(request: {
    job_description: string;
    resume_content?: string;
    document_id?: string;
    interview_type?: string;
  }): Promise<{
    likely_questions: Array<{
      question: string;
      category: string;
      difficulty: string;
      suggested_approach: string;
    }>;
    key_talking_points: string[];
    weakness_mitigation: string[];
    questions_to_ask: string[];
    preparation_timeline: string[];
  }> {
    return apiClient.post(`${this.baseEndpoint}/interview-prep`, request);
  }

  /**
   * Get personal branding analysis and recommendations
   */
  async getPersonalBrandingAnalysis(request: {
    resume_content?: string;
    document_id?: string;
    linkedin_profile?: string;
    target_audience?: string;
  }): Promise<{
    current_brand_assessment: string;
    brand_strengths: string[];
    brand_gaps: string[];
    messaging_framework: {
      value_proposition: string;
      key_messages: string[];
      proof_points: string[];
    };
    content_strategy: string[];
    platform_recommendations: string[];
  }> {
    return apiClient.post(`${this.baseEndpoint}/personal-branding`, request);
  }

  /**
   * Get networking strategy and recommendations
   */
  async getNetworkingStrategy(request: {
    career_goals: string;
    current_industry: string;
    target_industry?: string;
    experience_level: string;
  }): Promise<{
    networking_strategy: string[];
    target_connections: Array<{
      role_type: string;
      why_valuable: string;
      how_to_connect: string[];
    }>;
    conversation_starters: string[];
    follow_up_strategies: string[];
    networking_goals: string[];
  }> {
    return apiClient.post(`${this.baseEndpoint}/networking-strategy`, request);
  }
}

// Export singleton instance
export const aiServices = new AIServicesClient();
export default aiServices;
