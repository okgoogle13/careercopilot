import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M3Slider } from './M3Slider';

describe('M3Slider Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders slider', () => {
      const { container } = render(<M3Slider />);
      const slider = container.querySelector('.m3-slider');
      expect(slider).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Slider />);
      const element = container.querySelector('.m3-slider');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Slider className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders with label', () => {
      render(<M3Slider label="Volume" />);
      expect(screen.getByText('Volume')).toBeInTheDocument();
    });
  });

  // Value Tests
  describe('Value', () => {
    test('renders with value', () => {
      render(<M3Slider value={50} />);
      const input = screen.getByLabelText('Slider') as HTMLInputElement;
      expect(input.value).toBe('50');
    });

    test('calls onChange when value changes', () => {
      const handleChange = jest.fn();
      render(<M3Slider onChange={handleChange} />);
      const input = screen.getByLabelText('Slider');
      fireEvent.change(input, { target: { value: '75' } });
      expect(handleChange).toHaveBeenCalledWith(75);
    });

    test('shows value when showValue is true', () => {
      render(<M3Slider value={50} showValue />);
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  // Min/Max/Step Tests
  describe('Min/Max/Step', () => {
    test('applies min, max, and step attributes', () => {
      render(<M3Slider min={10} max={90} step={5} />);
      const input = screen.getByLabelText('Slider');
      expect(input).toHaveAttribute('min', '10');
      expect(input).toHaveAttribute('max', '90');
      expect(input).toHaveAttribute('step', '5');
    });
  });

  // Color Variants Tests
  describe('Color Variants', () => {
    const colors = ['primary', 'secondary', 'tertiary', 'error'] as const;

    colors.forEach((color) => {
      test(`applies ${color} color class`, () => {
        const { container } = render(<M3Slider color={color} />);
        const slider = container.querySelector(`.m3-slider--${color}`);
        expect(slider).toBeInTheDocument();
      });
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('disables input when disabled is true', () => {
      render(<M3Slider disabled />);
      const input = screen.getByLabelText('Slider');
      expect(input).toBeDisabled();
    });
  });
});
