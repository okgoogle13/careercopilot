import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { authService } from '../auth/enhanced-firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  token?: string | null;
  getIdToken?: () => Promise<string>;
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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔧 AuthProvider: Setting up pure fallback auth listener');
    
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      if (authUser) {
        // Get Firebase ID token for API calls
        authUser.getIdToken?.().then((token: string) => {
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            token,
          });
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('🔧 AuthProvider: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const firebaseUser = await authService.signIn(email, password) as FirebaseUser;
      const token = await firebaseUser.getIdToken();
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        token,
        getIdToken: () => firebaseUser.getIdToken(),
      };
      setUser(user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
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
      const firebaseUser = await authService.signUp(email, password) as FirebaseUser;
      const token = await firebaseUser.getIdToken();
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        token,
        getIdToken: () => firebaseUser.getIdToken(),
      };
      setUser(user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
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
      await authService.signOut();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

    const connectionStatus = useMemo(() => {
      const status = authService.getConnectionStatus();
      return {
        ...status,
        mode: import.meta.env.MODE || 'unknown',
      };
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
      setUser,
      setError,
      setLoading,
    }),
    [user, loading, logout, login, register, connectionStatus, error, setUser, setError, setLoading]
  );

  // Show debug info in development
  useEffect(() => {
    if (import.meta.env.VITE_SHOW_DEBUG_INFO === 'true') {
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