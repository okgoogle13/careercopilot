import { useState, useCallback, useRef } from 'react';
import { AppError, ErrorRecoveryStrategy, ErrorType } from '../types/errors';
import { errorHandler } from '../utils/errorHandler';

interface RecoveryAttempt {
  errorId: string;
  strategy: string;
  timestamp: Date;
  success: boolean;
}

interface UseErrorRecoveryOptions {
  maxRetryAttempts?: number;
  retryDelay?: number;
  enableAutoRecovery?: boolean;
  customStrategies?: ErrorRecoveryStrategy[];
}

interface UseErrorRecoveryReturn {
  isRecovering: boolean;
  recoveryAttempts: RecoveryAttempt[];
  recoverFromError: (error: AppError, strategyId?: string) => Promise<boolean>;
  registerRecoveryStrategy: (strategy: ErrorRecoveryStrategy) => void;
  getRecoveryOptions: (error: AppError) => ErrorRecoveryStrategy[];
  clearRecoveryHistory: () => void;
}

const defaultRecoveryStrategies: ErrorRecoveryStrategy[] = [
  {
    id: 'network-retry',
    errorTypes: [ErrorType.NETWORK, ErrorType.TIMEOUT],
    priority: 1,
    canRecover: (error) => (error.retryCount ?? 0) < (error.maxRetries ?? 3),
    recover: async (error) => {
      await new Promise(resolve => setTimeout(resolve, 1000 * (error.retryCount ?? 0 + 1)));
      return Math.random() > 0.3; // Simulate 70% success rate
    }
  },
  {
    id: 'auth-refresh',
    errorTypes: [ErrorType.AUTHENTICATION],
    priority: 1,
    canRecover: () => true,
    recover: async (error) => {
      try {
        // Attempt to refresh authentication
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });
        return response.ok;
      } catch {
        return false;
      }
    }
  },
  {
    id: 'storage-cleanup',
    errorTypes: [ErrorType.STORAGE],
    priority: 1,
    canRecover: () => true,
    recover: async () => {
      try {
        // Clear some localStorage items
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('temp_') || key.startsWith('cache_'))) {
            keysToRemove.push(key);
          }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
        return keysToRemove.length > 0;
      } catch {
        return false;
      }
    }
  },
  {
    id: 'component-remount',
    errorTypes: [ErrorType.RENDER],
    priority: 2,
    canRecover: () => true,
    recover: async () => {
      // This would trigger a component remount
      return true;
    },
    fallback: () => {
      window.location.reload();
    }
  },
  {
    id: 'cache-clear',
    errorTypes: [ErrorType.API_CLIENT_ERROR, ErrorType.EXTERNAL_SERVICE],
    priority: 3,
    canRecover: () => true,
    recover: async () => {
      try {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        }
        return true;
      } catch {
        return false;
      }
    }
  }
];

export function useErrorRecovery(options: UseErrorRecoveryOptions = {}): UseErrorRecoveryReturn {
  const {
    maxRetryAttempts = 3,
    retryDelay = 1000,
    enableAutoRecovery = false,
    customStrategies = []
  } = options;

  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState<RecoveryAttempt[]>([]);
  const strategiesRef = useRef<ErrorRecoveryStrategy[]>([
    ...defaultRecoveryStrategies,
    ...customStrategies
  ]);

  const registerRecoveryStrategy = useCallback((strategy: ErrorRecoveryStrategy) => {
    const existingIndex = strategiesRef.current.findIndex(s => s.id === strategy.id);
    if (existingIndex >= 0) {
      strategiesRef.current[existingIndex] = strategy;
    } else {
      strategiesRef.current.push(strategy);
    }

    // Sort by priority
    strategiesRef.current.sort((a, b) => a.priority - b.priority);
  }, []);

  const getRecoveryOptions = useCallback((error: AppError): ErrorRecoveryStrategy[] => {
    return strategiesRef.current
      .filter(strategy =>
        strategy.errorTypes.includes(error.type) &&
        strategy.canRecover(error)
      )
      .sort((a, b) => a.priority - b.priority);
  }, []);

  const recoverFromError = useCallback(async (
    error: AppError,
    strategyId?: string
  ): Promise<boolean> => {
    if (isRecovering) return false;

    setIsRecovering(true);

    try {
      let strategy: ErrorRecoveryStrategy | undefined;

      if (strategyId) {
        strategy = strategiesRef.current.find(s => s.id === strategyId);
      } else {
        const availableStrategies = getRecoveryOptions(error);
        strategy = availableStrategies[0]; // Use highest priority strategy
      }

      if (!strategy) {
        console.warn('No recovery strategy found for error:', error);
        return false;
      }

      console.log(`Attempting recovery with strategy: ${strategy.id}`);

      let success = false;
      let attempt = 0;

      while (attempt < maxRetryAttempts && !success) {
        try {
          if (attempt > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          }

          success = await strategy.recover(error);
          attempt++;

          const recoveryAttempt: RecoveryAttempt = {
            errorId: error.id,
            strategy: strategy.id,
            timestamp: new Date(),
            success
          };

          setRecoveryAttempts(prev => [recoveryAttempt, ...prev.slice(0, 9)]); // Keep last 10 attempts

        } catch (recoveryError) {
          console.error('Recovery strategy failed:', recoveryError);

          const recoveryAttempt: RecoveryAttempt = {
            errorId: error.id,
            strategy: strategy.id,
            timestamp: new Date(),
            success: false
          };

          setRecoveryAttempts(prev => [recoveryAttempt, ...prev.slice(0, 9)]);
          attempt++;
        }
      }

      if (!success && strategy.fallback) {
        console.log('Primary recovery failed, executing fallback');
        strategy.fallback();
      }

      return success;

    } finally {
      setIsRecovering(false);
    }
  }, [isRecovering, getRecoveryOptions, maxRetryAttempts, retryDelay]);

  const clearRecoveryHistory = useCallback(() => {
    setRecoveryAttempts([]);
  }, []);

  // Auto-recovery effect would go here if enableAutoRecovery is true
  // This could listen to error events and automatically attempt recovery

  return {
    isRecovering,
    recoveryAttempts,
    recoverFromError,
    registerRecoveryStrategy,
    getRecoveryOptions,
    clearRecoveryHistory
  };
}

// Pre-built recovery strategies for common scenarios
export const recoveryStrategies = {
  networkRetry: (customDelay?: number): ErrorRecoveryStrategy => ({
    id: 'custom-network-retry',
    errorTypes: [ErrorType.NETWORK, ErrorType.TIMEOUT],
    priority: 1,
    canRecover: (error) => (error.retryCount ?? 0) < 3,
    recover: async (error) => {
      const delay = customDelay ?? (1000 * ((error.retryCount ?? 0) + 1));
      await new Promise(resolve => setTimeout(resolve, delay));

      // Attempt to re-run the original request
      // This would need to be customized based on your specific needs
      return Math.random() > 0.3;
    }
  }),

  forceRefresh: (): ErrorRecoveryStrategy => ({
    id: 'force-refresh',
    errorTypes: Object.values(ErrorType),
    priority: 10, // Low priority - last resort
    canRecover: () => true,
    recover: async () => {
      window.location.reload();
      return true; // Always succeeds since we're reloading
    }
  }),

  redirectToSafePage: (safePath: string = '/'): ErrorRecoveryStrategy => ({
    id: 'redirect-safe-page',
    errorTypes: [ErrorType.RENDER, ErrorType.SYSTEM, ErrorType.MEMORY],
    priority: 5,
    canRecover: () => true,
    recover: async () => {
      window.location.href = safePath;
      return true;
    }
  })
};
