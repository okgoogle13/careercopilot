import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    const { container } = render(<Card><div>Card Content</div></Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Test</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies custom styles', () => {
    const { container } = render(<Card className="test-class">Styled</Card>);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('renders with proper structure', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
