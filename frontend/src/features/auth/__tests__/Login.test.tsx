import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock useAuth
const mockLogin = jest.fn();
(jest as any).unstable_mockModule('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
(jest as any).unstable_mockModule('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock LoginCard
(jest as any).unstable_mockModule('@/components/LoginCard', () => ({
  LoginCard: ({ onLogin, onRegisterClick, isLoading }: any) => (
    <div data-testid="login-card">
      <button onClick={() => onLogin({ email: 'test@example.com', password: 'password123' })}>
        Sign In
      </button>
      <button onClick={onRegisterClick}>Register</button>
      {isLoading && <span>Loading...</span>}
    </div>
  ),
}));

const { Login } = await import('../Login');

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<Login />);
    expect(screen.getByTestId('login-card')).toBeInTheDocument();
  });

  it('navigates to register page when register link is clicked', () => {
    render(<Login />);
    fireEvent.click(screen.getByText('Register'));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('calls login and navigates to onboarding on success', async () => {
    mockLogin.mockResolvedValueOnce({});
    render(<Login />);

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
    });
  });

  it('displays error message on login failure', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    render(<Login />);

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText(/Verification Fault: Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
