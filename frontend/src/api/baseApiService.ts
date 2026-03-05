/**
 * Base API Service Factory
 *
 * Eliminates code duplication across API services by providing a reusable
 * API client factory with authentication and error handling built-in.
 *
 * This replaces the pattern of creating axios instances in each service file
 * with auth interceptors and error handling duplicated 24+ times.
 */

import { axiosInstance } from './axiosConfig';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { handleApiError } from './apiClient';

export interface ApiServiceConfig {
  /**
   * Base path for the service (e.g., '/jobs', '/documents')
   * Will be appended to the base API URL
   */
  basePath: string;
}

/**
 * Base API service class that all service classes can extend.
 * Provides common HTTP methods with authentication and error handling.
 */
export class BaseApiService {
  protected client: AxiosInstance;
  protected basePath: string;

  constructor(config: ApiServiceConfig) {
    this.client = axiosInstance;
    this.basePath = config.basePath;
  }

  /**
   * Build full URL path by combining base path and endpoint
   */
  protected buildUrl(endpoint: string): string {
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    // Remove trailing slash from basePath if present
    const cleanBasePath = this.basePath.endsWith('/') ? this.basePath.slice(0, -1) : this.basePath;

    return `${cleanBasePath}/${cleanEndpoint}`;
  }

  /**
   * GET request
   */
  protected async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(this.buildUrl(endpoint), config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * POST request
   */
  protected async post<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(
        this.buildUrl(endpoint),
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * PUT request
   */
  protected async put<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(
        this.buildUrl(endpoint),
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * PATCH request
   */
  protected async patch<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(
        this.buildUrl(endpoint),
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * DELETE request
   */
  protected async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(this.buildUrl(endpoint), config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

/**
 * Example usage in a service file:
 *
 * ```typescript
 * import { BaseApiService } from './baseApiService';
 *
 * export class JobService extends BaseApiService {
 *   constructor() {
 *     super({ basePath: '/jobs' });
 *   }
 *
 *   async getJobs(): Promise<Job[]> {
 *     return this.get<Job[]>('');
 *   }
 *
 *   async getJob(id: string): Promise<Job> {
 *     return this.get<Job>(`/${id}`);
 *   }
 *
 *   async createJob(data: JobCreateRequest): Promise<Job> {
 *     return this.post<Job>('', data);
 *   }
 * }
 *
 * export const jobService = new JobService();
 * ```
 *
 * This eliminates the need for:
 * - Creating axios instances in each service
 * - Adding auth interceptors in each service
 * - Duplicating error handling in each method
 */
