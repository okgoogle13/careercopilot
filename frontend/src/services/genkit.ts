import { supabase } from '../config/supabase';

// Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Helper for Auth Token
const getAuthToken = async () => {
  if (import.meta.env.DEV) return 'dev-token';
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || '';
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
};

export const genkitApi = USE_MOCK ? mockGenkitApi : realGenkitApi;
