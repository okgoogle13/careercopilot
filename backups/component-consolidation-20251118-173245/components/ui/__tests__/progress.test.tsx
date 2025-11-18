import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

import { Progress } from '../progress';

describe('Progress', () => {
  it('renders without crashing', () => {
    const { container } = render(<Progress value={50} />);
    expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
  });

  it('displays correct value', () => {
    const { container } = render(<Progress value={75} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
  });

  it('accepts className prop', () => {
    const { container } = render(<Progress value={50} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles 0 value', () => {
    const { container } = render(<Progress value={0} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('handles 100 value', () => {
    const { container } = render(<Progress value={100} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  it('has correct accessibility attributes', () => {
    const { container } = render(<Progress value={50} />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('role', 'progressbar');
  });
});
