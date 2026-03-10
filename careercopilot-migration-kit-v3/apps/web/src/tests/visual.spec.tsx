import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

describe('migrated screen visual smoke checks', () => {
  it('renders the expressive login shell', () => {
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('login-screen')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /step back into the worker portal/i }),
    ).toBeInTheDocument();
  });

  it('renders the expressive register shell', () => {
    render(
      <MemoryRouter>
        <RegisterScreen />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('register-screen')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /claim your worker portal/i }),
    ).toBeInTheDocument();
  });

  it('renders the migrated dashboard shell', () => {
    render(
      <MemoryRouter>
        <DashboardScreen />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('dashboard-screen')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /hold the full search in one view/i }),
    ).toBeInTheDocument();
  });
});
