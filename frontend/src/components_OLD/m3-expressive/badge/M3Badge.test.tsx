import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Badge } from './M3Badge';

describe('M3Badge Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders badge with children', () => {
      render(<M3Badge>5</M3Badge>);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Badge value={5} />);
      const element = container.querySelector('.m3-badge');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Badge value={5} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders badge with value prop', () => {
      render(<M3Badge value={10} />);
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  // Variant Tests
  describe('Variants', () => {
    test('applies standard variant by default', () => {
      const { container } = render(<M3Badge value={5} />);
      const badge = container.querySelector('.m3-badge--standard');
      expect(badge).toBeInTheDocument();
    });

    test('applies dot variant', () => {
      const { container } = render(<M3Badge variant="dot" />);
      const badge = container.querySelector('.m3-badge--dot');
      expect(badge).toBeInTheDocument();
    });

    test('dot variant does not display value', () => {
      const { container } = render(<M3Badge variant="dot" value={5} />);
      const badge = container.querySelector('.m3-badge--dot');
      expect(badge?.textContent).toBe('');
    });
  });

  // Value Tests
  describe('Value Display', () => {
    test('displays number value', () => {
      render(<M3Badge value={42} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    test('displays string value', () => {
      render(<M3Badge value="New" />);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    test('shows max+ when value exceeds max', () => {
      render(<M3Badge value={150} max={99} />);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    test('shows exact value when within max', () => {
      render(<M3Badge value={50} max={99} />);
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  // Color Variants Tests
  describe('Color Variants', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`applies ${color} color class`, () => {
        const { container } = render(
          <M3Badge value={5} color={color} />
        );
        const badge = container.querySelector(`.m3-badge--${color}`);
        expect(badge).toBeInTheDocument();
      });
    });
  });

  // Anchor Tests
  describe('Anchor Element', () => {
    test('renders badge with anchor element', () => {
      const { container } = render(
        <M3Badge value={5} anchor={<button>Button</button>} />
      );
      expect(container.querySelector('button')).toBeInTheDocument();
      expect(container.querySelector('.m3-badge')).toBeInTheDocument();
    });

    test('applies anchor class to anchor element', () => {
      const { container } = render(
        <M3Badge value={5} anchor={<button>Button</button>} />
      );
      const anchor = container.querySelector('.m3-badge__anchor');
      expect(anchor).toBeInTheDocument();
    });
  });

  // Position Tests
  describe('Position', () => {
    test('applies top-right position by default', () => {
      const { container } = render(
        <M3Badge value={5} anchor={<button>Button</button>} />
      );
      const badge = container.querySelector('.m3-badge--top-right');
      expect(badge).toBeInTheDocument();
    });

    test('applies custom position', () => {
      const { container } = render(
        <M3Badge
          value={5}
          anchor={<button>Button</button>}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        />
      );
      const badge = container.querySelector('.m3-badge--bottom-left');
      expect(badge).toBeInTheDocument();
    });
  });

  // Invisible State Tests
  describe('Invisible State', () => {
    test('hides badge when invisible is true', () => {
      const { container } = render(
        <M3Badge value={5} invisible />
      );
      const badge = container.querySelector('.m3-badge--invisible');
      expect(badge).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="status" and aria-live', () => {
      const { container } = render(<M3Badge value={5} />);
      const badge = container.querySelector('[role="status"][aria-live="polite"]');
      expect(badge).toBeInTheDocument();
    });
  });
});
