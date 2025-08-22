// Centralized API client with standardized error handling
import { getAuth } from 'firebase/auth';
import {
  ApiError,
  AuthenticationError,
  NetworkError,
  reportError,
} from './errors';

export interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(baseURL: string = '/api/v1') {
    this.baseURL = baseURL;
    this.defaultTimeout = 30000; // 30 seconds
    this.defaultRetries = 2;
  }

  private async getAuthToken(): Promise<string> {
    const user = getAuth().currentUser;
    if (!user) {
      throw new AuthenticationError('User not authenticated');
    }

    try {
      return await user.getIdToken();
    } catch (error) {
      reportError(error, 'getAuthToken');
      throw new AuthenticationError('Failed to get authentication token');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = 1000,
      ...fetchOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const token = await this.getAuthToken();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          await this.handleApiError(response, endpoint);
        }

        return response.json();
      } catch (error) {
        // Don't retry on authentication errors or client errors
        if (
          error instanceof AuthenticationError ||
          (error instanceof ApiError && error.isClientError)
        ) {
          throw error;
        }

        // If this is the last attempt, throw the error
        if (attempt === retries) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            throw new NetworkError('Request timeout. Please try again.');
          }

          if (
            error instanceof TypeError &&
            error.message.includes('Failed to fetch')
          ) {
            throw new NetworkError(
              'Network connection failed. Please check your internet connection.'
            );
          }

          reportError(error, `API Request to ${endpoint}`);
          throw error;
        }

        // Wait before retrying (exponential backoff)
        await this.delay(retryDelay * Math.pow(2, attempt));
      }
    }

    throw new NetworkError('Maximum retries exceeded');
  }

  private async handleApiError(
    response: Response,
    endpoint: string
  ): Promise<never> {
    const contentType = response.headers.get('content-type');

    let errorData: Record<string, unknown> = {};
    let errorMessage = `Request failed with status ${response.status}`;

    if (contentType && contentType.includes('application/json')) {
      try {
        errorData = await response.json();
        const detail =
          typeof errorData.detail === 'string' ? errorData.detail : '';
        const message =
          typeof errorData.message === 'string' ? errorData.message : '';
        errorMessage = detail || message || errorMessage;
      } catch {
        // If JSON parsing fails, use default message
      }
    }

    const apiError = new ApiError(errorMessage, response.status, errorData);
    reportError(apiError, `API Error on ${endpoint}`);
    throw apiError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API methods
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing or custom instances
export { ApiClient };
