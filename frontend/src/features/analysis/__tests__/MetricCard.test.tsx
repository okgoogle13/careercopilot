import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../MetricCard';
import { Activity } from 'lucide-react';

// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, transition, ...props }: any) => (
      <div
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

describe('MetricCard', () => {
  const defaultProps = {
    icon: Activity,
    label: 'PERFORMANCE',
    value: '95%',
  };

  it('renders correctly with default props', () => {
    render(<MetricCard {...defaultProps} />);

    expect(screen.getByText('PERFORMANCE')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('applies outlined variant styles by default', () => {
    const { container } = render(<MetricCard {...defaultProps} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-transparent');
    expect(card.className).toContain('border');
  });

  it('applies filled variant styles', () => {
    const { container } = render(
      <MetricCard
        {...defaultProps}
        variant="filled"
      />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-[var(--color-asphalt-black)]');
  });

  it('applies elevation classes when hoverable is true', () => {
    const { container } = render(
      <MetricCard
        {...defaultProps}
        hoverable={true}
      />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('shadow-elevation-1');
    expect(card.className).toContain('hover:shadow-elevation-2');
  });

  it('does not apply elevation classes when hoverable is false', () => {
    const { container } = render(
      <MetricCard
        {...defaultProps}
        hoverable={false}
      />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain('shadow-elevation-1');
  });

  it('renders with custom className', () => {
    const { container } = render(
      <MetricCard
        {...defaultProps}
        className="custom-class"
      />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });
});
