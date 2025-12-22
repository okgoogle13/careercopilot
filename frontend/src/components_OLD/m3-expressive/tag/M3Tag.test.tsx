import React from 'react';
import { render, screen } from '@testing-library/react';
import { M3Tag } from './M3Tag';

describe('M3Tag Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders tag with label', () => {
      render(<M3Tag label="React" />);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Tag label="Test" />);
      const element = container.querySelector('.m3-tag');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Tag label="Test" className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });
  });

  // Variant Tests
  describe('Variants', () => {
    test('applies filled variant by default', () => {
      const { container } = render(<M3Tag label="Test" />);
      const tag = container.querySelector('.m3-tag--filled');
      expect(tag).toBeInTheDocument();
    });

    test('applies outlined variant', () => {
      const { container } = render(<M3Tag label="Test" variant="outlined" />);
      const tag = container.querySelector('.m3-tag--outlined');
      expect(tag).toBeInTheDocument();
    });
  });

  // Size Tests
  describe('Sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      test(`applies ${size} size class`, () => {
        const { container } = render(<M3Tag label="Test" size={size} />);
        const tag = container.querySelector(`.m3-tag--${size}`);
        expect(tag).toBeInTheDocument();
      });
    });

    test('defaults to medium size', () => {
      const { container } = render(<M3Tag label="Test" />);
      const tag = container.querySelector('.m3-tag--medium');
      expect(tag).toBeInTheDocument();
    });
  });

  // Color Variants Tests
  describe('Color Variants', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error', 'success', 'warning'] as const;

    colors.forEach((color) => {
      test(`applies ${color} color class`, () => {
        const { container } = render(
          <M3Tag label="Test" color={color} />
        );
        const tag = container.querySelector(`.m3-tag--${color}`);
        expect(tag).toBeInTheDocument();
      });
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('applies disabled class when disabled', () => {
      const { container } = render(<M3Tag label="Test" disabled />);
      const tag = container.querySelector('.m3-tag--disabled');
      expect(tag).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="status" and aria-label', () => {
      const { container } = render(<M3Tag label="React" />);
      const tag = container.querySelector('[role="status"][aria-label="React"]');
      expect(tag).toBeInTheDocument();
    });
  });
});
