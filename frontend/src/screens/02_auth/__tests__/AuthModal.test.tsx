import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockLogin = jest.fn().mockResolvedValue(undefined);
const mockRegister = jest.fn().mockResolvedValue(undefined);
const mockSecondaryAction = jest.fn();

(jest as any).unstable_mockModule('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    logout: jest.fn(),
    loading: false,
    user: null,
    session: null,
  }),
}));

(jest as any).unstable_mockModule('@/stores/useModeStore', () => ({
  useModeStore: (selector: (state: { mode: string }) => unknown) => selector({ mode: 'solidarity' }),
}));

const { AuthModal } = await import('../AuthModal');

describe('AuthModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a login form and submits through useAuth.login', async () => {
    render(
      <AuthModal
        mode="login"
        onSecondaryAction={mockSecondaryAction}
      />
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'worker@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('worker@example.com', 'password123');
    });

    expect(screen.queryByLabelText(/Display Name/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  it('renders a register form and submits through useAuth.register', async () => {
    render(
      <AuthModal
        mode="register"
        onSecondaryAction={mockSecondaryAction}
      />
    );

    fireEvent.change(screen.getByLabelText(/Display Name/i), {
      target: { value: 'Collective User' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'collective@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'collective@example.com',
        'password123',
        'Collective User'
      );
    });

    expect(screen.getByRole('button', { name: 'Back to Sign In' })).toBeInTheDocument();
  });
});
