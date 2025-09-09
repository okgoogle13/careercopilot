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
          errorData.detail ||
          errorData.message ||
          `HTTP ${response.status}: ${response.statusText}`
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
      job_description: jobDescription.trim()
    };

    const response = await apiClient.post<KscGenerationResponse>(
      '/ksc/generate',
      requestBody
    );

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
      job_description: jobDescription.trim()
    };

    const response = await apiClient.post<{ criteria: KscCriterion[] }>(
      '/ksc/detect',
      requestBody
    );

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
      user_profile: userProfile
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
export async function generateCoverLetter(
  jobDescription: string,
  tone: string
): Promise<string> {
  try {
    if (!jobDescription || jobDescription.trim().length === 0) {
      throw new Error('Job description is required');
    }

    if (!tone || tone.trim().length === 0) {
      throw new Error('Tone is required');
    }

    const requestBody = {
      jobDescription: jobDescription.trim(),
      tone: tone.trim()
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
      userProfileId: userProfileId.trim()
    };

    const response = await apiClient.post<any>(
      '/resumes/tailored',
      requestBody
    );

    return response;

  } catch (error) {
    console.error('Tailored Resume Generation Error:', error);

    if (error instanceof Error) {
      throw new Error(`Failed to generate tailored resume: ${error.message}`);
    }

    throw new Error('Failed to generate tailored resume: Unknown error occurred');
  }
}

// Export the API client for use in other modules
export { apiClient };
