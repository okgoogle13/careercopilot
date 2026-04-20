import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const loginMock = jest.fn();
const registerMock = jest.fn();

(jest as any).unstable_mockModule('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
    register: registerMock,
  }),
}));

(jest as any).unstable_mockModule('@/stores/useModeStore', () => ({
  useModeStore: (selector: (state: { mode: string }) => string) => selector({ mode: 'solidarity' }),
}));

const { default: AuthModal } = await import('../AuthModal');

describe('AuthModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits the login form through useAuth login in login mode', async () => {
    render(<AuthModal mode="login" />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('submits the register form through useAuth register in register mode', async () => {
    render(<AuthModal mode="register" />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^continue$/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith('new@example.com', 'password123', '');
    });
  });

  it('uses canonical KR shape tokens and donor auth heading typography', () => {
    render(<AuthModal mode="login" />);

    const shell = screen.getByTestId('authmodal');
    expect(shell.className).toContain('--kr-shape-block-riot03');
    expect(shell.className).not.toContain('--shape-blockRiot03');

    const heading = screen.getByRole('heading', { name: /sign in/i });
    expect(heading).toHaveStyle({
      fontVariationSettings: "'wght' 800, 'wdth' 120",
      fontSize: '28px',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
    });
  });
});
