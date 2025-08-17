// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

// Helper to get correct API URL for Node/browser
function getApiUrl(path: string) {
  if (typeof process !== 'undefined' && process.release && process.release.name === 'node') {
    return `http://localhost${path}`;
  }
  return path;
}

/**
 * Custom hook for handling authentication state
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Simulate fetching the current user
    const getCurrentUser = async () => {
      try {
        // This would be a real API call in a production app
  const response = await fetch(getApiUrl('/api/auth/me'));
        
        if (!response.ok) {
          throw new Error('Failed to authenticate');
        }
        
        const userData = await response.json();
        
        setAuthState({
          user: userData,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setAuthState({
          user: null,
          isLoading: false,
          error: err instanceof Error ? err : new Error('Authentication error'),
        });
      }
    };

    getCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // This would be a real login API call in a production app
  const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const userData = await response.json();
      
      setAuthState({
        user: userData.user,
        isLoading: false,
        error: null,
      });
      
      return userData.user;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setAuthState(prev => ({ ...prev, isLoading: false, error }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // This would be a real logout API call in a production app
  await fetch(getApiUrl('/api/auth/logout'), { method: 'POST' });
// Helper to get correct API URL for Node/browser
function getApiUrl(path: string) {
  if (typeof process !== 'undefined' && process.release && process.release.name === 'node') {
    return `http://localhost${path}`;
  }
  return path;
}
      
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('Logout failed'),
      }));
    }
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    logout,
  };
}
