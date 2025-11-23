import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { M3Container } from '../M3Container';

describe('M3Container', () => {
  it('renders without errors', () => {
    render(<M3Container>Container Content</M3Container>);
    expect(screen.getByTestId('m3-container')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<M3Container>Test Content</M3Container>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies lg maxWidth by default', () => {
    const { container } = render(<M3Container>Content</M3Container>);
    const containerEl = container.querySelector('.m3-container--lg');
    expect(containerEl).toBeInTheDocument();
  });

  it('applies sm maxWidth when specified', () => {
    const { container } = render(<M3Container maxWidth="sm">Content</M3Container>);
    const containerEl = container.querySelector('.m3-container--sm');
    expect(containerEl).toBeInTheDocument();
  });

  it('applies md maxWidth when specified', () => {
    const { container } = render(<M3Container maxWidth="md">Content</M3Container>);
    const containerEl = container.querySelector('.m3-container--md');
    expect(containerEl).toBeInTheDocument();
  });

  it('applies xl maxWidth when specified', () => {
    const { container } = render(<M3Container maxWidth="xl">Content</M3Container>);
    const containerEl = container.querySelector('.m3-container--xl');
    expect(containerEl).toBeInTheDocument();
  });

  it('applies 2xl maxWidth when specified', () => {
    const { container } = render(<M3Container maxWidth="2xl">Content</M3Container>);
    const containerEl = container.querySelector('.m3-container--2xl');
    expect(containerEl).toBeInTheDocument();
  });

  it('does not apply maxWidth class when maxWidth is false', () => {
    const { container } = render(<M3Container maxWidth={false}>Content</M3Container>);
    const containerEl = container.querySelector('[class*="m3-container--"]');

    // Should only have base m3-container class, not any maxWidth classes
    expect(containerEl).not.toBeInTheDocument();
  });

  it('applies gutters by default', () => {
    const { container } = render(<M3Container>Content</M3Container>);
    const containerEl = container.querySelector('.m3-container--no-gutters');
    expect(containerEl).not.toBeInTheDocument();
  });

  it('removes gutters when disableGutters is true', () => {
    const { container } = render(<M3Container disableGutters>Content</M3Container>);
    const containerEl = container.querySelector('.m3-container--no-gutters');
    expect(containerEl).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<M3Container className="custom-class">Content</M3Container>);
    const containerEl = container.querySelector('.custom-class');
    expect(containerEl).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<M3Container ref={ref}>Content</M3Container>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('applies base m3-container class', () => {
    const { container } = render(<M3Container>Content</M3Container>);
    const containerEl = container.querySelector('.m3-container');
    expect(containerEl).toBeInTheDocument();
  });

  it('combines multiple classes correctly', () => {
    const { container } = render(
      <M3Container maxWidth="md" disableGutters className="custom">
        Content
      </M3Container>
    );

    const containerEl = container.querySelector('.m3-container.m3-container--md.m3-container--no-gutters.custom');
    expect(containerEl).toBeInTheDocument();
  });

  it('accepts standard div props', () => {
    render(
      <M3Container id="test-id" data-custom="value">
        Content
      </M3Container>
    );

    const container = screen.getByTestId('m3-container');
    expect(container).toHaveAttribute('id', 'test-id');
    expect(container).toHaveAttribute('data-custom', 'value');
  });

  it('renders with maxWidth false and no gutters', () => {
    const { container } = render(
      <M3Container maxWidth={false} disableGutters>
        Content
      </M3Container>
    );

    const containerEl = container.querySelector('.m3-container.m3-container--no-gutters');
    expect(containerEl).toBeInTheDocument();

    // Should not have any maxWidth class
    expect(container.querySelector('[class*="--sm"]')).not.toBeInTheDocument();
    expect(container.querySelector('[class*="--md"]')).not.toBeInTheDocument();
    expect(container.querySelector('[class*="--lg"]')).not.toBeInTheDocument();
    expect(container.querySelector('[class*="--xl"]')).not.toBeInTheDocument();
    expect(container.querySelector('[class*="--2xl"]')).not.toBeInTheDocument();
  });

  it('renders nested content correctly', () => {
    render(
      <M3Container>
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
        </div>
      </M3Container>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <M3Container>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </M3Container>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = render(<M3Container />);
    const containerEl = container.querySelector('.m3-container');
    expect(containerEl).toBeInTheDocument();
  });

  it('handles undefined children gracefully', () => {
    const { container } = render(<M3Container>{undefined}</M3Container>);
    const containerEl = container.querySelector('.m3-container');
    expect(containerEl).toBeInTheDocument();
  });

  it('supports onClick handler', () => {
    const mockOnClick = jest.fn();
    render(<M3Container onClick={mockOnClick}>Content</M3Container>);

    const container = screen.getByTestId('m3-container');
    container.click();

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('supports onMouseEnter handler', () => {
    const mockOnMouseEnter = jest.fn();
    render(<M3Container onMouseEnter={mockOnMouseEnter}>Content</M3Container>);

    const container = screen.getByTestId('m3-container');
    container.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    expect(mockOnMouseEnter).toHaveBeenCalledTimes(1);
  });
});

// Integration tests
describe('M3Container Integration', () => {
  it('can be used as a page wrapper', () => {
    render(
      <M3Container maxWidth="xl">
        <header>Header</header>
        <main>Main Content</main>
        <footer>Footer</footer>
      </M3Container>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('can contain multiple M3 components', () => {
    render(
      <M3Container>
        <div className="m3-card">Card</div>
        <div className="m3-button">Button</div>
      </M3Container>
    );

    expect(screen.getByText('Card')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('works with responsive breakpoints', () => {
    const { rerender } = render(<M3Container maxWidth="sm">Small</M3Container>);

    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<M3Container maxWidth="md">Medium</M3Container>);
    expect(screen.getByText('Medium')).toBeInTheDocument();

    rerender(<M3Container maxWidth="lg">Large</M3Container>);
    expect(screen.getByText('Large')).toBeInTheDocument();

    rerender(<M3Container maxWidth="xl">Extra Large</M3Container>);
    expect(screen.getByText('Extra Large')).toBeInTheDocument();

    rerender(<M3Container maxWidth="2xl">2X Large</M3Container>);
    expect(screen.getByText('2X Large')).toBeInTheDocument();
  });
});

// Add React import
import * as React from 'react';
