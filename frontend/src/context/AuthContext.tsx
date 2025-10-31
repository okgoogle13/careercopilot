/**
 * Authentication Context
 * Manages global authentication state and token persistence
 */

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

import type { UserProfile, AuthResponse } from '../api/authService';
import { authService } from '../api/authService';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, displayName: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: any) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage and verify token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          // Verify token is valid by fetching current user
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        // Token invalid or expired, clear storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        email,
        password,
        displayName,
      });
      setToken(response.token);
      setUser(response.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await authService.refreshToken();
      setToken(response.token);
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  const updateProfile = async (updates: any): Promise<UserProfile> => {
    try {
      const updated = await authService.updateUserProfile(updates);
      setUser(updated);
      return updated;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        refreshToken,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
