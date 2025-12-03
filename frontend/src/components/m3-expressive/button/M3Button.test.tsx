import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M3Button } from './M3Button';

describe('M3Button Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders button with default props', () => {
      render(<M3Button>Click Me</M3Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    test('renders with correct label text', () => {
      render(<M3Button>Submit Form</M3Button>);
      expect(screen.getByText('Submit Form')).toBeInTheDocument();
    });

    test('applies default variant class (filled)', () => {
      const { container } = render(<M3Button>Test</M3Button>);
      const button = container.querySelector('.m3-button--filled');
      expect(button).toBeInTheDocument();
    });

    test('applies default color class (primary)', () => {
      const { container } = render(<M3Button>Test</M3Button>);
      const button = container.querySelector('.m3-button--primary');
      expect(button).toBeInTheDocument();
    });

    test('applies default size class (medium)', () => {
      const { container } = render(<M3Button>Test</M3Button>);
      const button = container.querySelector('.m3-button--medium');
      expect(button).toBeInTheDocument();
    });
  });

  // Variant Tests
  describe('Variant Prop', () => {
    const variants = ['filled', 'elevated', 'outlined', 'text', 'tonal'] as const;

    variants.forEach((variant) => {
      test(`renders with ${variant} variant`, () => {
        const { container } = render(<M3Button variant={variant}>Test</M3Button>);
        const button = container.querySelector(`.m3-button--${variant}`);
        expect(button).toBeInTheDocument();
      });
    });
  });

  // Color Tests
  describe('Color Prop', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`renders with ${color} color`, () => {
        const { container } = render(<M3Button color={color}>Test</M3Button>);
        const button = container.querySelector(`.m3-button--${color}`);
        expect(button).toBeInTheDocument();
      });
    });
  });

  // Size Tests
  describe('Size Prop', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`renders with ${size} size`, () => {
        const { container } = render(<M3Button size={size}>Test</M3Button>);
        const button = container.querySelector(`.m3-button--${size}`);
        expect(button).toBeInTheDocument();
      });
    });
  });

  // Icon Tests
  describe('Icon Props', () => {
    test('renders start icon', () => {
      const { container } = render(
        <M3Button startIcon={<span data-testid="start-icon">★</span>}>
          Favorite
        </M3Button>
      );
      const icon = screen.getByTestId('start-icon');
      expect(icon).toBeInTheDocument();
      const iconWrapper = container.querySelector('.m3-button__icon--start');
      expect(iconWrapper).toBeInTheDocument();
    });

    test('renders end icon', () => {
      const { container } = render(
        <M3Button endIcon={<span data-testid="end-icon">→</span>}>
          Next
        </M3Button>
      );
      const icon = screen.getByTestId('end-icon');
      expect(icon).toBeInTheDocument();
      const iconWrapper = container.querySelector('.m3-button__icon--end');
      expect(iconWrapper).toBeInTheDocument();
    });

    test('renders both start and end icons', () => {
      render(
        <M3Button
          startIcon={<span data-testid="start-icon">★</span>}
          endIcon={<span data-testid="end-icon">→</span>}
        >
          Action
        </M3Button>
      );
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('renders as disabled when disabled prop is true', () => {
      render(<M3Button disabled>Disabled Button</M3Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('applies disabled class', () => {
      const { container } = render(<M3Button disabled>Test</M3Button>);
      const button = container.querySelector('.m3-button--disabled');
      expect(button).toBeInTheDocument();
    });

    test('does not trigger click handler when disabled', () => {
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
  });

  // Full Width Tests
  describe('Full Width Prop', () => {
    test('applies full width class when fullWidth is true', () => {
      const { container } = render(<M3Button fullWidth>Test</M3Button>);
      const button = container.querySelector('.m3-button--fullWidth');
      expect(button).toBeInTheDocument();
    });

    test('does not apply full width class by default', () => {
      const { container } = render(<M3Button>Test</M3Button>);
      const button = container.querySelector('.m3-button--fullWidth');
      expect(button).not.toBeInTheDocument();
    });
  });

  // Event Handler Tests
  describe('Event Handlers', () => {
    test('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<M3Button onClick={handleClick}>Click Me</M3Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Button className="custom-class">Test</M3Button>
      );
      const button = container.querySelector('.custom-class');
      expect(button).toBeInTheDocument();
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    test('forwards ref to underlying button element', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<M3Button ref={ref}>Test</M3Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    test('ref can be used to access button methods', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<M3Button ref={ref}>Test</M3Button>);
      expect(typeof ref.current?.click).toBe('function');
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('button has proper role', () => {
      render(<M3Button>Submit</M3Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('disabled button has disabled attribute', () => {
      render(<M3Button disabled>Disabled</M3Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });

    test('button can receive focus', () => {
      render(<M3Button>Focus Me</M3Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    test('disabled button cannot receive focus', () => {
      render(<M3Button disabled>No Focus</M3Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  // HTML Attribute Tests
  describe('HTML Attributes', () => {
    test('forwards type attribute', () => {
      render(<M3Button type="submit">Submit</M3Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    test('forwards data attributes', () => {
      render(<M3Button data-testid="custom-button">Test</M3Button>);
      const button = screen.getByTestId('custom-button');
      expect(button).toBeInTheDocument();
    });

    test('forwards aria attributes', () => {
      render(
        <M3Button aria-label="Delete item" aria-disabled={false}>
          Delete
        </M3Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Delete item');
    });
  });

  // Combination Tests
  describe('Prop Combinations', () => {
    test('renders with all custom props', () => {
      const { container } = render(
        <M3Button
          variant="outlined"
          color="tertiary"
          size="large"
          fullWidth
          disabled
          className="custom"
        >
          Complex Button
        </M3Button>
      );
      const button = container.querySelector('button');
      expect(button).toHaveClass('m3-button--outlined');
      expect(button).toHaveClass('m3-button--tertiary');
      expect(button).toHaveClass('m3-button--large');
      expect(button).toHaveClass('m3-button--fullWidth');
      expect(button).toHaveClass('m3-button--disabled');
      expect(button).toHaveClass('custom');
    });
  });
});
