/**
 * @file This file contains the service layer for interacting with the Smart Ingestion API.
 * It provides type-safe functions for uploading files and processing data,
 * leveraging Zod for response validation and a custom error class for structured error handling.
 */

import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import {
  UploadAndTagResponse,
  uploadAndTagResponseSchema,
  ExtractAndSaveRequest,
  extractAndSaveRequestSchema,
  ExtractAndSaveResponse,
  extractAndSaveResponseSchema,
} from '../schemas/api.schema';

/**
 * Custom error class for API service-related issues.
 * This allows for structured error handling, capturing the HTTP status and detailed error messages.
 */
export class ApiServiceError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = 'ApiServiceError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Uploads a file and retrieves AI-suggested tags.
 *
 * @param file The file to upload (e.g., from an input element).
 * @param onUploadProgress A callback function to track upload progress (0-100).
 * @returns A promise that resolves to the validated upload-and-tag response.
 * @throws {ApiServiceError} If the API request fails or the response is invalid.
 */
export const uploadAndTagFile = async (
  file: File,
  onUploadProgress: (progress: number) => void
): Promise<UploadAndTagResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/ingestion/upload-and-tag', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        if (total) {
          const percentage = Math.round((loaded * 100) / total);
          onUploadProgress(percentage);
        }
      },
    });

    // Validate the response data against the Zod schema
    const validatedData = uploadAndTagResponseSchema.parse(response.data);
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      throw new ApiServiceError('Invalid response data from server.', 500, error.issues);
    } else if (axios.isAxiosError(error)) {
      // Handle network/API errors
      const axiosError = error as AxiosError;
      throw new ApiServiceError(
        (axiosError.response?.data as any)?.message || 'An unexpected error occurred during file upload.',
        axiosError.response?.status || 500,
        axiosError.response?.data
      );
    } else {
      // Handle other unexpected errors
      throw new ApiServiceError('An unexpected error occurred.', 500, error);
    }
  }
};

/**
 * Sends extracted data and user-confirmed tags to be saved.
 *
 * @param requestBody The data to be saved, conforming to the ExtractAndSaveRequest schema.
 * @returns A promise that resolves to the validated extract-and-save response.
 * @throws {ApiServiceError} If the API request fails or the response is invalid.
 */
export const extractAndSaveData = async (
  requestBody: ExtractAndSaveRequest
): Promise<ExtractAndSaveResponse> => {
  try {
    // First, validate the request body before sending it
    extractAndSaveRequestSchema.parse(requestBody);

    const response = await axios.post('/api/ingestion/extract-and-save', requestBody);

    // Validate the response data against the Zod schema
    const validatedData = extractAndSaveResponseSchema.parse(response.data);
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Can be a request body validation error or a response validation error
      throw new ApiServiceError('Invalid data.', 400, error.issues);
    } else if (axios.isAxiosError(error)) {
      // Handle network/API errors
      const axiosError = error as AxiosError;
      throw new ApiServiceError(
        (axiosError.response?.data as any)?.message || 'An unexpected error occurred while saving data.',
        axiosError.response?.status || 500,
        axiosError.response?.data
      );
    } else {
      // Handle other unexpected errors
      throw new ApiServiceError('An unexpected error occurred.', 500, error);
    }
  }
};
