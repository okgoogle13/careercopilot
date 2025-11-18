import { render, screen } from '@testing-library/react';
import { CareerCopilotLogo } from '../CareerCopilotLogo';

describe('CareerCopilotLogo', () => {
  describe('Basic Rendering', () => {
    it('renders without errors', () => {
      const { container } = render(<CareerCopilotLogo />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders icon', () => {
      const { container } = render(<CareerCopilotLogo />);
      const icon = container.querySelector('[data-testid="WorkIcon"]');
      expect(icon).toBeInTheDocument();
    });

    it('renders full text by default', () => {
      render(<CareerCopilotLogo />);
      expect(screen.getByText('Career Copilot')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders full variant with text', () => {
      render(<CareerCopilotLogo variant="full" />);
      expect(screen.getByText('Career Copilot')).toBeInTheDocument();
    });

    it('renders compact variant without text', () => {
      render(<CareerCopilotLogo variant="compact" />);
      expect(screen.queryByText('Career Copilot')).not.toBeInTheDocument();
    });
  });

  describe('Size', () => {
    it('renders with default size', () => {
      const { container } = render(<CareerCopilotLogo />);
      const icon = container.querySelector('[data-testid="WorkIcon"]');
      expect(icon).toBeInTheDocument();
    });

    it('renders with custom size', () => {
      const { container } = render(<CareerCopilotLogo size={48} />);
      const icon = container.querySelector('[data-testid="WorkIcon"]');
      expect(icon).toBeInTheDocument();
    });

    it('scales text proportionally to icon size', () => {
      const { container } = render(<CareerCopilotLogo size={64} />);
      const text = screen.getByText('Career Copilot');
      expect(text).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      const { container } = render(<CareerCopilotLogo className="custom-logo" />);
      const logo = container.firstChild as HTMLElement;
      expect(logo).toHaveClass('custom-logo');
    });

    it('applies custom sx styles', () => {
      const customSx = { backgroundColor: 'red' };
      const { container } = render(<CareerCopilotLogo sx={customSx} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper structure for screen readers', () => {
      const { container } = render(<CareerCopilotLogo />);
      const logo = container.firstChild as HTMLElement;
      expect(logo).toBeInTheDocument();
    });

    it('displays text for full variant for accessibility', () => {
      render(<CareerCopilotLogo variant="full" />);
      const text = screen.getByText('Career Copilot');
      expect(text).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('displays icon and text in horizontal layout', () => {
      const { container } = render(<CareerCopilotLogo />);
      const logo = container.firstChild as HTMLElement;
      expect(logo).toBeInTheDocument();
    });

    it('renders compact variant with icon only', () => {
      const { container } = render(<CareerCopilotLogo variant="compact" />);
      const icon = container.querySelector('[data-testid="WorkIcon"]');
      expect(icon).toBeInTheDocument();
      expect(screen.queryByText('Career Copilot')).not.toBeInTheDocument();
    });
  });
});
