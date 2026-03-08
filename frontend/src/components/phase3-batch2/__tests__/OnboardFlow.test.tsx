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

const { OnboardFlow } = await import('../OnboardFlow');
const { useModeStore } = await import('@/stores/useModeStore');

describe('OnboardFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useModeStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector ? selector({ mode: 'KrDark' }) : { mode: 'KrDark' }
    );
  });

  it('renders correctly with default props', () => {
    render(<OnboardFlow />);

    expect(screen.getByText(/Onboarding Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Next Step/i)).toBeInTheDocument();
    expect(screen.getByText(/Back/i)).toBeInTheDocument();
  });

  it('contains correctly mapped data-slot elements', () => {
    const { container } = render(<OnboardFlow />);

    // Check background slot
    const bgSlot = container.querySelector('[data-slot="step1_background"]');
    expect(bgSlot).toBeInTheDocument();
    expect(bgSlot).toHaveAttribute('data-asset-id', 'KR-SOLID-042');
    expect(bgSlot).toHaveAttribute('data-z-layer', 'Z-0');
  });

  it('triggers onPrimaryAction and onSecondaryAction', () => {
    const onPrimary = jest.fn();
    const onSecondary = jest.fn();

    render(
      <OnboardFlow
        onPrimaryAction={onPrimary}
        onSecondaryAction={onSecondary}
      />
    );

    fireEvent.click(screen.getByText(/Next Step/i));
    expect(onPrimary).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText(/Back/i));
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('applies mode-specific styling tokens', () => {
    (useModeStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector ? selector({ mode: 'KrDark' }) : { mode: 'KrDark' }
    );
    const { unmount } = render(<OnboardFlow />);
    expect(screen.getByRole('main')).toHaveAttribute('data-mode', 'KrDark');
    unmount();

    (useModeStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector ? selector({ mode: 'KrLight' }) : { mode: 'KrLight' }
    );
    render(<OnboardFlow />);
    expect(screen.getByRole('main')).toHaveAttribute('data-mode', 'KrLight');
  });
});
