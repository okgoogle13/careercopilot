import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

const { LoginCard } = await import('../LoginCard');

describe('LoginCard', () => {
  const createHandlers = () => ({
    mockOnLogin: jest.fn(),
    mockOnRegister: jest.fn(),
  });

  it('renders login form with email and password fields', () => {
    const { mockOnLogin, mockOnRegister } = createHandlers();

    render(
      <LoginCard
        onLogin={mockOnLogin}
        onRegisterClick={mockOnRegister}
      />
    );
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Password/i)).toBeInTheDocument();
  });

  it('calls onLogin with credentials on submit', async () => {
    const { mockOnLogin, mockOnRegister } = createHandlers();
    render(
      <LoginCard
        onLogin={mockOnLogin}
        onRegisterClick={mockOnRegister}
      />
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /ENTER ARCHIVE/i }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('triggers onRegisterClick when register link is clicked', () => {
    const { mockOnLogin, mockOnRegister } = createHandlers();

    render(
      <LoginCard
        onLogin={mockOnLogin}
        onRegisterClick={mockOnRegister}
      />
    );
    fireEvent.click(screen.getByText(/Create Collective ID/i));
    expect(mockOnRegister).toHaveBeenCalled();
  });

  it('shows the loading state and disables submit while verifying', () => {
    const { mockOnLogin, mockOnRegister } = createHandlers();

    render(
      <LoginCard
        onLogin={mockOnLogin}
        onRegisterClick={mockOnRegister}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /VERIFYING/i })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /ENTER ARCHIVE/i })).not.toBeInTheDocument();
  });
});
