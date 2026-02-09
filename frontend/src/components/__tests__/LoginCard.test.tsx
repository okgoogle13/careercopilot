import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginCard } from '../LoginCard';
import React from 'react';

describe('LoginCard', () => {
  const mockOnLogin = vi.fn();
  const mockOnRegister = vi.fn();

  it('renders login form with identifier and keychain fields', () => {
    render(<LoginCard onLogin={mockOnLogin} onRegisterClick={mockOnRegister} />);
    expect(screen.getByLabelText(/Investigator ID/i)).toBeDefined();
    expect(screen.getByLabelText(/Access Keychain/i)).toBeDefined();
  });

  it('calls onLogin with credentials on submit', async () => {
    render(<LoginCard onLogin={mockOnLogin} onRegisterClick={mockOnRegister} />);
    
    // Note: We'd typically use userEvent here, but fireEvent is basic for DOM testing
    fireEvent.change(screen.getByLabelText(/Investigator ID/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Access Keychain/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Authenticate/i }));
    
    expect(mockOnLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('triggers onRegisterClick when register link is clicked', () => {
    render(<LoginCard onLogin={mockOnLogin} onRegisterClick={mockOnRegister} />);
    fireEvent.click(screen.getByText(/New Prospect/i));
    expect(mockOnRegister).toHaveBeenCalled();
  });
});
