/**
 * Standard API response structure for successful responses
 * @template T - Type of the data payload
 */
export interface ApiResponse<T = any> {
  /** The actual data payload */
  data: T;
  
  /** Optional success message */
  message?: string;
  
  /** Indicates if the request was successful */
  success: boolean;
  
  /** ISO timestamp of when the response was generated */
  timestamp: string;
}

/**
 * Standard API error response structure
 */
export interface ApiError {
  /** Machine-readable error code */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Optional additional error details */
  details?: any;
  
  /** Optional validation errors */
  errors?: Record<string, string[]>;
}

/**
 * Type guard to check if an object is an ApiError
 * @param error - The object to check
 */
export function isApiError(error: any): error is ApiError {
  return (
    error && 
    typeof error === 'object' &&
    'code' in error && 
    'message' in error
  );
}

/**
 * Creates a standardized success response
 * @param data - The data to include in the response
 * @param message - Optional success message
 */
export function createSuccessResponse<T>(
  data: T, 
  message?: string
): ApiResponse<T> {
  return {
    data,
    message,
    success: true,
    timestamp: new Date().toISOString()
  };
}

/**
 * Creates a standardized error response
 * @param code - Error code
 * @param message - Error message
 * @param details - Optional additional error details
 */
export function createErrorResponse(
  code: string, 
  message: string, 
  details?: any
): ApiError {
  return {
    code,
    message,
    details,
  };
}

/**
 * Creates a standardized validation error response
 * @param errors - Object containing validation errors
 */
export function createValidationError(
  errors: Record<string, string[]>
): ApiError {
  return {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    errors,
  };
}
