// src/services/api.ts
/**
 * API service for interacting with the backend
 */

/**
 * Fetches the user profile from the API
 * @returns A promise that resolves to the user profile
 */
export async function fetchUserProfile(): Promise<unknown> {
  // Use absolute URL in Node, relative in browser/jsdom
  let apiUrl = '/api/profile';
  if (typeof process !== 'undefined' && process.release && process.release.name === 'node') {
    apiUrl = 'http://localhost/api/profile';
  }
  const response = await fetch(apiUrl);
  // debug: fetch called (no-op for linting)
  // console.debug('fetchUserProfile called', apiUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Interface for document creation payload
 */
interface DocumentPayload {
  title: string;
  content: string;
}

/**
 * Creates a new document
 * @param document - The document payload
 * @returns A promise that resolves to the created document
 */
export async function createDocument(document: DocumentPayload): Promise<unknown> {
  const response = await fetch(getApiUrl('/api/documents'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(document),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create document: ${response.status}`);
  }
  
  return response.json();
}

function getApiUrl(path: string): string {
  // Check for environment variable first
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (backendUrl) {
    return `${backendUrl}${path}`;
  }
  
  // Node.js testing environment
  if (typeof process !== 'undefined' && process.release && process.release.name === 'node') {
    return `http://localhost${path}`;
  }
  
  // Browser - use relative path (proxied by Vite or served by same domain)
  return path;
}
