import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M3Rangeslider } from './M3Rangeslider';

describe('M3Rangeslider Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders rangeslider', () => {
      const { container } = render(<M3Rangeslider />);
      const rangeslider = container.querySelector('.m3-rangeslider');
      expect(rangeslider).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Rangeslider />);
      const element = container.querySelector('.m3-rangeslider');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Rangeslider className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders two range inputs', () => {
      render(<M3Rangeslider label="Range" />);
      expect(screen.getByLabelText('Range minimum')).toBeInTheDocument();
      expect(screen.getByLabelText('Range maximum')).toBeInTheDocument();
    });
  });

  // Value Tests
  describe('Value', () => {
    test('renders with value', () => {
      render(<M3Rangeslider value={[20, 80]} />);
      const minInput = screen.getByLabelText(/minimum/i) as HTMLInputElement;
      const maxInput = screen.getByLabelText(/maximum/i) as HTMLInputElement;
      expect(minInput.value).toBe('20');
      expect(maxInput.value).toBe('80');
    });

    test('calls onChange when min value changes', () => {
      const handleChange = jest.fn();
      render(<M3Rangeslider value={[20, 80]} onChange={handleChange} />);
      const minInput = screen.getByLabelText(/minimum/i);
      fireEvent.change(minInput, { target: { value: '30' } });
      expect(handleChange).toHaveBeenCalledWith([30, 80]);
    });

    test('calls onChange when max value changes', () => {
      const handleChange = jest.fn();
      render(<M3Rangeslider value={[20, 80]} onChange={handleChange} />);
      const maxInput = screen.getByLabelText(/maximum/i);
      fireEvent.change(maxInput, { target: { value: '70' } });
      expect(handleChange).toHaveBeenCalledWith([20, 70]);
    });

    test('prevents min from exceeding max', () => {
      const handleChange = jest.fn();
      render(<M3Rangeslider value={[20, 80]} onChange={handleChange} />);
      const minInput = screen.getByLabelText(/minimum/i);
      fireEvent.change(minInput, { target: { value: '90' } });
      expect(handleChange).toHaveBeenCalledWith([80, 80]);
    });

    test('prevents max from going below min', () => {
      const handleChange = jest.fn();
      render(<M3Rangeslider value={[20, 80]} onChange={handleChange} />);
      const maxInput = screen.getByLabelText(/maximum/i);
      fireEvent.change(maxInput, { target: { value: '10' } });
      expect(handleChange).toHaveBeenCalledWith([20, 20]);
    });

    test('shows values when showValues is true', () => {
      render(<M3Rangeslider value={[20, 80]} showValues />);
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
    });
  });
});
