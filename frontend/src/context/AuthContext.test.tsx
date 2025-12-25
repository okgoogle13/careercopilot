import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { jest } from '@jest/globals';

// Define mocks before importing modules
// Use unstable_mockModule for ESM support
(jest as any).unstable_mockModule('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((_auth: any, _callback: any) => {
    // Default stub
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  GithubAuthProvider: jest.fn(),
}));

(jest as any).unstable_mockModule('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

(jest as any).unstable_mockModule('@/config/firebase', () => ({
  auth: {
    currentUser: null,
  },
  storage: {},
}));

// Dynamic import of modules under test
const { AuthProvider, useAuth } = await import('./AuthContext');
const { onAuthStateChanged, signInWithEmailAndPassword, signOut } = await import('firebase/auth');

// Mock child component to test context values
const TestComponent = () => {
  const { user, login, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user)
    return (
      <div>
        <span>Logged in as {user.email}</span>
        <button onClick={() => logout()}>Logout</button>
      </div>
    );
  return (
    <div>
      <span>Not logged in</span>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading initially', () => {
    // Mock onAuthStateChanged to delay callback
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, _callback) => {
      // Do not invoke callback immediately
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders children when loading is complete', async () => {
    // Mock onAuthStateChanged to immediately return null user (not logged in)
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback: any) => {
      callback(null);
      return jest.fn(); // Unsubscribe function
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });
  });

  it('provides user object when logged in', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback: any) => {
      callback(mockUser);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Logged in as test@example.com')).toBeInTheDocument();
    });
  });

  it('calls signInWithEmailAndPassword on login', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback: any) => {
      callback(null);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => screen.getByText('Login'));

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password'
    );
  });

  it('calls signOut on logout', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback: any) => {
      callback(mockUser);
      return jest.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => screen.getByText('Logout'));

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(signOut).toHaveBeenCalled();
  });
});
