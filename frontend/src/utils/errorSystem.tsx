// Central exports for the comprehensive error handling system
import React from 'react';
import { ErrorType } from '../types/errors';
import { errorHandler } from './errorHandler';
import ErrorBoundary from '../components/ui/ErrorBoundary';

export * from '../types/errors';
export { errorHandler } from './errorHandler';
export { errorLogger, ErrorLogger } from './errorLogger';
export { useErrorRecovery, recoveryStrategies } from '../hooks/useErrorRecovery';
export { ErrorProvider, useError, useErrorHandler } from '../contexts/ErrorContext';

// Utility functions for common error scenarios

export const createError = {
  network: (message: string, context?: Record<string, unknown>) =>
    errorHandler.createError(ErrorType.NETWORK, message, undefined, context),

  validation: (message: string, context?: Record<string, unknown>) =>
    errorHandler.createError(ErrorType.VALIDATION, message, undefined, context),

  authentication: (message: string, context?: Record<string, unknown>) =>
    errorHandler.createError(ErrorType.AUTHENTICATION, message, undefined, context),

  authorization: (message: string, context?: Record<string, unknown>) =>
    errorHandler.createError(ErrorType.AUTHORIZATION, message, undefined, context),

  api: (message: string, statusCode?: number, context?: Record<string, unknown>) => {
    const errorType = statusCode && statusCode >= 500
      ? ErrorType.API_SERVER_ERROR
      : ErrorType.API_CLIENT_ERROR;
    return errorHandler.createError(errorType, message, undefined, {
      ...context,
      statusCode
    });
  },

  fileUpload: (message: string, context?: Record<string, unknown>) =>
    errorHandler.createError(ErrorType.FILE_VALIDATION, message, undefined, context),

  ai: (message: string, context?: Record<string, unknown>) =>
    errorHandler.createError(ErrorType.AI_SERVICE, message, undefined, context)
};

// Higher-order component for error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode,
  onError?: (error: unknown) => void
) => {
  const WrappedComponent = React.forwardRef<unknown, P>((props, ref) => (
    <ErrorBoundary
      fallback={fallback}
      onError={onError}
      componentName={Component.displayName || Component.name}
    >
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// API error wrapper
export const withErrorHandling = async <T,>(
  apiCall: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof Response) {
      const errorType = error.status >= 500
        ? ErrorType.API_SERVER_ERROR
        : ErrorType.API_CLIENT_ERROR;

      let message = 'An API error occurred';
      try {
        const errorBody = await error.json();
        message = errorBody.message || errorBody.error || message;
      } catch {
        // If we can't parse the error body, use status text
        message = error.statusText || message;
      }

      errorHandler.handleError(new Error(message), {
        ...context,
        statusCode: error.status,
        url: error.url,
        errorType
      });
    } else {
      errorHandler.handleError(error as Error, context);
    }
    return null;
  }
};

// Form validation error handler
export const handleValidationErrors = (errors: Record<string, string[]>) => {
  Object.entries(errors).forEach(([field, fieldErrors]) => {
    fieldErrors.forEach(errorMessage => {
      errorHandler.createError(
        ErrorType.FORM_VALIDATION,
        errorMessage,
        undefined,
        { field }
      );
    });
  });
};
