import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card', () => {
  it('renders children', () => {
    const { container } = render(<Card><div>Card Content</div></Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Test</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with different paddings', () => {
    const { container } = render(<Card padding="lg">Padded</Card>);
    expect(container.firstChild).toHaveClass('p-8');
  });

  it('renders as article', () => {
    const { container } = render(<Card as="article">Article Card</Card>);
    expect((container.firstChild as HTMLElement)?.tagName).toBe('ARTICLE');
  });
});
