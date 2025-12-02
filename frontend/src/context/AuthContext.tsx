/**
 * Authentication Context
 * Manages global authentication state and token persistence
 */

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  login as authLogin, 
  register as authRegister, 
  logout as authLogout, 
  getCurrentUserProfile,
  User as AuthUser
} from '@/api/authService';
import { ApiResponse } from '../types/api';

// These types are not defined in the new authService, so we define them here.
type LoginCredentials = any;
type RegisterData = any;

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<{ user: AuthUser; accessToken: string }>>;
  register: (data: RegisterData) => Promise<ApiResponse<{ user: AuthUser }>>;
  logout: () => Promise<ApiResponse<null>>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<ApiResponse<{ user: AuthUser }>>;
  initializeAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));
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

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        // Verify token is valid by fetching current user profile
        const user = await getCurrentUserProfile();
        setUser(user);
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setToken(null);
      setUser(null);
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
      const { user, token } = await authLogin(credentials);
      setToken(token);
      setUser(user);
      return { data: { user, accessToken: token }, status: 200, statusText: "OK", headers: {}, config: {} } as any;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const { user, token } = await authRegister(data);
      // Optionally log in the user after registration
      setToken(token);
      setUser(user);
      return { data: { user }, status: 200, statusText: "OK", headers: {}, config: {} } as any;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authLogout();
      setToken(null);
      setUser(null);
      navigate('/login');
      return { data: null, status: 200, statusText: "OK", headers: {}, config: {} } as any;
    } finally {
      setIsLoading(false);
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
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        updateProfile,
        initializeAuth,
      } as AuthContextType}
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
  const userRoles = user.role ? [user.role] : [];
  return requiredRoles.some(role => userRoles.includes(role));
};
