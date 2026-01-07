/**
 * Authentication Context
 * Manages global authentication state via Firebase or Offline Mock
 */

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Define types locally since we aren't using the external service
export interface User extends Partial<FirebaseUser> {
  // Add any custom fields you expect on top of Firebase User if needed
  role?: string;
  email: string | null;
  displayName: string | null;
  uid: string;
}

interface AuthContextType {
  user: User | null;
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

    // CRITICAL FIX: Set a timeout to prevent infinite loading
    // If Firebase doesn't respond in 2 seconds (likely misconfigured), assume no user
    const timeoutId = setTimeout(() => {
      console.warn('Firebase auth initialization timeout - assuming no user');
      setLoading(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(timeoutId); // Clear timeout if auth responds
      setUser(currentUser as User);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
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
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: 'mock-token',
          tenantId: null,
          delete: async () => { },
          getIdToken: async () => 'mock-jwt',
          getIdTokenResult: async () => ({
            token: 'mock-jwt',
            signInProvider: 'password',
            claims: {},
            authTime: Date.now() / 1000,
            issuedAtTime: Date.now() / 1000,
            expirationTime: Date.now() / 1000 + 3600,
          }),
          reload: async () => { },
          toJSON: () => ({}),
          role: 'user',
        } as unknown as User;
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
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: 'mock-token',
        tenantId: null,
        delete: async () => { },
        getIdToken: async () => 'mock-jwt',
        getIdTokenResult: async () => ({
          token: 'mock-jwt',
          signInProvider: 'password',
          claims: {},
          authTime: Date.now() / 1000,
          issuedAtTime: Date.now() / 1000,
          expirationTime: Date.now() / 1000 + 3600,
        }),
        reload: async () => { },
        toJSON: () => ({}),
        role: 'user',
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await firebaseUpdateProfile(userCredential.user, { displayName });
      // Force refresh user to get updated display name
      setUser({ ...userCredential.user, displayName } as User);
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
