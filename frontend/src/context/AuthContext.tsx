/**
 * Authentication Context
 * Manages global authentication state via Supabase or Offline Mock
 */

import { User as SupabaseUser } from '@supabase/supabase-js';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { supabase } from '../config/supabase';

// Define types locally
export interface User extends Partial<SupabaseUser> {
  // Add any custom fields you expect
  role?: string;
  email?: string; // Changed to optional/undefined to match Partial<SupabaseUser>
  // Supabase stores display name in user_metadata
  displayName: string | null;
  uid: string;
  access_token?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: User | null; // Alias for legacy usage
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Safe access for test environment
const getEnv = (): any => {
  try {
    return import.meta.env || {};
  } catch {
    return {};
  }
};

const isOfflineMode = getEnv().VITE_OFFLINE_MODE === 'true';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to map Supabase user to our internal User type
  const mapSupabaseUser = (sbUser: SupabaseUser | null): User | null => {
    if (!sbUser) return null;
    return {
      ...sbUser,
      uid: sbUser.id,
      displayName:
        sbUser.user_metadata?.full_name ||
        sbUser.user_metadata?.displayName ||
        sbUser.email?.split('@')[0] ||
        null,
      email: sbUser.email || undefined,
    };
  };

  // Monitor auth state
  useEffect(() => {
    if (isOfflineMode) {
      // Check local storage for mock session
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
      return;
    }

    // Initial session check
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        }
      } catch (error) {
        console.error('Error checking initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(mapSupabaseUser(session?.user || null));
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (isOfflineMode) {
      if (email && password) {
        // Simple validation
        const mockUser: User = {
          uid: 'mock-user-123',
          email,
          displayName: 'Dev User',
          role: 'user',
        } as unknown as User;
        setUser(mockUser);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        return;
      }
      throw new Error('Invalid credentials');
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    if (isOfflineMode) {
      const mockUser: User = {
        uid: 'mock-user-new-' + Date.now(),
        email,
        displayName: displayName || 'New Dev User',
        role: 'user',
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
          displayName: displayName, // support for legacy field backup
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Force refresh user to get updated display name
      setUser(mapSupabaseUser(data.user));
    }
  }, []);

  const logout = useCallback(async () => {
    if (isOfflineMode) {
      setUser(null);
      localStorage.removeItem('mockUser');
      return;
    }
    await supabase.auth.signOut();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      session: user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
