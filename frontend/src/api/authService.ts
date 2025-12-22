import { axiosInstance } from './axiosConfig'; // Assuming you have this, or remove if using fetch

// Standardized Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// 1. LOGIN
export const login = async (credentials: any): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  const data = response.data;
  // Map backend response to frontend shape
  const user: User = {
    id: data.user_id,
    email: data.email,
    name: data.name,
    role: undefined,
  };
  return { user, token: data.access_token };
};

// 2. REGISTER
export const register = async (userData: any): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/register', userData);
  const data = response.data;
  const user: User = {
    id: data.user_id,
    email: data.email,
    name: data.name,
    role: undefined,
  };
  return { user, token: data.access_token };
};

// 3. LOGOUT
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    console.error("Logout failed", error);
  }
};

// 4. GET PROFILE
export const getCurrentUserProfile = async (): Promise<User> => {
  const response = await axiosInstance.get('/auth/me');
  const data = response.data;
  return {
    id: data.user_id,
    email: data.email,
    name: data.name,
    role: undefined,
  };
};

// 5. GET ID TOKEN
export const getIdToken = async (): Promise<string | null> => {
  // Implementation depends on where you store the token
  // For now, assuming localStorage or similar
  return localStorage.getItem('auth_token');
};

// Default export for legacy compatibility if needed
const authService = {
  login,
  register,
  logout,
  getCurrentUserProfile,
  getIdToken
};

export default authService;