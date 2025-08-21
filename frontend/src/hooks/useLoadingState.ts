// Comprehensive loading state management hook
import { useState, useCallback, useRef, useEffect } from 'react';

export interface LoadingConfig {
  minDuration?: number; // Minimum loading duration in ms to prevent flash
  delay?: number; // Delay before showing loading state in ms
}

export interface UseLoadingStateReturn {
  isLoading: boolean;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  setLoading: (loading: boolean, message?: string) => void;
  loadingMessage: string;
  withLoading: <T>(
    operation: () => Promise<T>,
    message?: string
  ) => Promise<T | null>;
}

export const useLoadingState = (
  initialMessage: string = 'Loading...',
  config: LoadingConfig = {}
): UseLoadingStateReturn => {
  const { minDuration = 0, delay = 0 } = config;
  
  const [isLoading, setIsLoadingState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(initialMessage);
  const [shouldShow, setShouldShow] = useState(false);
  
  const startTimeRef = useRef<number | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const minDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
      if (minDurationTimeoutRef.current) {
        clearTimeout(minDurationTimeoutRef.current);
      }
    };
  }, []);

  const startLoading = useCallback((message?: string) => {
    if (message) {
      setLoadingMessage(message);
    }
    
    startTimeRef.current = Date.now();
    setIsLoadingState(true);

    // Clear any existing delay timeout
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
    }

    if (delay > 0) {
      // Show loading state after delay
      delayTimeoutRef.current = setTimeout(() => {
        setShouldShow(true);
      }, delay);
    } else {
      setShouldShow(true);
    }
  }, [delay]);

  const stopLoading = useCallback(() => {
    const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
    const remaining = Math.max(0, minDuration - elapsed);

    // Clear delay timeout if still pending
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }

    if (remaining > 0 && shouldShow) {
      // Wait for minimum duration
      minDurationTimeoutRef.current = setTimeout(() => {
        setIsLoadingState(false);
        setShouldShow(false);
        startTimeRef.current = null;
      }, remaining);
    } else {
      setIsLoadingState(false);
      setShouldShow(false);
      startTimeRef.current = null;
    }
  }, [minDuration, shouldShow]);

  const setLoading = useCallback((loading: boolean, message?: string) => {
    if (loading) {
      startLoading(message);
    } else {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const withLoading = useCallback(async <T>(
    operation: () => Promise<T>,
    message?: string
  ): Promise<T | null> => {
    startLoading(message);
    try {
      const result = await operation();
      return result;
    } catch (error) {
      throw error; // Let caller handle the error
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading: shouldShow,
    startLoading,
    stopLoading,
    setLoading,
    loadingMessage,
    withLoading,
  };
};

// Specialized hooks for common use cases

export const useAsyncOperation = () => {
  const [error, setError] = useState<string | null>(null);
  const loading = useLoadingState();

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    loadingMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    setError(null);
    try {
      return await loading.withLoading(operation, loadingMessage);
    } catch (err) {
      const message = errorMessage || 
        (err instanceof Error ? err.message : 'Operation failed');
      setError(message);
      return null;
    }
  }, [loading]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    ...loading,
    error,
    execute,
    clearError,
  };
};

export const usePageLoading = (initialLoading: boolean = true) => {
  const loading = useLoadingState('Loading page...', { minDuration: 300, delay: 100 });
  
  useEffect(() => {
    if (initialLoading) {
      loading.startLoading();
    }
  }, [initialLoading, loading]);

  return loading;
};