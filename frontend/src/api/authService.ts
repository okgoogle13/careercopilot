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
  // Replace with your actual endpoint
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

// 2. REGISTER
export const register = async (userData: any): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
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
  return response.data;
};

// Default export for legacy compatibility if needed
const authService = {
  login,
  register,
  logout,
  getCurrentUserProfile
};

export default authService;