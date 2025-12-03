import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Spinner } from './M3Spinner';

describe('M3Spinner Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders spinner', () => {
      const { container } = render(<M3Spinner />);
      const spinner = container.querySelector('.m3-spinner');
      expect(spinner).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Spinner />);
      const element = container.querySelector('.m3-spinner');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Spinner className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders spinner circle', () => {
      const { container } = render(<M3Spinner />);
      const circle = container.querySelector('.m3-spinner__circle');
      expect(circle).toBeInTheDocument();
    });
  });

  // Size Tests
  describe('Sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`applies ${size} size class`, () => {
        const { container } = render(<M3Spinner size={size} />);
        const spinner = container.querySelector(`.m3-spinner--${size}`);
        expect(spinner).toBeInTheDocument();
      });
    });

    test('defaults to medium size', () => {
      const { container } = render(<M3Spinner />);
      const spinner = container.querySelector('.m3-spinner--medium');
      expect(spinner).toBeInTheDocument();
    });
  });

  // Color Variants Tests
  describe('Color Variants', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`applies ${color} color class`, () => {
        const { container } = render(<M3Spinner color={color} />);
        const spinner = container.querySelector(`.m3-spinner--${color}`);
        expect(spinner).toBeInTheDocument();
      });
    });

    test('defaults to primary color', () => {
      const { container } = render(<M3Spinner />);
      const spinner = container.querySelector('.m3-spinner--primary');
      expect(spinner).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="status" and aria-live', () => {
      const { container } = render(<M3Spinner />);
      const spinner = container.querySelector('[role="status"][aria-live="polite"]');
      expect(spinner).toBeInTheDocument();
    });

    test('has aria-label', () => {
      render(<M3Spinner />);
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toBeInTheDocument();
    });
  });
});
