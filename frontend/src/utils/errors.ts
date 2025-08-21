// Custom error classes for better error handling and typing

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Error message extraction utility
export const extractErrorMessage = (
  error: unknown,
  fallbackMessage: string = 'An unexpected error occurred'
): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof AuthenticationError) {
    return 'Please log in to continue';
  }

  if (error instanceof NetworkError) {
    return 'Network connection failed. Please check your internet connection and try again.';
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallbackMessage;
};

// User-friendly error messages mapping
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error occurred. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  return extractErrorMessage(error);
};

// Error reporting utility (can be extended with analytics)
export const reportError = (error: unknown, context?: string): void => {
  // In development, log detailed error information
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error${context ? ` in ${context}` : ''}`);
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    console.groupEnd();
  }

  // In production, you might want to send errors to a monitoring service
  // Example: Sentry, LogRocket, DataDog, etc.
  // if (process.env.NODE_ENV === 'production') {
  //   errorReportingService.captureException(error, { context });
  // }
};