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
      screen.getByRole('heading', { name: /claim your worker portal/i }),
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
      screen.getByRole('heading', { name: /hold the full search in one view/i }),
    ).toBeInTheDocument();
  });
});
