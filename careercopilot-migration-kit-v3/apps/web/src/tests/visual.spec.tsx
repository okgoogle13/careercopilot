import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';

describe('migrated screen visual smoke checks', () => {
  it('renders the expressive login shell', () => {
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('login-screen')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /return to the collective portal/i }),
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
      screen.getByRole('heading', { name: /claim your collective portal/i }),
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
      screen.getByRole('heading', { name: /hold the movement in one view/i }),
    ).toBeInTheDocument();
  });

  it('renders the migrated profile shell', () => {
    render(
      <MemoryRouter>
        <ProfileScreen />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('profile-screen')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /shape your movement profile/i }),
    ).toBeInTheDocument();
  });

  it('renders the migrated onboarding shell', () => {
    render(
      <MemoryRouter>
        <OnboardingScreen />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('onboarding-screen')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /choose the route pressure point/i }),
    ).toBeInTheDocument();
  });

  it('renders the migrated welcome shell', () => {
    render(
      <MemoryRouter>
        <WelcomeScreen />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('welcome-screen')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /bring your application into view/i }),
    ).toBeInTheDocument();
  });
});
