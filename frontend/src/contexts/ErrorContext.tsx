import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { AppError, ErrorType } from '../types/errors';
import { errorHandler } from '../utils/errorHandler';

interface ErrorState {
  errors: AppError[];
  maxErrors: number;
  autoHideDelay: number;
  enableNotifications: boolean;
}

type ErrorAction =
  | { type: 'ADD_ERROR'; payload: AppError }
  | { type: 'REMOVE_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'UPDATE_ERROR'; payload: { id: string; updates: Partial<AppError> } }
  | { type: 'SET_CONFIG'; payload: Partial<Pick<ErrorState, 'maxErrors' | 'autoHideDelay' | 'enableNotifications'>> };

interface ErrorContextType extends ErrorState {
  addError: (error: Error | AppError, context?: any) => AppError;
  removeError: (id: string) => void;
  clearErrors: () => void;
  retryError: (id: string) => Promise<boolean>;
  updateConfig: (config: Partial<Pick<ErrorState, 'maxErrors' | 'autoHideDelay' | 'enableNotifications'>>) => void;
}

const initialState: ErrorState = {
  errors: [],
  maxErrors: 5,
  autoHideDelay: 5000, // 5 seconds
  enableNotifications: true,
};

function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
  switch (action.type) {
    case 'ADD_ERROR':
      const newErrors = [action.payload, ...state.errors.slice(0, state.maxErrors - 1)];
      return { ...state, errors: newErrors };

    case 'REMOVE_ERROR':
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      };

    case 'CLEAR_ERRORS':
      return { ...state, errors: [] };

    case 'UPDATE_ERROR':
      return {
        ...state,
        errors: state.errors.map(error =>
          error.id === action.payload.id
            ? { ...error, ...action.payload.updates }
            : error
        )
      };

    case 'SET_CONFIG':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

const ErrorContext = createContext<ErrorContextType | null>(null);

interface ErrorProviderProps {
  children: React.ReactNode;
  maxErrors?: number;
  autoHideDelay?: number;
  enableNotifications?: boolean;
}

export function ErrorProvider({
  children,
  maxErrors = 5,
  autoHideDelay = 5000,
  enableNotifications = true
}: ErrorProviderProps) {
  const [state, dispatch] = useReducer(errorReducer, {
    ...initialState,
    maxErrors,
    autoHideDelay,
    enableNotifications
  });

  const addError = useCallback((error: Error | AppError, context?: any): AppError => {
    let appError: AppError;

    if ('type' in error && 'severity' in error) {
      appError = error;
    } else {
      appError = errorHandler.handleError(error, context);
    }

    dispatch({ type: 'ADD_ERROR', payload: appError });

    // Auto-hide non-critical errors
    if (appError.severity !== 'CRITICAL' && state.autoHideDelay > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_ERROR', payload: appError.id });
      }, state.autoHideDelay);
    }

    // Browser notification for critical errors
    if (state.enableNotifications && appError.severity === 'CRITICAL' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Critical Error - CareerCopilot', {
          body: appError.userMessage,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Critical Error - CareerCopilot', {
              body: appError.userMessage,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }

    return appError;
  }, [state.autoHideDelay, state.enableNotifications]);

  const removeError = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ERROR', payload: id });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const retryError = useCallback(async (id: string): Promise<boolean> => {
    const error = state.errors.find(e => e.id === id);
    if (!error) return false;

    const success = await errorHandler.retry(error);
    if (success) {
      removeError(id);
    } else {
      dispatch({
        type: 'UPDATE_ERROR',
        payload: {
          id,
          updates: { retryCount: error.retryCount }
        }
      });
    }

    return success;
  }, [state.errors, removeError]);

  const updateConfig = useCallback((config: Partial<Pick<ErrorState, 'maxErrors' | 'autoHideDelay' | 'enableNotifications'>>) => {
    dispatch({ type: 'SET_CONFIG', payload: config });
  }, []);

  // Set up global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      addError(new Error(event.message), {
        component: 'Global',
        additionalData: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        {
          component: 'Global',
          additionalData: {
            type: 'unhandledrejection'
          }
        }
      );
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [addError]);

  const value: ErrorContextType = {
    ...state,
    addError,
    removeError,
    clearErrors,
    retryError,
    updateConfig
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError(): ErrorContextType {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}

// Convenience hook for handling specific errors
export function useErrorHandler() {
  const { addError } = useError();

  const handleAsync = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      addError(error as Error, context);
      return null;
    }
  }, [addError]);

  const wrapFunction = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    context?: any
  ): T => {
    return ((...args: any[]) => {
      try {
        const result = fn(...args);
        if (result instanceof Promise) {
          return result.catch((error: Error) => {
            addError(error, context);
            throw error;
          });
        }
        return result;
      } catch (error) {
        addError(error as Error, context);
        throw error;
      }
    }) as T;
  }, [addError]);

  return { handleAsync, wrapFunction, addError };
}
