import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../app/routes';
import { RouteGate } from '../router/RouteGate';

describe('RouteGate', () => {
  it('keeps the legacy route active by default', () => {
    render(
      <RouteGate
        flag="login"
        legacy={<div>legacy</div>}
        migrated={<div>migrated</div>}
      />
    );

    expect(screen.getByText('legacy')).toBeTruthy();
  });

  it('switches to the migrated route when the flag is enabled', () => {
    render(
      <RouteGate
        flag="login"
        flags={{ login: true }}
        legacy={<div>legacy</div>}
        migrated={<div>migrated</div>}
      />
    );

    expect(screen.getByText('migrated')).toBeTruthy();
  });

  it('keeps /register on the legacy implementation by default', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText(/register legacy placeholder/i)).toBeInTheDocument();
  });

  it('switches /register to the migrated screen when the flag is enabled', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AppRoutes initialFlags={{ register: true }} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /claim your collective portal/i }),
    ).toBeInTheDocument();
  });

  it('keeps /dashboard on the legacy implementation by default', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText(/dashboard legacy placeholder/i)).toBeInTheDocument();
  });

  it('switches /dashboard to the migrated screen when the flag is enabled', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes initialFlags={{ dashboard: true }} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /hold the movement in one view/i }),
    ).toBeInTheDocument();
  });

  it('keeps /profile on the legacy implementation by default', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText(/profile legacy placeholder/i)).toBeInTheDocument();
  });

  it('switches /profile to the migrated screen when the flag is enabled', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <AppRoutes initialFlags={{ profile: true }} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /shape your movement profile/i }),
    ).toBeInTheDocument();
  });

  it('keeps /onboarding on the legacy implementation by default', () => {
    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText(/onboarding legacy placeholder/i)).toBeInTheDocument();
  });

  it('switches /onboarding to the migrated screen when the flag is enabled', () => {
    render(
      <MemoryRouter initialEntries={['/onboarding']}>
        <AppRoutes initialFlags={{ onboarding: true }} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /choose the route pressure point/i }),
    ).toBeInTheDocument();
  });

  it('keeps /welcome on the legacy implementation by default', () => {
    render(
      <MemoryRouter initialEntries={['/welcome']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText(/welcome legacy placeholder/i)).toBeInTheDocument();
  });

  it('switches /welcome to the migrated screen when the flag is enabled', () => {
    render(
      <MemoryRouter initialEntries={['/welcome']}>
        <AppRoutes initialFlags={{ welcome: true }} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /bring your application into view/i }),
    ).toBeInTheDocument();
  });
});
