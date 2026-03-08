import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Use ESM mocking pattern
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

// Dynamic imports for ESM
const { AnalysisWorkbench } = await import('../AnalysisWorkbench');
const { useModeStore } = await import('@/stores/useModeStore');

describe('AnalysisWorkbench', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useModeStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector ? selector({ mode: 'KrDark' }) : { mode: 'KrDark' }
    );
  });

  it('renders with default labels and title', () => {
    render(<AnalysisWorkbench />);

    expect(screen.getByText(/Resume Analysis Results/i)).toBeInTheDocument();
    expect(screen.getByText(/Review ATS, skills, and formatting diagnostics/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommend Fixes/i)).toBeInTheDocument();
    expect(screen.getByText(/Download Report/i)).toBeInTheDocument();
  });

  it('renders custom labels and title', () => {
    render(
      <AnalysisWorkbench
        title="Custom Analysis"
        subtitle="Custom subtitle"
        primaryLabel="Action 1"
        secondaryLabel="Action 2"
      />
    );

    expect(screen.getByText(/Custom Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Custom subtitle/i)).toBeInTheDocument();
    expect(screen.getByText(/Action 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Action 2/i)).toBeInTheDocument();
  });

  it('contains data-slot elements for the asset placement strategy', () => {
    const { container } = render(<AnalysisWorkbench />);

    const slots = container.querySelectorAll('[data-slot]');
    expect(slots.length).toBeGreaterThan(0);

    // Check specific slot
    const shivaSlot = container.querySelector('[data-slot="auto_kr_solid_024"]');
    expect(shivaSlot).toBeInTheDocument();
    expect(shivaSlot).toHaveAttribute('data-asset-id', 'KR-SOLID-004');
  });

  it('triggers primary and secondary actions', () => {
    const onPrimary = jest.fn();
    const onSecondary = jest.fn();

    render(
      <AnalysisWorkbench
        onPrimaryAction={onPrimary}
        onSecondaryAction={onSecondary}
      />
    );

    fireEvent.click(screen.getByText(/Recommend Fixes/i));
    expect(onPrimary).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText(/Download Report/i));
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('applies the correct data-mode attribute', () => {
    (useModeStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector ? selector({ mode: 'KrLight' }) : { mode: 'KrLight' }
    );
    render(<AnalysisWorkbench />);

    const section = screen.getByTestId('analysisworkbench');
    expect(section).toHaveAttribute('data-mode', 'KrLight');
  });
});
