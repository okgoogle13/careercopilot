/**
 * Voice Profile API Service
 *
 * Handles communication with backend voice profile extraction endpoint.
 * Converts user-provided writing samples into a voice profile
 * (tone, vocabulary level, preferred phrasing).
 */

interface VoiceProfileResponse {
  message: string;
  user_id: string;
}

interface VoiceProfileData {
  tone: string;
  style: string;
  vocabularyLevel: string;
  preferredPhrasing: string[];
  savedAt?: string;
}

/**
 * Submit writing samples to create/update user's voice profile.
 *
 * @param documents - Array of writing samples (cover letter, emails, etc.)
 * @returns Response with message and user_id
 * @throws Error on HTTP error or validation failure
 */
export async function createVoiceProfile(documents: string[]): Promise<VoiceProfileResponse> {
  try {
    if (!documents || documents.length === 0) {
      throw new Error('At least one writing sample is required');
    }

    const response = await fetch('/api/v1/auth/voice-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const detail = errorData.detail || `HTTP ${response.status}`;
      throw new Error(detail);
    }

    return response.json();
  } catch (error) {
    console.error('Voice profile creation failed:', error);
    throw error;
  }
}

/**
 * Fetch current user's voice profile from the backend.
 *
 * @returns The user's voice profile, or null if none exists yet.
 */
export async function getVoiceProfile(): Promise<VoiceProfileData | null> {
  const response = await fetch('/api/v1/auth/voice-profile', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detail = errorData.detail || `HTTP ${response.status}`;
    throw new Error(detail);
  }

  const data = await response.json();
  return data ?? null;
}
