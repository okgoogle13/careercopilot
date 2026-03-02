<<<<<<< HEAD
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getIdToken } from './authService';
import { ApiResponse, ApiError, isApiError, createErrorResponse } from '@/types/api';

// Create axios instance with base URL and default headers
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api', // Ensure this is set in your .env file
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Skip adding auth header for public endpoints
    const publicEndpoints = ['/auth/login', '/auth/register'];
    if (publicEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      return config;
    }

    const token = await getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // Transform the response to match our standard format
    if (response.data && typeof response.data === 'object') {
      return {
        ...response,
        data: {
          data: response.data.data,
          message: response.data.message,
          success: response.data.success ?? true,
          timestamp: response.data.timestamp || new Date().toISOString(),
        },
      };
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle token expiration (401) and retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token if refresh token endpoint exists
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        // Update the token in your auth context or storage
        // Then retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      // You can add custom error handling based on status codes
      if (error.response.status === 403) {
        // Handle forbidden access
        console.error('Forbidden: You do not have permission to access this resource');
      } else if (error.response.status === 404) {
        // Handle not found
        console.error('Resource not found');
      } else if (error.response.status >= 500) {
        // Handle server errors
        console.error('Server error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export { apiClient };

=======
import { ApiError, ApiResponse, createErrorResponse, isApiError } from '@/types/api';
import { AxiosRequestConfig } from 'axios';
import { axiosInstance as apiClient } from './axiosConfig';

export { apiClient };

import axios from 'axios';

>>>>>>> restoration-KR-Rage-Figma-v2.0
/**
 * Handles API errors consistently and returns an ApiError object
 */
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with a status other than 200 range
      const { data, status, statusText } = error.response;

      if (isApiError(data)) {
        return data;
      }

      return createErrorResponse(
        `HTTP_${status}`,
        data?.message || statusText || 'An error occurred',
        data
      );
    } else if (error.request) {
      // Request was made but no response received
      return createErrorResponse(
        'NETWORK_ERROR',
        'No response from server. Please check your connection.'
      );
    }
  } else if (error instanceof Error) {
    // General error
    return createErrorResponse('UNKNOWN_ERROR', error.message || 'An unknown error occurred');
  }

  // Fallback for unknown error types
  return createErrorResponse('UNKNOWN_ERROR', 'An unknown error occurred');
};

/**
 * Wrapper around apiClient.get with proper typing
 */
export const apiGet = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Wrapper around apiClient.post with proper typing
 */
export const apiPost = async <T = any, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Wrapper around apiClient.put with proper typing
 */
export const apiPut = async <T = any, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Wrapper around apiClient.delete with proper typing
 */
export const apiDelete = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
