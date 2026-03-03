import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut as firebaseSignOut,
  getIdToken
} from 'firebase/auth';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { auth } from '../config/firebase';

// Define types locally
export interface User {
  uid: string;
  email?: string;
  displayName: string | null;
  role?: string;
  access_token?: string | null;
  photoURL?: string | null;
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

  // Helper to map Firebase user to our internal User type
  const mapFirebaseUser = async (fbUser: FirebaseUser | null): Promise<User | null> => {
    if (!fbUser) return null;
    
    const token = await getIdToken(fbUser);
    
    return {
      uid: fbUser.uid,
      email: fbUser.email || undefined,
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || null,
      photoURL: fbUser.photoURL,
      access_token: token,
      role: 'user', // Default role
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

    // Subscribe to changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const mappedUser = await mapFirebaseUser(fbUser);
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
        };
        setUser(mockUser);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        return;
      }
      throw new Error('Invalid credentials');
    }

    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    if (isOfflineMode) {
      const mockUser: User = {
        uid: 'mock-user-new-' + Date.now(),
        email,
        displayName: displayName || 'New Dev User',
        role: 'user',
      };
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      const mappedUser = await mapFirebaseUser(userCredential.user);
      setUser(mappedUser);
    }
  }, []);

  const logout = useCallback(async () => {
    if (isOfflineMode) {
      setUser(null);
      localStorage.removeItem('mockUser');
      return;
    }
    await firebaseSignOut(auth);
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
