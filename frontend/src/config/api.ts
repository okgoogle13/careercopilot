// API Configuration
// Centralized API base URL configuration to support multiple environments

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === 'production'
        ? 'https://api.careercopilot.app' // Update with actual production URL
        : 'http://localhost:8000');

export const API_ENDPOINTS = {
    // Authentication
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,

    // Job Queue & Ingestion
    jobQueue: `${API_BASE_URL}/api/ingest/queue`,
    analyzeJob: (jobId: string) => `${API_BASE_URL}/api/ingest/${jobId}/analyze`,
    draftCoverLetter: (jobId: string) => `${API_BASE_URL}/api/ingest/${jobId}/draft`,

    // Job Scout
    jobScoutSearch: `${API_BASE_URL}/api/v1/job-scout/search`,

    // Applications (placeholder for future API)
    applications: `${API_BASE_URL}/api/applications`,

    // User Profile (placeholder)
    profile: `${API_BASE_URL}/api/profile`,

    // Health Check
    health: `${API_BASE_URL}/health`,
} as const;

/**
 * Helper function to build URLs with query parameters
 */
export function buildUrl(baseUrl: string, params?: Record<string, string | number | boolean>): string {
    if (!params) return baseUrl;

    const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');

    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Environment information (useful for debugging)
 */
export const ENV_INFO = {
    mode: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    apiBaseUrl: API_BASE_URL,
} as const;

// Log environment info in development
if (ENV_INFO.isDevelopment) {
    console.log('[API Config]', ENV_INFO);
}
