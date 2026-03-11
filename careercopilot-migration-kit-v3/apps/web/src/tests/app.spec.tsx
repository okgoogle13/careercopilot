import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { App } from '../app/App';

describe('App runtime feature flags', () => {
  beforeEach(() => {
    cleanup();
    window.history.replaceState({}, '', '/login');
  });

  it('keeps /profile on the legacy route without a runtime override', () => {
    window.history.replaceState({}, '', '/profile');

    render(<App />);

    expect(screen.getByText(/profile legacy placeholder/i)).toBeInTheDocument();
  });

  it('enables the migrated /profile route from the query string override', () => {
    window.history.replaceState({}, '', '/profile?screenFlag.profile=1');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: /shape your movement profile/i }),
    ).toBeInTheDocument();
  });

  it('lets the runtime override win over initial flags', () => {
    window.history.replaceState({}, '', '/profile?ff=profile');

    render(<App initialFlags={{ profile: false }} />);

    expect(
      screen.getByRole('heading', { name: /shape your movement profile/i }),
    ).toBeInTheDocument();
  });

  it('enables the migrated /onboarding route from the query string override', () => {
    window.history.replaceState({}, '', '/onboarding?ff=onboarding');

    render(<App initialFlags={{ onboarding: false }} />);

    expect(
      screen.getByRole('heading', { name: /choose the route pressure point/i }),
    ).toBeInTheDocument();
  });

  it('enables the migrated /welcome route from the query string override', () => {
    window.history.replaceState({}, '', '/welcome?screenFlag.welcome=1');

    render(<App initialFlags={{ welcome: false }} />);

    expect(
      screen.getByRole('heading', { name: /bring your application into view/i }),
    ).toBeInTheDocument();
  });
});
