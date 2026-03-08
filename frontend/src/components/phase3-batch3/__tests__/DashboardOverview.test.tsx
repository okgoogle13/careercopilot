import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// ESM mocking pattern
jest.unstable_mockModule('@/stores/useModeStore', () => ({
  useModeStore: jest.fn((selector: any) =>
    selector ? selector({ mode: 'KrDark' }) : { mode: 'KrDark' }
  ),
  useMode: jest.fn(() => ({
    mode: 'KrDark',
    setMode: jest.fn(),
    toggleMode: jest.fn(),
    isKrDarkMode: true,
    isKrLightMode: false,
  })),
}));

const { DashboardOverview } = await import('../DashboardOverview');
const { useModeStore } = await import('@/stores/useModeStore');

describe('DashboardOverview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useModeStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector ? selector({ mode: 'KrDark' }) : { mode: 'KrDark' }
    );
  });

  it('renders with default labels and title', () => {
    render(<DashboardOverview />);

    expect(screen.getByText(/Dashboard Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Monitor stats, actions, and recent activity/i)).toBeInTheDocument();
    expect(screen.getByText(/New Application/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Settings/i)).toBeInTheDocument();
  });

  it('contains correctly mapped data-slot elements', () => {
    const { container } = render(<DashboardOverview />);

    // Check specific slot defined in component
    const logoSlot = container.querySelector('[data-slot="auto_kr_logo_003"]');
    expect(logoSlot).toBeInTheDocument();
    expect(logoSlot).toHaveAttribute('data-asset-id', 'KR-SOLID-030');
    expect(logoSlot).toHaveAttribute('data-asset-compat', 'KR-SOLID-GENERAL');
  });

  it('triggers primary and secondary actions', () => {
    const onPrimary = jest.fn();
    const onSecondary = jest.fn();

    render(
      <DashboardOverview
        onPrimaryAction={onPrimary}
        onSecondaryAction={onSecondary}
      />
    );

    fireEvent.click(screen.getByText(/New Application/i));
    expect(onPrimary).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText(/Open Settings/i));
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('applies mode-specific styling tokens', () => {
    (useModeStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector ? selector({ mode: 'KrDark' }) : { mode: 'KrDark' }
    );
    const { unmount } = render(<DashboardOverview />);
    expect(screen.getByTestId('dashboardoverview')).toHaveAttribute('data-mode', 'KrDark');
    unmount();

    (useModeStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector ? selector({ mode: 'KrLight' }) : { mode: 'KrLight' }
    );
    render(<DashboardOverview />);
    expect(screen.getByTestId('dashboardoverview')).toHaveAttribute('data-mode', 'KrLight');
  });
});
