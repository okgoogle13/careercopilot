import { auth } from '../config/firebase';

// Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Helper for Auth Token
const getAuthToken = async () => {
  if (import.meta.env.DEV) return 'dev-token';
  const user = auth.currentUser;
  return user ? await user.getIdToken() : '';
};

// Types
export interface CoverLetterRequest {
  candidate_profile: any;
  job_description: string;
  company_info?: any;
  style?: string;
  format_type?: string;
  special_instructions?: string;
}

export interface KSCRequest {
  user_profile_data: any;
  ksc_statement: string;
}

export interface SmartCoverLetter {
  letter_content: string;
  subject_line?: string;
  sections: any[];
  analysis: any;
  personalization_notes: string[];
  key_selling_points: string[];
  company_connections: string[];
  alternative_versions: Record<string, string>;
  follow_up_suggestions: string[];
}

export interface STAR_Response {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface OptimizeResumeRequest {
  resume_text: string;
  missing_keywords: string[];
  job_description: string;
}

export interface OptimizedResume {
  resume_text: string;
  keywords_integrated: string[];
}

export interface CompanyContextRequest {
  company_name: string;
  job_description: string;
}

export interface CompanyContext {
  recent_achievements: string[];
  core_values: string[];
  recommended_tone: string;
  why_work_here_points: string[];
  interview_questions: string[];
  cultural_insights: string;
}

export interface JobListingDetails {
  due_date?: string;
  company_name?: string;
  role_title?: string;
  hiring_manager?: string;
  manager_contact?: string;
  essential_criteria: string[];
  desirable_criteria: string[];
  role_type?: string;
  subsectors: string[];
  location?: string;
  key_responsibilities: string[];
  full_description?: string;
}

export interface UnifiedJobAnalysis {
  job_details: JobListingDetails;
  company_context?: CompanyContext;
  analysis_success: boolean;
  error_message?: string;
}

export interface AnalyzeJobUrlRequest {
  url: string;
}

// Mock Implementation
const mockGenkitApi = {
  async generateCoverLetter(data: CoverLetterRequest): Promise<SmartCoverLetter> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      letter_content: `Dear Hiring Manager,\n\nI am writing to express my interest in the position... (Mock Generated for ${data.style})`,
      sections: [],
      analysis: {
        readability_score: 85,
        personalization_score: 90,
        compelling_score: 88,
        keyword_alignment: 92,
        strengths: ['Strong opening', 'Clear examples'],
        improvement_areas: [],
        tone_assessment: 'Professional',
        unique_elements: [],
      },
      personalization_notes: ['Matched skills to job desc'],
      key_selling_points: ['Leadership', 'Technical Skills'],
      company_connections: ['Values alignment'],
      alternative_versions: {},
      follow_up_suggestions: ['Send thank you email'],
    };
  },

  async generateKSCResponse(criteria: string, starData: any): Promise<STAR_Response> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      situation: starData.situation || 'Mock Situation',
      task: starData.task || 'Mock Task',
      action: starData.action || 'Mock Action',
      result: starData.result || 'Mock Result - Achieved 100% efficiency',
    };
  },

  async optimizeResume(data: OptimizeResumeRequest): Promise<OptimizedResume> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      resume_text: `${data.resume_text}\n\n[Mock: Integrated keywords: ${data.missing_keywords.join(', ')}]`,
      keywords_integrated: data.missing_keywords,
    };
  },

  async getCompanyContext(data: CompanyContextRequest): Promise<CompanyContext> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      recent_achievements: [
        `${data.company_name} launched new product line in Q3 2025`,
        'Expanded to APAC market',
      ],
      core_values: ['Innovation', 'Collaboration', 'Customer-First'],
      recommended_tone: 'conversational',
      why_work_here_points: [
        'Leading innovator in the space',
        'Strong growth trajectory',
        'Excellent learning opportunities',
      ],
      interview_questions: [
        'How does the team approach innovation?',
        'What are the biggest challenges for this role?',
        'How do you measure success in this position?',
      ],
      cultural_insights: 'Fast-paced, collaborative environment with emphasis on autonomy',
    };
  },

  async analyzeJobFromUrl(data: AnalyzeJobUrlRequest): Promise<UnifiedJobAnalysis> {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      job_details: {
        company_name: 'Example Corp',
        role_title: 'Senior Software Engineer',
        essential_criteria: ['Python', 'React', '5+ years experience'],
        desirable_criteria: ['AWS', 'Docker', 'Team leadership'],
        role_type: 'Full-time',
        subsectors: ['Technology', 'SaaS'],
        location: 'Remote',
        key_responsibilities: [
          'Lead development of core platform features',
          'Mentor junior engineers',
          'Collaborate with product team',
        ],
        full_description: `[Mock] Full job description extracted from ${data.url}`,
      },
      company_context: {
        recent_achievements: [
          'Launched AI-powered analytics platform in Q4 2025',
          'Expanded to 15 new markets',
        ],
        core_values: ['Innovation', 'Customer Success', 'Collaboration'],
        recommended_tone: 'conversational',
        why_work_here_points: [
          'Cutting-edge technology stack',
          'Strong growth trajectory',
          'Remote-first culture',
        ],
        interview_questions: [
          'What excites you most about our product roadmap?',
          'How do you approach technical mentorship?',
          'What are your thoughts on our tech stack?',
        ],
        cultural_insights: 'Fast-paced startup environment with strong emphasis on innovation',
      },
      analysis_success: true,
    };
  },
};

// Real Implementation
const realGenkitApi = {
  async generateCoverLetter(data: CoverLetterRequest): Promise<SmartCoverLetter> {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/genkit/cover-letter/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to generate cover letter');
    }

    return await response.json();
  },

  async generateKSCResponse(
    criteria: string,
    starData: any,
    userProfile: any
  ): Promise<STAR_Response> {
    const token = await getAuthToken();
    const payload: KSCRequest = {
      user_profile_data: userProfile,
      ksc_statement: `Criteria: ${criteria}\nSituation: ${starData.situation}\nTask: ${starData.task}\nAction: ${starData.action}\nResult: ${starData.result}`,
    };

    const response = await fetch(`${API_URL}/genkit/ksc/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to generate KSC response');
    }

    return await response.json();
  },

  async optimizeResume(data: OptimizeResumeRequest): Promise<OptimizedResume> {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/genkit/resume/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to optimize resume');
    }

    return await response.json();
  },

  async getCompanyContext(data: CompanyContextRequest): Promise<CompanyContext> {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/genkit/company/context`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to get company context');
    }

    return await response.json();
  },

  async analyzeJobFromUrl(data: AnalyzeJobUrlRequest): Promise<UnifiedJobAnalysis> {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/genkit/job/analyze-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to analyze job from URL');
    }

    return await response.json();
  },
};

export const genkitApi = USE_MOCK ? mockGenkitApi : realGenkitApi;
