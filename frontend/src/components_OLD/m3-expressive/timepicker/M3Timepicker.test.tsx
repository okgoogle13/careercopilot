import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M3Timepicker } from './M3Timepicker';

describe('M3Timepicker Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders timepicker with input', () => {
      render(<M3Timepicker />);
      const input = screen.getByLabelText('Time');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'time');
    });

    test('applies base class', () => {
      const { container } = render(<M3Timepicker />);
      const element = container.querySelector('.m3-timepicker');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Timepicker className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders with custom label', () => {
      render(<M3Timepicker label="Select Time" />);
      expect(screen.getByLabelText('Select Time')).toBeInTheDocument();
    });
  });

  // Value Tests
  describe('Value', () => {
    test('renders with value', () => {
      render(<M3Timepicker value="14:30" />);
      const input = screen.getByLabelText('Time') as HTMLInputElement;
      expect(input.value).toBe('14:30');
    });

    test('renders with defaultValue', () => {
      render(<M3Timepicker defaultValue="09:00" />);
      const input = screen.getByLabelText('Time') as HTMLInputElement;
      expect(input.value).toBe('09:00');
    });

    test('calls onChange when value changes', () => {
      const handleChange = jest.fn();
      render(<M3Timepicker onChange={handleChange} />);
      const input = screen.getByLabelText('Time');
      fireEvent.change(input, { target: { value: '15:45' } });
      expect(handleChange).toHaveBeenCalledWith('15:45');
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('disables input when disabled is true', () => {
      render(<M3Timepicker disabled />);
      const input = screen.getByLabelText('Time');
      expect(input).toBeDisabled();
    });
  });

  // Error State Tests
  describe('Error State', () => {
    test('shows error state', () => {
      render(<M3Timepicker error helperText="Invalid time" />);
      expect(screen.getByText('Invalid time')).toBeInTheDocument();
    });
  });
});
