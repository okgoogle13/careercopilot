import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { jest } from '@jest/globals';

// Mock Firebase config
const mockAuth = {
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
};

(jest as any).unstable_mockModule('firebase/auth', () => ({
    onAuthStateChanged: (auth: any, callback: any) => mockAuth.onAuthStateChanged(callback),
    signInWithEmailAndPassword: mockAuth.signInWithEmailAndPassword,
    createUserWithEmailAndPassword: mockAuth.createUserWithEmailAndPassword,
    signOut: mockAuth.signOut,
    getIdToken: jest.fn().mockResolvedValue('test-token'),
    updateProfile: jest.fn(),
}));

(jest as any).unstable_mockModule('@/config/firebase', () => ({
    auth: mockAuth,
    db: {},
    storage: {},
}));

// Dynamic import after mocking
const { AuthProvider, useAuth } = await import('./AuthContext');

// Test Component
const TestComponent = () => {
    const { user, login, logout, register, loading } = useAuth();

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
            <button onClick={() => register('new@example.com', 'password', 'Test User')}>Register</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default behavior: no user
        mockAuth.onAuthStateChanged.mockImplementation((callback: any) => {
            callback(null);
            return jest.fn(); // Unsubscribe mock
        });
    });

    it('shows loading initially', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        // It should eventually show "Not logged in"
        await waitFor(() => {
            expect(screen.getByText('Not logged in')).toBeInTheDocument();
        });
    });

    it('provides user object when logged in via onAuthStateChanged', async () => {
        const mockUser = { uid: '123', email: 'test@example.com', displayName: 'Test User' };
        mockAuth.onAuthStateChanged.mockImplementation((callback: any) => {
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
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => screen.getByText('Login'));
        
        await act(async () => {
            screen.getByText('Login').click();
        });

        expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
            expect.any(Object),
            'test@example.com',
            'password'
        );
    });

    it('calls signOut on logout', async () => {
        const mockUser = { uid: '123', email: 'test@example.com' };
        mockAuth.onAuthStateChanged.mockImplementation((callback: any) => {
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

        expect(mockAuth.signOut).toHaveBeenCalled();
    });
});
