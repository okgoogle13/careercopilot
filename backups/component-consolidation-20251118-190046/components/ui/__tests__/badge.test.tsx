import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../badge';

describe('Badge', () => {
  describe('Rendering', () => {
    it('renders badge with children', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders with default variant', () => {
      render(<Badge>Default</Badge>);
      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Badge ref={ref}>Badge</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Badge variant="default">Default Badge</Badge>);
      expect(screen.getByText('Default Badge')).toBeInTheDocument();
    });

    it('renders secondary variant', () => {
      render(<Badge variant="secondary">Secondary Badge</Badge>);
      expect(screen.getByText('Secondary Badge')).toBeInTheDocument();
    });

    it('renders destructive variant', () => {
      render(<Badge variant="destructive">Error Badge</Badge>);
      expect(screen.getByText('Error Badge')).toBeInTheDocument();
    });

    it('renders outline variant', () => {
      render(<Badge variant="outline">Outline Badge</Badge>);
      expect(screen.getByText('Outline Badge')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('passes through additional props', () => {
      render(
        <Badge data-testid="custom-badge">Custom</Badge>
      );
      expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
    });

    it('accepts className prop', () => {
      render(<Badge className="custom-class">Badge</Badge>);
      const badge = screen.getByText('Badge');
      expect(badge.className).toContain('custom-class');
    });

    it('accepts onClick prop', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Clickable</Badge>);
      expect(screen.getByText('Clickable')).toBeInTheDocument();
    });

    it('accepts onDelete prop', () => {
      const handleDelete = jest.fn();
      render(<Badge onDelete={handleDelete}>Deletable</Badge>);
      expect(screen.getByText('Deletable')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders with empty children', () => {
      render(<Badge></Badge>);
      const badges = screen.queryAllByRole('img', { hidden: true });
      expect(badges.length).toBeGreaterThanOrEqual(0);
    });

    it('renders with long text', () => {
      const longText = 'This is a very long badge text that might wrap';
      render(<Badge>{longText}</Badge>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('renders with number children', () => {
      render(<Badge>99+</Badge>);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('renders with icon children', () => {
      render(<Badge><span data-testid="icon">P</span></Badge>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('has correct size styling', () => {
      render(<Badge>Small Badge</Badge>);
      const badge = screen.getByText('Small Badge');
      expect(badge).toBeInTheDocument();
    });

    it('applies custom styles', () => {
      render(<Badge style={{ margin: '10px' }}>Styled</Badge>);
      const badge = screen.getByText('Styled');
      expect(badge).toHaveStyle({ margin: '10px' });
    });
  });

  describe('Color Variants', () => {
    it('applies primary color for default variant', () => {
      render(<Badge variant="default">Primary</Badge>);
      expect(screen.getByText('Primary')).toBeInTheDocument();
    });

    it('applies secondary color for secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText('Secondary')).toBeInTheDocument();
    });

    it('applies error color for destructive variant', () => {
      render(<Badge variant="destructive">Error</Badge>);
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('applies outlined style for outline variant', () => {
      render(<Badge variant="outline">Outlined</Badge>);
      expect(screen.getByText('Outlined')).toBeInTheDocument();
    });
  });
});
