/**
 * Authentication Context
 * Manages global authentication state and token persistence
 */

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  AuthUser, 
  LoginCredentials, 
  RegisterData, 
  login as authLogin, 
  register as authRegister, 
  logout as authLogout, 
  refreshToken, 
  getCurrentUserProfile,
  getCurrentUser
} from '@/api/authService';
import { ApiResponse } from '../types/api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<{ user: AuthUser; accessToken: string; refreshToken: string }>>;
  register: (data: RegisterData) => Promise<ApiResponse<{ user: AuthUser }>>;
  logout: () => Promise<ApiResponse<null>>;
  refreshAccessToken: () => Promise<ApiResponse<{ accessToken: string; refreshToken: string }>>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<ApiResponse<{ user: AuthUser }>>;
  initializeAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('refresh_token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Save tokens to localStorage when they change
  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    } else {
      localStorage.removeItem('refresh_token');
    }
  }, [refreshToken]);

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        // Verify token is valid by fetching current user profile
        const response = await getCurrentUserProfile();
        setUser(response.data.user);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Token might be expired, try to refresh it
      const storedRefreshToken = localStorage.getItem('refresh_token');
      if (storedRefreshToken) {
        try {
          const { data } = await refreshToken();
          setToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          const response = await getCurrentUserProfile();
          setUser(response.data.user);
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // Clear invalid tokens
          setToken(null);
          setRefreshToken(null);
          setUser(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authLogin(credentials);
      setToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      setUser(response.data.user);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authRegister(data);
      // Optionally log in the user after registration
      if (response.data.user) {
        setUser(response.data.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await authLogout();
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      navigate('/login');
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshResponse = await authRefreshToken();
      setToken(refreshResponse.data.accessToken);
      setRefreshToken(refreshResponse.data.refreshToken);
      return refreshResponse;
    } catch (error) {
      // Refresh failed, logout user
      await logout();
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    try {
      // This would call your profile update endpoint
      // const response = await profileService.updateProfile(updates);
      // setUser({ ...user, ...updates } as AuthUser);
      // return response;
      throw new Error('Update profile not implemented');
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshAccessToken,
        updateProfile,
        initializeAuth,
      }}
    >
      {!isLoading && children}
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

// Helper hook to check if user has required roles
// Example usage: const hasAdminAccess = useHasRole(['admin']);
export const useHasRole = (requiredRoles: string[] = []): boolean => {
  const { user } = useAuth();
  
  if (!user || !requiredRoles.length) return false;
  
  // Assuming user.roles is an array of role strings
  const userRoles = user.roles || [];
  return requiredRoles.some(role => userRoles.includes(role));
};
