import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../firebase-config';
import { apiGet, apiPost } from './apiClient';
import { ApiResponse } from '@/types/api';

// Types
export interface AuthUser extends Omit<User, 'emailVerified'> {
  roles?: string[];
  // The User interface from Firebase already includes these properties,
  // but we can redeclare them with more specific types if needed
  emailVerified: boolean;
  // Add any additional user properties here
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
    [key: string]: any;
  };
  // Add any custom claims that might be on the user
  customClaims?: {
    [key: string]: any;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  // Add any additional registration fields here
}

// API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  ME: '/auth/me',
};

/**
 * Login with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<{ user: AuthUser; accessToken: string; refreshToken: string }>> => {
  try {
    // Firebase authentication
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    const idToken = await userCredential.user.getIdToken();
    
    // Call your backend API to get the access token
    const response = await apiPost<{ user: AuthUser; accessToken: string; refreshToken: string }>(
      AUTH_ENDPOINTS.LOGIN,
      { idToken }
    );
    
    return response;
  } catch (error) {
    throw error; // Let the error boundary handle it
  }
};

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<ApiResponse<{ user: AuthUser }>> => {
  try {
    // Firebase registration
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    
    // Call your backend API to register the user with additional data
    const response = await apiPost<{ user: AuthUser }>(
      AUTH_ENDPOINTS.REGISTER,
      {
        uid: userCredential.user.uid,
        email: data.email,
        name: data.name,
        // Include any additional registration data
      }
    );
    
    return response;
  } catch (error) {
    throw error; // Let the error boundary handle it
  }
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    // Call your backend API to invalidate the token
    await apiPost(AUTH_ENDPOINTS.LOGOUT);
    
    // Firebase sign out
    await signOut(auth);
    
    return {
      data: null,
      success: true,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    // Even if the API call fails, we should still sign out from Firebase
    await signOut(auth).catch(() => {});
    throw error; // Let the error boundary handle it
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = (): AuthUser | null => {
  return auth.currentUser as AuthUser | null;
};

/**
 * Get the current user's ID token
 */
export const getIdToken = async (forceRefresh = false): Promise<string | null> => {
  try {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken(forceRefresh);
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshToken = async (): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
  try {
    const response = await apiPost<{ accessToken: string; refreshToken: string }>(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      {},
      { withCredentials: true } // Ensure cookies are sent with the request
    );
    
    return response;
  } catch (error) {
    // If refresh token is invalid, log the user out
    if ((error as any)?.code === 'TOKEN_EXPIRED' || (error as any)?.code === 'INVALID_REFRESH_TOKEN') {
      await logout();
    }
    throw error;
  }
};

/**
 * Get the current user's profile from the backend
 */
export const getCurrentUserProfile = async (): Promise<ApiResponse<{ user: AuthUser }>> => {
  return apiGet<{ user: AuthUser }>(AUTH_ENDPOINTS.ME);
};
