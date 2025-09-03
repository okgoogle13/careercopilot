// Central exports for the comprehensive error handling system
export * from '../types/errors';
export { errorHandler } from './errorHandler';
export { errorLogger, ErrorLogger } from './errorLogger';
export { useErrorRecovery, recoveryStrategies } from '../hooks/useErrorRecovery';
export { ErrorProvider, useError, useErrorHandler } from '../contexts/ErrorContext';

// Utility functions for common error scenarios
import { ErrorType, ErrorSeverity } from '../types/errors';
import { errorHandler } from './errorHandler';

export const createError = {
  network: (message: string, context?: any) => 
    errorHandler.createError(ErrorType.NETWORK, message, undefined, context),
  
  validation: (message: string, context?: any) => 
    errorHandler.createError(ErrorType.VALIDATION, message, undefined, context),
  
  authentication: (message: string, context?: any) => 
    errorHandler.createError(ErrorType.AUTHENTICATION, message, undefined, context),
  
  authorization: (message: string, context?: any) => 
    errorHandler.createError(ErrorType.AUTHORIZATION, message, undefined, context),
  
  api: (message: string, statusCode?: number, context?: any) => {
    const errorType = statusCode && statusCode >= 500 
      ? ErrorType.API_SERVER_ERROR 
      : ErrorType.API_CLIENT_ERROR;
    return errorHandler.createError(errorType, message, undefined, {
      ...context,
      statusCode
    });
  },
  
  fileUpload: (message: string, context?: any) => 
    errorHandler.createError(ErrorType.FILE_VALIDATION, message, undefined, context),
  
  ai: (message: string, context?: any) => 
    errorHandler.createError(ErrorType.AI_SERVICE, message, undefined, context)
};

// Higher-order component for error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode,
  onError?: (error: any) => void
) => {
  return React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary 
      fallback={fallback} 
      onError={onError}
      componentName={Component.displayName || Component.name}
    >
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));
};

// API error wrapper
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  context?: any
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
        message = error.statusText || message;
      }
      
      errorHandler.handleError(new Error(message), {
        ...context,
        statusCode: error.status,
        url: error.url
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

import React from 'react';
import ErrorBoundary from '../components/ui/ErrorBoundary';