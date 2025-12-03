import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { M3Snackbar } from './M3Snackbar';

describe('M3Snackbar Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders snackbar with message', () => {
      render(<M3Snackbar message="Test message" />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Snackbar message="Test" />);
      const element = container.querySelector('.m3-snackbar');
      expect(element).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Snackbar message="Test" className="custom-class" />
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    test('renders action button when provided', () => {
      render(
        <M3Snackbar message="Test" action="Undo" onAction={() => {}} />
      );
      expect(screen.getByText('Undo')).toBeInTheDocument();
    });
  });

  // Position Tests
  describe('Position', () => {
    const positions = ['bottom-center', 'bottom-left', 'bottom-right'] as const;

    positions.forEach((position) => {
      test(`applies ${position} position class`, () => {
        const { container } = render(
          <M3Snackbar message="Test" position={position} />
        );
        const snackbar = container.querySelector(`.m3-snackbar--${position}`);
        expect(snackbar).toBeInTheDocument();
      });
    });
  });

  // Action Tests
  describe('Action Button', () => {
    test('calls onAction when action button is clicked', () => {
      const handleAction = jest.fn();
      render(
        <M3Snackbar message="Test" action="Undo" onAction={handleAction} />
      );
      const actionButton = screen.getByText('Undo');
      actionButton.click();
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  // Auto-dismiss Tests
  describe('Auto-dismiss', () => {
    test('calls onClose after duration', async () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();
      render(<M3Snackbar message="Test" duration={1000} onClose={handleClose} />);
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
      render(<M3Snackbar message="Test" duration={0} onClose={handleClose} />);
      jest.advanceTimersByTime(5000);
      expect(handleClose).not.toHaveBeenCalled();
      jest.useRealTimers();
    });
  });

  // Open/Close Tests
  describe('Open/Close State', () => {
    test('does not render when open is false', () => {
      const { container } = render(<M3Snackbar message="Test" open={false} />);
      const snackbar = container.querySelector('.m3-snackbar');
      expect(snackbar).not.toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', () => {
      const handleClose = jest.fn();
      render(<M3Snackbar message="Test" onClose={handleClose} />);
      const closeButton = screen.getByLabelText('Close snackbar');
      closeButton.click();
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has role="status" and aria-live', () => {
      const { container } = render(<M3Snackbar message="Test" />);
      const snackbar = container.querySelector('[role="status"][aria-live="polite"]');
      expect(snackbar).toBeInTheDocument();
    });
  });
});
