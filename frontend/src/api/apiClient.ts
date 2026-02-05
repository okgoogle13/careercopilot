import { ApiError, ApiResponse, createErrorResponse, isApiError } from '@/types/api';
import { AxiosRequestConfig } from 'axios';
import { axiosInstance as apiClient } from './axiosConfig';

export { apiClient };

import axios from 'axios';

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
