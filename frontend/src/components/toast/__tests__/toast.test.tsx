import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Toast, ToastProps } from '@/components/custom/toast/Toast';
import type { ToastSeverity } from '@/components/custom/toast/Toast';
import * as React from 'react';

// Mock Lucide icons to avoid rendering issues and class checks
jest.mock('lucide-react', () => ({
  X: () => <svg data-testid="icon-x" />,
  CheckCircle2: () => <svg data-testid="icon-check-circle" />,
  AlertCircle: () => <svg data-testid="icon-alert-circle" />,
  AlertTriangle: () => <svg data-testid="icon-alert-triangle" />,
  Info: () => <svg data-testid="icon-info" />,
}));

describe('M3 Toast', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  // Basic rendering tests
  it('renders without errors when open', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Test message"
      />
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Toast
        open={false}
        onClose={mockOnClose}
        severity="info"
        message="Test message"
      />
    );
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders with title when provided', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="success"
        title="Success!"
        message="Operation completed"
      />
    );
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
  });

  // Severity variants with icons
  it('renders success severity with CheckCircle icon', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="success"
        message="Success message"
      />
    );
    expect(screen.getByTestId('icon-check-circle')).toBeInTheDocument();
  });

  it('renders error severity with AlertCircle icon', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="error"
        message="Error message"
      />
    );
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
  });

  it('renders warning severity with AlertTriangle icon', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="warning"
        message="Warning message"
      />
    );
    expect(screen.getByTestId('icon-alert-triangle')).toBeInTheDocument();
  });

  it('renders info severity with Info icon', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Info message"
      />
    );
    expect(screen.getByTestId('icon-info')).toBeInTheDocument();
  });

  // Position tests
  it('uses default position (bottom-right)', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Default position"
      />
    );
    const toast = screen.getByRole('alert');
    // Default is bottom-4 right-4
    expect(toast).toHaveClass('bottom-4', 'right-4');
  });

  it('supports custom position (top-left)', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Top left"
        position={{ vertical: 'top', horizontal: 'left' }}
      />
    );
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('top-4', 'left-4');
  });

  it('supports custom position (top-center)', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Top center"
        position={{ vertical: 'top', horizontal: 'center' }}
      />
    );
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('top-4', 'left-1/2', '-translate-x-1/2');
  });

  // Auto-hide duration tests
  it('calls onClose after default duration (6000ms)', async () => {
    jest.useFakeTimers();
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Auto hide default"
      />
    );

    jest.advanceTimersByTime(6000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup({ delay: null }); // Disable delay for mock timers friendliness if needed, or just use await
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="success"
        message="Closable message"
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Style tests
  it('applies success styling', () => {
    // Checking for class names from severityConfig
    // bg-primary-container
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="success"
        message="Success"
      />
    );
    // The classes are applied to the Card inside the motion div
    // We can just verify the text contains the text color class, or similar
    // success text: text-on-primary-container
    expect(screen.getByText('Success')).toHaveClass('text-on-primary-container');
  });

  it('handles empty message gracefully', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message=""
      />
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
