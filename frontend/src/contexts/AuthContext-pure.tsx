import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { pureFallbackAuth } from '../auth/pure-fallback';

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  connectionStatus: {
    firebaseAvailable: boolean;
    usingFallback: boolean;
    connectionAttempts: number;
    mode: string;
  };
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(() =>
    pureFallbackAuth.getConnectionStatus()
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔧 AuthProvider: Setting up pure fallback auth listener');

    const unsubscribe = pureFallbackAuth.onAuthStateChanged(authUser => {
      console.log('🔧 AuthProvider: Auth state changed', authUser ? authUser.email : 'signed out');
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      console.log('🔧 AuthProvider: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Listen for changes in connection status to ensure the context value is always fresh.
  // This assumes `pureFallbackAuth` provides a subscription method, which is a robust
  // pattern for external stores.
  useEffect(() => {
    console.log('🔧 AuthProvider: Setting up connection status listener');
    // NOTE: This assumes a listener method `onConnectionStatusChanged` exists on the fallback auth object.
    // If it doesn't, one should be added to make the connection status reactive.
    const unsubscribe = pureFallbackAuth.onConnectionStatusChanged(newStatus => {
      console.log('🔧 AuthProvider: Connection status changed', newStatus);
      setConnectionStatus(newStatus);
    });

    return () => {
      console.log('🔧 AuthProvider: Cleaning up connection status listener');
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔧 AuthProvider: Attempting login for', email);
      const user = await pureFallbackAuth.signIn(email, password);
      console.log('✅ AuthProvider: Login successful');
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('❌ AuthProvider: Login failed', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔧 AuthProvider: Attempting registration for', email);
      const user = await pureFallbackAuth.signUp(email, password);
      console.log('✅ AuthProvider: Registration successful');
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      console.error('❌ AuthProvider: Registration failed', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔧 AuthProvider: Attempting logout');
      await pureFallbackAuth.signOut();
      console.log('✅ AuthProvider: Logout successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      console.error('❌ AuthProvider: Logout failed', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      logout,
      login,
      register,
      connectionStatus,
      error,
    }),
    [user, loading, logout, login, register, connectionStatus, error]
  );

  // Show debug info in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔧 Auth Debug Info:', {
        user: user ? { uid: user.uid, email: user.email } : null,
        loading,
        error,
        connectionStatus,
      });
    }
  }, [user, loading, error, connectionStatus]);

  // Show connection status banner in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('🔧 Development Mode - Pure Fallback Authentication Active');
      console.log('📝 Demo credentials: demo@careercopilot.com / demo123');
    }
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
