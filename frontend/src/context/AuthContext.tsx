/**
 * Authentication Context
<<<<<<< HEAD
 * Manages global authentication state via Firebase or Offline Mock
 */

import {
    User as FirebaseUser,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile as firebaseUpdateProfile,
    onAuthStateChanged,
    signInWithEmailAndPassword,
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

// Define types locally since we aren't using the external service
export interface User extends Partial<FirebaseUser> {
  // Add any custom fields you expect on top of Firebase User if needed
  role?: string;
  email: string | null;
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
=======
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

>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
    // CRITICAL FIX: Set a timeout to prevent infinite loading
    // If Firebase doesn't respond in 2 seconds (likely misconfigured), assume no user
    const timeoutId = setTimeout(() => {
      console.warn('Firebase auth initialization timeout - assuming no user');
      setLoading(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(timeoutId); // Clear timeout if auth responds
      setUser(currentUser as User);
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
      setLoading(false);
    });

    return () => {
<<<<<<< HEAD
      clearTimeout(timeoutId);
      unsubscribe();
=======
      subscription.unsubscribe();
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
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
=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
          role: 'user',
        } as unknown as User;
        setUser(mockUser);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        return;
      }
      throw new Error('Invalid credentials');
    }
<<<<<<< HEAD
    await signInWithEmailAndPassword(auth, email, password);
=======

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
>>>>>>> restoration-KR-Rage-Figma-v2.0
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    if (isOfflineMode) {
      const mockUser: User = {
        uid: 'mock-user-new-' + Date.now(),
        email,
        displayName: displayName || 'New Dev User',
<<<<<<< HEAD
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
=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
        role: 'user',
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return;
    }

<<<<<<< HEAD
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await firebaseUpdateProfile(userCredential.user, { displayName });
      // Force refresh user to get updated display name
      setUser({ ...userCredential.user, displayName } as User);
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
    }
  }, []);

  const logout = useCallback(async () => {
    if (isOfflineMode) {
      setUser(null);
      localStorage.removeItem('mockUser');
      return;
    }
<<<<<<< HEAD
    await firebaseSignOut(auth);
=======
    await supabase.auth.signOut();
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
