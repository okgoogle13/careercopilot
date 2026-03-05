import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Button, M3IconButton } from '@/components/ui/M3Button';
import { Download, Close } from 'lucide-react';

describe('M3Button', () => {
  describe('Rendering', () => {
    it('renders with children text', () => {
      render(<M3Button>Click Me</M3Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('applies the correct variant class', () => {
      const { container } = render(<M3Button variant="filled">Button</M3Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('renders start icon', () => {
      render(<M3Button startIcon={<Download data-testid="download-icon" />}>Download</M3Button>);
      expect(screen.getByTestId('download-icon')).toBeInTheDocument();
    });

    it('renders end icon', () => {
      render(<M3Button endIcon={<Download data-testid="download-icon" />}>Download</M3Button>);
      expect(screen.getByTestId('download-icon')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders filled variant correctly', () => {
      const { container } = render(<M3Button variant="filled">Filled</M3Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('renders outlined variant correctly', () => {
      const { container } = render(<M3Button variant="outlined">Outlined</M3Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('border-2');
    });

    it('renders text variant correctly', () => {
      const { container } = render(<M3Button variant="text">Text</M3Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('text-primary');
    });
  });

  describe('States', () => {
    it('shows loading spinner when loading', () => {
      render(<M3Button loading>Loading</M3Button>);
      const svg = document.querySelector('svg.animate-spin');
      expect(svg).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
      render(<M3Button disabled>Disabled</M3Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('is disabled when loading', () => {
      render(<M3Button loading>Loading</M3Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<M3Button onClick={handleClick}>Click Me</M3Button>);
      await user.click(screen.getByText('Click Me'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <M3Button
          onClick={handleClick}
          disabled
        >
          Click Me
        </M3Button>
      );
      await user.click(screen.getByText('Click Me'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Link Rendering', () => {
    it('renders as link when href is provided', () => {
      render(<M3Button href="/test">Link Button</M3Button>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('opens in new tab when target="_blank"', () => {
      render(
        <M3Button
          href="/test"
          target="_blank"
        >
          Link
        </M3Button>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Accessibility', () => {
    it('has correct aria-busy when loading', () => {
      render(<M3Button loading>Loading</M3Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('has correct aria-disabled when disabled', () => {
      render(<M3Button disabled>Disabled</M3Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });
});

describe('M3IconButton', () => {
  it('renders with correct aria-label', () => {
    render(
      <M3IconButton
        icon={<Close className="w-5 h-5" />}
        ariaLabel="Close dialog"
      />
    );
    const button = screen.getByRole('button', { name: 'Close dialog' });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <M3IconButton
        icon={<Close className="w-5 h-5" />}
        ariaLabel="Close"
        onClick={handleClick}
      />
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <M3IconButton
        icon={<Close className="w-5 h-5" />}
        ariaLabel="Close"
        disabled
      />
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
