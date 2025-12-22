import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { M3Toast } from './M3Toast';

describe('M3Toast Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders toast with message', () => {
      render(<M3Toast message="Test message" />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Toast message="Test" />);
      const element = container.querySelector('.m3-toast');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Toast message="Test" className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders icon when provided', () => {
      render(<M3Toast message="Test" icon={<span>Icon</span>} />);
      expect(screen.getByText('Icon')).toBeInTheDocument();
    });
  });

  // Variant Tests
  describe('Variants', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;

    variants.forEach((variant) => {
      test(`applies ${variant} variant class`, () => {
        const { container } = render(
          <M3Toast message="Test" variant={variant} />
        );
        const toast = container.querySelector(`.m3-toast--${variant}`);
        expect(toast).toBeInTheDocument();
      });
    });
  });

  // Auto-dismiss Tests
  describe('Auto-dismiss', () => {
    test('calls onClose after duration', async () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();
      render(<M3Toast message="Test" duration={1000} onClose={handleClose} />);
      expect(handleClose).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
      jest.useRealTimers();
    });

    test('does not auto-dismiss when duration is 0', async () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();
      render(<M3Toast message="Test" duration={0} onClose={handleClose} />);
      jest.advanceTimersByTime(5000);
      expect(handleClose).not.toHaveBeenCalled();
      jest.useRealTimers();
    });
  });

  // Open/Close Tests
  describe('Open/Close State', () => {
    test('does not render when open is false', () => {
      const { container } = render(<M3Toast message="Test" open={false} />);
      const toast = container.querySelector('.m3-toast');
      expect(toast).not.toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', () => {
      const handleClose = jest.fn();
      render(<M3Toast message="Test" onClose={handleClose} />);
      const closeButton = screen.getByLabelText('Close toast');
      closeButton.click();
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="alert" and aria-live', () => {
      const { container } = render(<M3Toast message="Test" />);
      const toast = container.querySelector('[role="alert"][aria-live="polite"]');
      expect(toast).toBeInTheDocument();
    });
  });
});
