import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  token?: string | null;
}

interface AuthStatusResult {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requireAuth: () => boolean;
  getAuthToken: () => string | null;
}

/**
 * Custom hook that encapsulates common authentication patterns used across page components.
 * Provides centralized authentication state management and common auth-related utilities.
 */
export const useAuthStatus = (): AuthStatusResult => {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Clear errors when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      setError(null);
    } else if (!loading && !isAuthenticated) {
      setError('You must be logged in to view this page.');
    }
  }, [isAuthenticated, loading]);

  /**
   * Check if user is authenticated and set error if not.
   * Returns true if authenticated, false otherwise.
   */
  const requireAuth = useCallback((): boolean => {
    if (!isAuthenticated && !loading) {
      setError('You must be logged in to access this feature.');
      return false;
    }
    return isAuthenticated;
  }, [isAuthenticated, loading]);

  /**
   * Get authentication token for API calls.
   * Returns token string or fallback token if user is authenticated.
   */
  const getAuthToken = useCallback((): string | null => {
    if (!user) {
      return null;
    }
    // Always return the Firebase ID token for API calls
    return user.token || null;
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading: loading,
    error,
    requireAuth,
    getAuthToken,
  };
};