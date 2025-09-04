import { createContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (userData: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
