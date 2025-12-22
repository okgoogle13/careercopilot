import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Loader } from './M3Loader';

describe('M3Loader Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders loader', () => {
      const { container } = render(<M3Loader value={50} />);
      const loader = container.querySelector('.m3-loader');
      expect(loader).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Loader value={50} />);
      const element = container.querySelector('.m3-loader');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Loader value={50} className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('shows percentage by default', () => {
      render(<M3Loader value={75} />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    test('hides percentage when showPercentage is false', () => {
      render(<M3Loader value={75} showPercentage={false} />);
      expect(screen.queryByText('75%')).not.toBeInTheDocument();
    });
  });

  // Size Tests
  describe('Sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`applies ${size} size class`, () => {
        const { container } = render(
          <M3Loader value={50} size={size} />
        );
        const loader = container.querySelector(`.m3-loader--${size}`);
        expect(loader).toBeInTheDocument();
      });
    });
  });

  // Color Variants Tests
  describe('Color Variants', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`applies ${color} color class`, () => {
        const { container } = render(
          <M3Loader value={50} color={color} />
        );
        const loader = container.querySelector(`.m3-loader--${color}`);
        expect(loader).toBeInTheDocument();
      });
    });
  });

  // Indeterminate Tests
  describe('Indeterminate State', () => {
    test('applies indeterminate class', () => {
      const { container } = render(<M3Loader indeterminate />);
      const loader = container.querySelector('.m3-loader--indeterminate');
      expect(loader).toBeInTheDocument();
    });

    test('does not show percentage when indeterminate', () => {
      render(<M3Loader indeterminate />);
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });
  });

  // Value Tests
  describe('Value', () => {
    test('clamps value to 0-100 range', () => {
      render(<M3Loader value={150} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    test('handles negative values', () => {
      render(<M3Loader value={-10} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="progressbar"', () => {
      const { container } = render(<M3Loader value={50} />);
      const loader = container.querySelector('[role="progressbar"]');
      expect(loader).toBeInTheDocument();
    });

    test('has aria-valuenow when value is provided', () => {
      render(<M3Loader value={75} />);
      const loader = screen.getByRole('progressbar');
      expect(loader).toHaveAttribute('aria-valuenow', '75');
    });

    test('does not have aria-valuenow when indeterminate', () => {
      render(<M3Loader indeterminate />);
      const loader = screen.getByRole('progressbar');
      expect(loader).not.toHaveAttribute('aria-valuenow');
    });
  });
});
