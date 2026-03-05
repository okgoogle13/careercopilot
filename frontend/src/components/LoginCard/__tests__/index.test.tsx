import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginCard } from '../index';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    form: ({ children, onSubmit, className, 'aria-label': ariaLabel, role }: any) => (
      <form
        onSubmit={onSubmit}
        className={className}
        aria-label={ariaLabel}
        role={role}
        data-testid="motion-form"
      >
        {children}
      </form>
    ),
    button: ({ children, whileHover, whileTap, className, type, disabled }: any) => (
      <button
        className={className}
        type={type}
        disabled={disabled}
        data-testid="motion-button"
      >
        {children}
      </button>
    ),
  },
}));

describe('LoginCard', () => {
  const onLogin = jest.fn();
  const onRegisterClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <LoginCard
        onLogin={onLogin}
        onRegisterClick={onRegisterClick}
      />
    );

    expect(screen.getByText('VERIFY IDENTITY')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText('ENTER ARCHIVE')).toBeInTheDocument();
    expect(screen.getByText('Create Collective ID')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(
      <LoginCard
        onLogin={onLogin}
        onRegisterClick={onRegisterClick}
      />
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('calls onLogin with credentials on submit', () => {
    render(
      <LoginCard
        onLogin={onLogin}
        onRegisterClick={onRegisterClick}
      />
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByTestId('motion-form'));

    expect(onLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('shows loading state', () => {
    render(
      <LoginCard
        onLogin={onLogin}
        onRegisterClick={onRegisterClick}
        isLoading={true}
      />
    );

    expect(screen.getByText('VERIFYING...')).toBeInTheDocument();
    expect(screen.getByTestId('motion-button')).toBeDisabled();
  });

  it('calls onRegisterClick when register link is clicked', () => {
    render(
      <LoginCard
        onLogin={onLogin}
        onRegisterClick={onRegisterClick}
      />
    );

    fireEvent.click(screen.getByText('Create Collective ID'));
    expect(onRegisterClick).toHaveBeenCalled();
  });
});
