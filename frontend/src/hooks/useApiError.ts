// Custom hook for standardized API error handling
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  extractErrorMessage,
  getErrorMessage,
  reportError,
} from '../utils/errors';

interface ApiErrorOptions {
  showToast?: boolean;
  showInline?: boolean;
  fallbackMessage?: string;
  context?: string;
}

interface UseApiErrorReturn {
  error: string | null;
  isRetrying: boolean;
  handleApiError: (error: unknown, options?: ApiErrorOptions) => void;
  retry: (retryFn: () => Promise<void>) => Promise<void>;
  clearError: () => void;
  setError: (error: string | null) => void;
}

export const useApiError = (): UseApiErrorReturn => {
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleApiError = useCallback(
    (error: unknown, options: ApiErrorOptions = {}) => {
      const {
        showToast = true,
        showInline = false,
        fallbackMessage = 'An unexpected error occurred',
        context,
      } = options;

      // Report error for debugging/monitoring
      reportError(error, context);

      // Get user-friendly error message
      const errorMessage =
        getErrorMessage(error) || extractErrorMessage(error, fallbackMessage);

      // Show toast notification
      if (showToast) {
        toast.error(errorMessage);
      }

      // Set inline error
      if (showInline) {
        setError(errorMessage);
      }
    },
    []
  );

  const retry = useCallback(
    async (retryFn: () => Promise<void>) => {
      setIsRetrying(true);
      setError(null);

      try {
        await retryFn();
        toast.success('Operation completed successfully');
      } catch (error) {
        handleApiError(error, {
          showToast: true,
          showInline: true,
          context: 'Retry operation',
        });
      } finally {
        setIsRetrying(false);
      }
    },
    [handleApiError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isRetrying,
    handleApiError,
    retry,
    clearError,
    setError,
  };
};

// Specialized hooks for common use cases

export const useApiOperation = () => {
  const [loading, setLoading] = useState(false);
  const { error, handleApiError, clearError } = useApiError();

  const execute = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options?: ApiErrorOptions
    ): Promise<T | null> => {
      setLoading(true);
      clearError();

      try {
        const result = await operation();
        return result;
      } catch (error) {
        handleApiError(error, options);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleApiError, clearError]
  );

  return {
    loading,
    error,
    execute,
    clearError,
  };
};
