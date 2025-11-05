import {
  Application,
  ApplicationStats,
  CreateApplicationRequest,
  CreateApplicationResponse,
  UpdateApplicationRequest,
  ParsedJobPosting,
} from '../types/application';

/**
 * Base API URL - adjust based on your environment
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

/**
 * Get authorization headers with Firebase token
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  // In a real app, this would get the Firebase token
  const token = localStorage.getItem('firebaseToken') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Handle API errors and throw with proper error messages
 */
function handleApiError(error: unknown): never {
  if (error instanceof Response) {
    throw new Error(`API Error: ${error.statusText} (${error.status})`);
  }
  throw new Error(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

/**
 * Create a new application
 */
export async function createApplication(
  request: CreateApplicationRequest
): Promise<CreateApplicationResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
}

/**
 * Get all applications for the current user
 */
export async function getApplications(): Promise<Application[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      handleApiError(response);
    }

    const data = await response.json();
    return data.applications || [];
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

/**
 * Get a specific application by ID
 */
export async function getApplication(applicationId: string): Promise<Application> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
}

/**
 * Update an application
 */
export async function updateApplication(
  applicationId: string,
  request: UpdateApplicationRequest
): Promise<Application> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
}

/**
 * Delete an application
 */
export async function deleteApplication(applicationId: string): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      handleApiError(response);
    }
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
}

/**
 * Get application statistics
 */
export async function getApplicationStats(): Promise<ApplicationStats> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/stats`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching application stats:', error);
    // Return default stats on error
    return {
      total: 0,
      applied: 0,
      interviewing: 0,
      offer: 0,
      rejected: 0,
    };
  }
}

/**
 * Get timeline events for an application
 */
export async function getApplicationTimeline(
  applicationId: string
): Promise<Application['timeline']> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/timeline`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      handleApiError(response);
    }

    const data = await response.json();
    return data.timeline || [];
  } catch (error) {
    console.error('Error fetching timeline:', error);
    throw error;
  }
}

/**
 * Add a timeline event to an application
 */
export async function addTimelineEvent(
  applicationId: string,
  event: {
    event: string;
    type: 'applied' | 'interview' | 'followup' | 'offer' | 'rejection' | 'note';
    date?: string;
  }
): Promise<Application> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/timeline`, {
      method: 'POST',
      headers,
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding timeline event:', error);
    throw error;
  }
}

/**
 * Parse a job posting URL to extract job details
 */
export async function parseJobPosting(url: string): Promise<ParsedJobPosting> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/jobs/parse`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Error parsing job posting:', error);
    // Return empty object on error - user can fill in manually
    return {
      jobTitle: '',
      company: '',
      location: '',
      jobDescription: '',
    };
  }
}

/**
 * Attach a document to an application
 */
export async function attachDocumentToApplication(
  applicationId: string,
  documentId: string
): Promise<Application> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/documents`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ documentId }),
    });

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Error attaching document:', error);
    throw error;
  }
}

/**
 * Detach a document from an application
 */
export async function detachDocumentFromApplication(
  applicationId: string,
  documentId: string
): Promise<Application> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/applications/${applicationId}/documents/${documentId}`,
      {
        method: 'DELETE',
        headers,
      }
    );

    if (!response.ok) {
      handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    console.error('Error detaching document:', error);
    throw error;
  }
}
