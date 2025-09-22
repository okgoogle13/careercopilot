import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { M3Button } from './m3-button';
import { Loader2 } from 'lucide-react';

describe('M3Button', () => {
  // Basic rendering tests
  it('renders correctly with default props', () => {
    render(<M3Button>Click me</M3Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('renders with custom text', () => {
    render(<M3Button>Custom Button Text</M3Button>);
    expect(screen.getByText('Custom Button Text')).toBeInTheDocument();
  });

  // Variant tests
  it('applies filled variant styles by default', () => {
    render(<M3Button>Filled Button</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--md-sys-color-primary)]');
  });

  it('applies outlined variant styles', () => {
    render(<M3Button variant="outlined">Outlined Button</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent', 'border');
  });

  it('applies text variant styles', () => {
    render(<M3Button variant="text">Text Button</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('applies destructive variant styles', () => {
    render(<M3Button variant="destructive">Delete</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--md-sys-color-error)]');
  });

  // Size tests
  it('applies medium size by default', () => {
    render(<M3Button>Medium Button</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-12', 'px-6');
  });

  it('applies small size styles', () => {
    render(<M3Button size="small">Small Button</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'px-6');
  });

  it('applies large size styles', () => {
    render(<M3Button size="large">Large Button</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-14', 'px-8');
  });

  it('applies icon size styles', () => {
    render(<M3Button size="icon">🔍</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'w-10', 'p-0');
  });

  // Icon tests
  it('renders with leading icon', () => {
    render(
      <M3Button icon={<span data-testid="leading-icon">🔍</span>}>
        Search
      </M3Button>
    );
    expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('renders with trailing icon', () => {
    render(
      <M3Button trailingIcon={<span data-testid="trailing-icon">→</span>}>
        Next
      </M3Button>
    );
    expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders icon-only button correctly', () => {
    render(<M3Button size="icon">🔍</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'w-10', 'p-0');
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  // Loading state tests
  it('shows loading state correctly', () => {
    render(<M3Button isLoading>Loading Button</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-wait');
    // Check for loading spinner (we can't easily test the Loader2 component here)
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows loading text when provided', () => {
    render(
      <M3Button isLoading loadingText="Processing...">
        Submit
      </M3Button>
    );
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('disables button when loading', () => {
    render(<M3Button isLoading>Loading</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  // Disabled state tests
  it('applies disabled styles when disabled', () => {
    render(<M3Button disabled>Disabled Button</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-60', 'cursor-not-allowed');
  });

  // Event handling tests
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<M3Button onClick={handleClick}>Click me</M3Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click when disabled', () => {
    const handleClick = jest.fn();
    render(
      <M3Button disabled onClick={handleClick}>
        Disabled
      </M3Button>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not trigger click when loading', () => {
    const handleClick = jest.fn();
    render(
      <M3Button isLoading onClick={handleClick}>
        Loading
      </M3Button>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  // Accessibility tests
  it('supports custom aria-label', () => {
    render(<M3Button aria-label="Custom aria label">Button</M3Button>);
    expect(screen.getByLabelText('Custom aria label')).toBeInTheDocument();
  });

  it('supports custom className', () => {
    render(<M3Button className="custom-class">Button</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<M3Button ref={ref}>Button</M3Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // Focus and keyboard navigation
  it('is focusable when not disabled', () => {
    render(<M3Button>Focusable</M3Button>);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });

  it('applies focus ring styles', () => {
    render(<M3Button>Focus me</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  // Legacy variant mapping tests
  it('maps legacy "default" variant to "filled"', () => {
    render(<M3Button variant="default">Legacy Default</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--md-sys-color-primary)]');
  });

  it('maps legacy "ghost" variant to "text"', () => {
    render(<M3Button variant="ghost">Legacy Ghost</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('maps legacy "secondary" variant to "tonal"', () => {
    render(<M3Button variant="secondary">Legacy Secondary</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--md-sys-color-secondary-container)]');
  });

  // Legacy size mapping tests
  it('maps legacy "sm" size to "small"', () => {
    render(<M3Button size="sm">Legacy Small</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');
  });

  it('maps legacy "lg" size to "large"', () => {
    render(<M3Button size="lg">Legacy Large</M3Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-14');
  });
});