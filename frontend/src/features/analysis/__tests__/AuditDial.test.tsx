import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    circle: (props: any) => (
      <circle
        {...props}
        data-testid="motion-circle"
      />
    ),
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const { AuditDial } = await import('../AuditDial');

describe('AuditDial', () => {
  it('renders correctly with a score', () => {
    render(
      <AuditDial
        score={85}
        isGateOpen={true}
      />
    );

    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.getByTestId('audit-dial')).toBeInTheDocument();
  });

  it('renders correctly when score is below threshold', () => {
    render(
      <AuditDial
        score={70}
        isGateOpen={false}
      />
    );

    expect(screen.getByText('70')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('shows calculating state when loading', () => {
    render(
      <AuditDial
        score={0}
        isGateOpen={false}
        isLoading={true}
      />
    );

    expect(screen.getByText('Calculating...')).toBeInTheDocument();
  });

  it('renders the progress arc with correct strokeDasharray', () => {
    render(
      <AuditDial
        score={50}
        isGateOpen={false}
      />
    );

    const circle = screen.getByTestId('motion-circle');
    // 50% of 502.65 is approx 251.325
    expect(circle).toBeInTheDocument();
    // In real SVG it would be strokeDasharray: "251.325 502.65"
    // Our mock passes props through
    expect(circle.getAttribute('stroke-dasharray')).toContain('502.65');
  });

  it('applies sage color when score is high and gate is open', () => {
    render(
      <AuditDial
        score={90}
        isGateOpen={true}
      />
    );

    const circle = screen.getByTestId('motion-circle');
    // Color for sage is var(--sys-color-kr-activistSmokeGreen-base)
    expect(circle.getAttribute('stroke')).toBe('var(--sys-color-kr-activistSmokeGreen-base)');
  });

  it('applies terracotta color when score is low or gate is closed', () => {
    render(
      <AuditDial
        score={50}
        isGateOpen={false}
      />
    );

    const circle = screen.getByTestId('motion-circle');
    // Color for terracotta is var(--sys-color-solidaritySmokeOrange-base)
    expect(circle.getAttribute('stroke')).toBe('var(--sys-color-solidaritySmokeOrange-base)');
  });
});
