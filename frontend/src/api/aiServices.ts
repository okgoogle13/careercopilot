// AI Services API client for Career Copilot
// Handles communication with backend AI-powered endpoints

// Basic API client utility
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '/api/v1') {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Types for KSC API responses
export interface KscCriterion {
  id: string;
  text: string;
  category?: string;
}

export interface KscResponse {
  criterion_id: string;
  response: string;
  word_count?: number;
  confidence_score?: number;
}

export interface KscGenerationRequest {
  job_description: string;
}

export interface KscGenerationResponse {
  criteria: KscCriterion[];
  responses: KscResponse[];
  processing_time?: number;
}

/**
 * Generate KSC (Key Selection Criteria) responses based on job description
 *
 * @param jobDescription - The job description text to analyze
 * @returns Promise<string[]> - Array of generated KSC response strings
 */
export async function generateKscResponses(jobDescription: string): Promise<string[]> {
  try {
    if (!jobDescription || jobDescription.trim().length === 0) {
      throw new Error('Job description is required');
    }

    const requestBody: KscGenerationRequest = {
      job_description: jobDescription.trim(),
    };

    const response = await apiClient.post<KscGenerationResponse>('/ksc/generate', requestBody);

    // Extract response strings from the API response
    if (response.responses && Array.isArray(response.responses)) {
      return response.responses.map(r => r.response);
    }

    // Fallback if response structure is different
    if (Array.isArray(response)) {
      return response as string[];
    }

    throw new Error('Invalid response format from KSC generation endpoint');
  } catch (error) {
    console.error('KSC Generation Error:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to generate KSC responses: ${error.message}`);
    }

    throw new Error('Failed to generate KSC responses: Unknown error occurred');
  }
}

/**
 * Detect KSC criteria from job description
 *
 * @param jobDescription - The job description text to analyze
 * @returns Promise<KscCriterion[]> - Array of detected criteria
 */
export async function detectKscCriteria(jobDescription: string): Promise<KscCriterion[]> {
  try {
    if (!jobDescription || jobDescription.trim().length === 0) {
      throw new Error('Job description is required');
    }

    const requestBody = {
      job_description: jobDescription.trim(),
    };

    const response = await apiClient.post<{ criteria: KscCriterion[] }>('/ksc/detect', requestBody);

    return response.criteria || [];
  } catch (error) {
    console.error('KSC Detection Error:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to detect KSC criteria: ${error.message}`);
    }

    throw new Error('Failed to detect KSC criteria: Unknown error occurred');
  }
}

/**
 * Generate a specific KSC response for a given criterion
 *
 * @param criterion - The KSC criterion text
 * @param jobDescription - The job description context
 * @param userProfile - Optional user profile data for personalization
 * @returns Promise<string> - Generated response text
 */
export async function generateSingleKscResponse(
  criterion: string,
  jobDescription: string,
  userProfile?: any
): Promise<string> {
  try {
    if (!criterion || criterion.trim().length === 0) {
      throw new Error('KSC criterion is required');
    }

    if (!jobDescription || jobDescription.trim().length === 0) {
      throw new Error('Job description is required');
    }

    const requestBody = {
      criterion: criterion.trim(),
      job_description: jobDescription.trim(),
      user_profile: userProfile,
    };

    const response = await apiClient.post<{ response: string }>(
      '/ksc/generate-single',
      requestBody
    );

    return response.response || '';
  } catch (error) {
    console.error('Single KSC Generation Error:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to generate KSC response: ${error.message}`);
    }

    throw new Error('Failed to generate KSC response: Unknown error occurred');
  }
}

/**
 * Generate a cover letter based on job description and tone
 *
 * @param jobDescription - The job description text to tailor the cover letter to
 * @param tone - The desired tone for the cover letter (e.g., 'professional', 'enthusiastic', 'creative')
 * @returns Promise<string> - Generated cover letter text
 */
export async function generateCoverLetter(jobDescription: string, tone: string): Promise<string> {
  try {
    if (!jobDescription || jobDescription.trim().length === 0) {
      throw new Error('Job description is required');
    }

    if (!tone || tone.trim().length === 0) {
      throw new Error('Tone is required');
    }

    const requestBody = {
      jobDescription: jobDescription.trim(),
      tone: tone.trim(),
    };

    const response = await apiClient.post<{ cover_letter: string }>(
      '/cover-letters/generate',
      requestBody
    );

    return response.cover_letter || '';
  } catch (error) {
    console.error('Cover Letter Generation Error:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to generate cover letter: ${error.message}`);
    }

    throw new Error('Failed to generate cover letter: Unknown error occurred');
  }
}

/**
 * Generate a tailored resume based on job description and user profile
 *
 * @param jobDescription - The job description text to tailor the resume to
 * @param userProfileId - The user's profile ID for personalization
 * @returns Promise<any> - Generated resume data
 */
export async function generateTailoredResume(
  jobDescription: string,
  userProfileId: string
): Promise<any> {
  try {
    if (!jobDescription || jobDescription.trim().length === 0) {
      throw new Error('Job description is required');
    }

    if (!userProfileId || userProfileId.trim().length === 0) {
      throw new Error('User profile ID is required');
    }

    const requestBody = {
      jobDescription: jobDescription.trim(),
      userProfileId: userProfileId.trim(),
    };

    const response = await apiClient.post<any>('/resumes/tailored', requestBody);

    return response;
  } catch (error) {
    console.error('Tailored Resume Generation Error:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to generate tailored resume: ${error.message}`);
    }

    throw new Error('Failed to generate tailored resume: Unknown error occurred');
  }
}

// Types for Application Package API
export interface ApplicationPackageRequest {
  job_description: string;
  user_profile: any;
}

export interface TailoredResumeResult {
  tailored_content: string;
  original_score: number;
  tailored_score: number;
  improvements_made: string[];
  keyword_matches: string[];
  competitive_advantages: string[];
}

export interface SmartCoverLetter {
  letter_content: string;
  subject_line?: string;
  personalization_notes: string[];
  key_selling_points: string[];
  company_connections: string[];
  alternative_versions: Record<string, string>;
  follow_up_suggestions: string[];
}

export interface KSCResponsesResult {
  generated_responses: Array<Record<string, any>>;
  total_criteria_addressed: number;
  coverage_completeness: string;
  response_quality_score: number;
}

export interface ApplicationPackageResult {
  success: boolean;
  tailored_resume?: TailoredResumeResult;
  cover_letter?: SmartCoverLetter;
  ksc_responses?: KSCResponsesResult;
  job_match_score: number;
  application_strength: string;
  competitive_positioning: string[];
  success_probability: number;
  application_strategy: string[];
  interview_prep_focus: string[];
  follow_up_recommendations: string[];
  generation_timestamp: string;
  processing_time_seconds: number;
  components_generated: string[];
  error_details: string[];
}

export interface ApplicationPackageResponse {
  success: boolean;
  data?: ApplicationPackageResult;
  message: string;
  processing_time_seconds: number;
}

/**
 * Prepare a complete application package including tailored resume, cover letter, and KSC responses
 *
 * @param jobDescription - The job description text to prepare the application for
 * @returns Promise<ApplicationPackageResponse> - Complete application package with all components
 */
export async function prepareApplicationPackage(
  jobDescription: string
): Promise<ApplicationPackageResponse> {
  try {
    if (!jobDescription || jobDescription.trim().length === 0) {
      throw new Error('Job description is required');
    }

    // Get current user profile (this would typically come from your auth/profile service)
    // For now, we'll create a basic profile structure - you may need to adapt this
    // to fetch from your actual user profile service
    const userProfile = {
      resume_content: '', // This should be fetched from user's stored resume
      skills: [], // User's skills array
      experience: [], // User's experience array
      education: [], // User's education array
      target_industry: '', // User's target industry
      career_goals: '', // User's career goals
      experience_level: 'mid_level', // User's experience level
    };

    const requestBody: ApplicationPackageRequest = {
      job_description: jobDescription.trim(),
      user_profile: userProfile,
    };

    const response = await apiClient.post<ApplicationPackageResponse>(
      '/workflows/generate-application',
      requestBody
    );

    return response;
  } catch (error) {
    console.error('Application Package Generation Error:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to prepare application package: ${error.message}`);
    }

    throw new Error('Failed to prepare application package: Unknown error occurred');
  }
}

// Types for Email Scanning API
export interface EmailScanRequest {
  user_id: string;
}

export interface OpportunityTaskResult {
  opportunity_id: string;
  job_title: string;
  company: string;
  match_score: number;
  task_created: boolean;
  calendar_event_id: string;
  processing_status: string;
  error_message: string;
}

export interface EmailWorkflowResult {
  success: boolean;
  total_opportunities_found: number;
  opportunities_processed: number;
  high_scoring_opportunities: number;
  tasks_created: number;
  processing_results: OpportunityTaskResult[];
  workflow_timestamp: string;
  execution_time_seconds: number;
  error_message: string;
}

export interface EmailScanResponse {
  success: boolean;
  data?: EmailWorkflowResult;
  message: string;
}

/**
 * Scan user's inbox for job opportunities and create tasks for high-scoring matches
 *
 * @returns Promise<EmailScanResponse> - Email scanning results with opportunity processing details
 */
export async function scanInboxForOpportunities(): Promise<EmailScanResponse> {
  try {
    // Get current user ID (this would typically come from your auth service)
    // For now, we'll use a placeholder - you may need to adapt this
    // to fetch from your actual authentication service
    const currentUserId = 'current-user-id'; // This should be fetched from auth context

    const requestBody: EmailScanRequest = {
      user_id: currentUserId,
    };

    const response = await apiClient.post<EmailScanResponse>(
      '/workflows/scan-email-opportunities',
      requestBody
    );

    return response;
  } catch (error) {
    console.error('Email Scanning Error:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to scan inbox for opportunities: ${error.message}`);
    }

    throw new Error('Failed to scan inbox for opportunities: Unknown error occurred');
  }
}

// Export the API client for use in other modules
export { apiClient };
