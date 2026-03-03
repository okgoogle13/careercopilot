import { render, screen, fireEvent } from '@testing-library/react';
import { LoginCard } from '../LoginCard';
import React from 'react';

describe('LoginCard', () => {
  const createHandlers = () => ({
    mockOnLogin: jest.fn(),
    mockOnRegister: jest.fn()
  });

  it('renders login form with email and password fields', () => {
    const { mockOnLogin, mockOnRegister } = createHandlers();

    render(<LoginCard onLogin={mockOnLogin} onRegisterClick={mockOnRegister} />);
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Password/i)).toBeInTheDocument();
  });

  it('calls onLogin with credentials on submit', () => {
    const { mockOnLogin, mockOnRegister } = createHandlers();
    const { container } = render(<LoginCard onLogin={mockOnLogin} onRegisterClick={mockOnRegister} />);
    
    const inputs = container.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'test@example.com' } });
    fireEvent.change(inputs[1], { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /ENTER ARCHIVE/i }));
    
    expect(mockOnLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('triggers onRegisterClick when register link is clicked', () => {
    const { mockOnLogin, mockOnRegister } = createHandlers();

    render(<LoginCard onLogin={mockOnLogin} onRegisterClick={mockOnRegister} />);
    fireEvent.click(screen.getByText(/Create Collective ID/i));
    expect(mockOnRegister).toHaveBeenCalled();
  });

  it('shows the loading state and disables submit while verifying', () => {
    const { mockOnLogin, mockOnRegister } = createHandlers();

    render(<LoginCard onLogin={mockOnLogin} onRegisterClick={mockOnRegister} isLoading={true} />);

    expect(screen.getByRole('button', { name: /VERIFYING/i })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /ENTER ARCHIVE/i })).not.toBeInTheDocument();
  });
});
