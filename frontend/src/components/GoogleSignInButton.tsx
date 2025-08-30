import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  token: string;
}

interface AuthContextType {
  setUser: (user: UserData) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const GoogleSignInButton: React.FC = () => {
  const { setUser, setError, setLoading } = useAuth() as AuthContextType;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const token = await firebaseUser.getIdToken();
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        token,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      style={{
        background: '#fff',
        color: '#444',
        border: '1px solid #ddd',
        borderRadius: 4,
        padding: '8px 16px',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        style={{ width: 20, height: 20 }}
      />
      Sign in with Google
    </button>
  );
};
