import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/config.js';
import { AuthContext, type User, type AuthContextType } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  // Set up auth state persistence and check initial auth state
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async firebaseUser => {
      try {
        if (firebaseUser) {
          // Get the ID token result to check if it's expired
          const idTokenResult = await firebaseUser.getIdTokenResult();

          // Check if token is expired
          const isExpired = new Date() > new Date(idTokenResult.expirationTime);

          if (isExpired) {
            // Force refresh the token if it's expired
            await firebaseUser.getIdToken(true);
          }

          // Map Firebase user to our User type
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: 'user',
          };

          setUser(user);

          // Store user in session storage for persistence
          sessionStorage.setItem('authUser', JSON.stringify(user));
        } else {
          setUser(null);
          sessionStorage.removeItem('authUser');
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setUser(null);
        sessionStorage.removeItem('authUser');
      } finally {
        setIsLoading(false);
      }
    });

    // Check for existing session on initial load
    const storedUser = sessionStorage.getItem('authUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        sessionStorage.removeItem('authUser');
      }
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement actual email/password login with Firebase
      const mockUser = {
        id: '123',
        email,
        name: email.split('@')[0],
        role: 'user',
      };
      setUser(mockUser);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Set persistence to SESSION for web apps
      await auth.setPersistence('session');

      const provider = new GoogleAuthProvider();
      // Add any additional scopes if needed
      // provider.addScope('profile');
      // provider.addScope('email');

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Get the ID token for session verification
      const idToken = await firebaseUser.getIdToken();

      // Map Firebase user to our User type
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: 'user',
      };

      // Store user in session storage
      sessionStorage.setItem('authUser', JSON.stringify(user));

      // Set the user in state
      setUser(user);

      // Navigate to dashboard
      navigate('/dashboard');

      return user;
    } catch (err) {
      let errorMessage = 'Google sign-in failed';

      if (err instanceof Error) {
        console.error('Google Sign-In Error:', err);

        // Handle specific error cases
        if (err.message.includes('popup_closed_by_user')) {
          errorMessage = 'Sign-in was cancelled';
        } else if (err.message.includes('account-exists-with-different-credential')) {
          errorMessage =
            'An account already exists with the same email but different sign-in credentials';
        } else if (err.message.includes('auth/network-request-failed')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (err.message.includes('auth/popup-blocked')) {
          errorMessage = 'Popup was blocked. Please allow popups for this site.';
        } else {
          errorMessage = `Sign-in error: ${err.message}`;
        }
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Sign out from Firebase
      await auth.signOut();

      // Clear user from state and storage
      setUser(null);
      sessionStorage.removeItem('authUser');

      // Clear any cached data if needed
      // await caches.delete('auth-cache');

      // Redirect to login page
      navigate('/login');
    } catch (err) {
      console.error('Error during logout:', err);
      setError('Error signing out. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const newUser = {
        id: 'new-user-123',
        email: userData.email,
        name: userData.name,
        role: 'user',
      };

      setUser(newUser);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    error,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
