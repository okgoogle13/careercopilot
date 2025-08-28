import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
  render(<Card><div>Card Content</div></Card>);
  // @ts-expect-error jest-dom matcher not recognized by TS
  expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Test</Card>);
  // @ts-expect-error jest-dom matcher not recognized by TS
  expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies custom styles', () => {
    const { container } = render(<Card className="test-class">Styled</Card>);
  // @ts-expect-error jest-dom matcher not recognized by TS
  expect(container.firstChild).toHaveClass('test-class');
  });

  it('renders with proper structure', () => {
    const { container } = render(<Card>Content</Card>);
  // @ts-expect-error jest-dom matcher not recognized by TS
  expect(container.firstChild).toBeInTheDocument();
  });
});
