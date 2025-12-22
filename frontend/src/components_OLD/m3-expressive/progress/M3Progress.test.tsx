import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Progress } from './M3Progress';

describe('M3Progress Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders linear progress', () => {
      const { container } = render(<M3Progress value={50} />);
      const progress = container.querySelector('.m3-progress--linear');
      expect(progress).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Progress value={50} />);
      const element = container.querySelector('.m3-progress');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Progress value={50} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  // Variant Tests
  describe('Variants', () => {
    test('applies linear variant by default', () => {
      const { container } = render(<M3Progress value={50} />);
      const progress = container.querySelector('.m3-progress--linear');
      expect(progress).toBeInTheDocument();
    });

    test('applies circular variant', () => {
      const { container } = render(<M3Progress value={50} variant="circular" />);
      const progress = container.querySelector('.m3-progress--circular');
      expect(progress).toBeInTheDocument();
    });
  });

  // Value Tests
  describe('Value', () => {
    test('sets progress bar width based on value', () => {
      const { container } = render(<M3Progress value={75} />);
      const bar = container.querySelector('.m3-progress__bar');
      expect(bar).toHaveStyle({ width: '75%' });
    });

    test('clamps value to 0-100 range', () => {
      const { container } = render(<M3Progress value={150} />);
      const bar = container.querySelector('.m3-progress__bar');
      expect(bar).toHaveStyle({ width: '100%' });
    });

    test('handles negative values', () => {
      const { container } = render(<M3Progress value={-10} />);
      const bar = container.querySelector('.m3-progress__bar');
      expect(bar).toHaveStyle({ width: '0%' });
    });
  });

  // Indeterminate Tests
  describe('Indeterminate State', () => {
    test('applies indeterminate class', () => {
      const { container } = render(<M3Progress indeterminate />);
      const progress = container.querySelector('.m3-progress--indeterminate');
      expect(progress).toBeInTheDocument();
    });

    test('indeterminate linear progress has animation', () => {
      const { container } = render(<M3Progress indeterminate variant="linear" />);
      const bar = container.querySelector('.m3-progress__bar');
      expect(bar).toHaveStyle({ width: '30%' });
    });
  });

  // Circular Size Tests
  describe('Circular Size', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`applies ${size} size class for circular variant`, () => {
        const { container } = render(
          <M3Progress value={50} variant="circular" size={size} />
        );
        const progress = container.querySelector(`.m3-progress--${size}`);
        expect(progress).toBeInTheDocument();
      });
    });
  });

  // Color Variants Tests
  describe('Color Variants', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`applies ${color} color class`, () => {
        const { container } = render(
          <M3Progress value={50} color={color} />
        );
        const progress = container.querySelector(`.m3-progress--${color}`);
        expect(progress).toBeInTheDocument();
      });
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="progressbar"', () => {
      const { container } = render(<M3Progress value={50} />);
      const progress = container.querySelector('[role="progressbar"]');
      expect(progress).toBeInTheDocument();
    });

    test('has aria-valuenow when value is provided', () => {
      render(<M3Progress value={75} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '75');
    });

    test('does not have aria-valuenow when indeterminate', () => {
      render(<M3Progress indeterminate />);
      const progress = screen.getByRole('progressbar');
      expect(progress).not.toHaveAttribute('aria-valuenow');
    });

    test('has aria-valuemin and aria-valuemax', () => {
      render(<M3Progress value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
    });
  });
});
