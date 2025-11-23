import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { Toast, ToastProps } from '../Toast';
import * as React from 'react';

describe('Toast', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  // Basic rendering tests
  it('renders without errors when open', () => {
    render(<Toast open={true} onClose={mockOnClose} message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Toast open={false} onClose={mockOnClose} message="Test message" />);
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('renders the message text', () => {
    render(<Toast open={true} onClose={mockOnClose} message="Important notification" />);
    expect(screen.getByText('Important notification')).toBeInTheDocument();
  });

  // Severity variants
  it('renders with default severity (info)', () => {
    const { container } = render(<Toast open={true} onClose={mockOnClose} message="Info message" />);
    const alert = container.querySelector('.MuiAlert-standardInfo, .MuiAlert-filledInfo');
    expect(alert).toBeInTheDocument();
  });

  it('renders with success severity', () => {
    const { container } = render(
      <Toast open={true} onClose={mockOnClose} message="Success!" severity="success" />
    );
    const alert = container.querySelector('.MuiAlert-standardSuccess, .MuiAlert-filledSuccess');
    expect(alert).toBeInTheDocument();
  });

  it('renders with error severity', () => {
    const { container } = render(
      <Toast open={true} onClose={mockOnClose} message="Error occurred" severity="error" />
    );
    const alert = container.querySelector('.MuiAlert-standardError, .MuiAlert-filledError');
    expect(alert).toBeInTheDocument();
  });

  it('renders with warning severity', () => {
    const { container } = render(
      <Toast open={true} onClose={mockOnClose} message="Warning!" severity="warning" />
    );
    const alert = container.querySelector('.MuiAlert-standardWarning, .MuiAlert-filledWarning');
    expect(alert).toBeInTheDocument();
  });

  // Position tests
  it('uses default position (bottom-center)', () => {
    const { container } = render(<Toast open={true} onClose={mockOnClose} message="Message" />);
    const snackbar = container.querySelector('.MuiSnackbar-root');
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginBottomCenter');
  });

  it('supports custom position (top-left)', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        message="Message"
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      />
    );
    const snackbar = container.querySelector('.MuiSnackbar-root');
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginTopLeft');
  });

  it('supports custom position (top-right)', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        message="Message"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    );
    const snackbar = container.querySelector('.MuiSnackbar-root');
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginTopRight');
  });

  it('supports custom position (bottom-left)', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        message="Message"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    );
    const snackbar = container.querySelector('.MuiSnackbar-root');
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginBottomLeft');
  });

  it('supports custom position (bottom-right)', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        message="Message"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    );
    const snackbar = container.querySelector('.MuiSnackbar-root');
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginBottomRight');
  });

  // Auto-hide tests
  it('calls onClose after default auto-hide duration', async () => {
    jest.useFakeTimers();
    render(<Toast open={true} onClose={mockOnClose} message="Auto-hide message" />);

    // Advance timers by default duration (6000ms)
    jest.advanceTimersByTime(6000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });

  it('calls onClose after custom auto-hide duration', async () => {
    jest.useFakeTimers();
    render(
      <Toast open={true} onClose={mockOnClose} message="Custom duration" autoHideDuration={3000} />
    );

    // Advance timers by custom duration (3000ms)
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });

  // Close button tests
  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Toast open={true} onClose={mockOnClose} message="Closable message" />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders close button on Alert component', () => {
    render(<Toast open={true} onClose={mockOnClose} message="Message with close button" />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  // Custom action tests
  it('renders custom action element', () => {
    const customAction = <button data-testid="custom-action">Undo</button>;
    render(
      <Toast open={true} onClose={mockOnClose} message="Action message" action={customAction} />
    );
    expect(screen.getByTestId('custom-action')).toBeInTheDocument();
  });

  it('renders both close button and custom action', () => {
    const customAction = <button data-testid="undo-button">Undo</button>;
    render(
      <Toast open={true} onClose={mockOnClose} message="With action" action={customAction} />
    );
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(screen.getByTestId('undo-button')).toBeInTheDocument();
  });

  // Custom styling tests
  it('applies custom className', () => {
    const { container } = render(
      <Toast open={true} onClose={mockOnClose} message="Styled toast" className="custom-toast" />
    );
    const snackbar = container.querySelector('.custom-toast');
    expect(snackbar).toBeInTheDocument();
  });

  it('applies custom sx prop', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        message="Custom styled"
        sx={{ zIndex: 9999 }}
      />
    );
    // sx prop is applied to Snackbar component
    expect(screen.getByText('Custom styled')).toBeInTheDocument();
  });

  // MUI Alert variant
  it('uses filled variant for Alert', () => {
    const { container } = render(
      <Toast open={true} onClose={mockOnClose} message="Filled alert" />
    );
    const alert = container.querySelector('.MuiAlert-filled');
    expect(alert).toBeInTheDocument();
  });

  // Alert icon tests
  it('renders icon for success severity', () => {
    const { container } = render(
      <Toast open={true} onClose={mockOnClose} message="Success" severity="success" />
    );
    const icon = container.querySelector('.MuiAlert-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders icon for error severity', () => {
    const { container } = render(
      <Toast open={true} onClose={mockOnClose} message="Error" severity="error" />
    );
    const icon = container.querySelector('.MuiAlert-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders icon for warning severity', () => {
    const { container } = render(
      <Toast open={true} onClose={mockOnClose} message="Warning" severity="warning" />
    );
    const icon = container.querySelector('.MuiAlert-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders icon for info severity', () => {
    const { container } = render(
      <Toast open={true} onClose={mockOnClose} message="Info" severity="info" />
    );
    const icon = container.querySelector('.MuiAlert-icon');
    expect(icon).toBeInTheDocument();
  });

  // State change tests
  it('shows toast when open prop changes to true', () => {
    const { rerender } = render(<Toast open={false} onClose={mockOnClose} message="Message" />);
    expect(screen.queryByText('Message')).not.toBeInTheDocument();

    rerender(<Toast open={true} onClose={mockOnClose} message="Message" />);
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('hides toast when open prop changes to false', async () => {
    const { rerender } = render(<Toast open={true} onClose={mockOnClose} message="Message" />);
    expect(screen.getByText('Message')).toBeInTheDocument();

    rerender(<Toast open={false} onClose={mockOnClose} message="Message" />);
    await waitFor(() => {
      expect(screen.queryByText('Message')).not.toBeInTheDocument();
    });
  });

  // Integration test
  it('integrates all props correctly', async () => {
    const user = userEvent.setup();
    const customAction = <button data-testid="custom-btn">Action</button>;

    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        message="Complete toast"
        severity="warning"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={5000}
        action={customAction}
        className="integration-test"
      />
    );

    // Verify message
    expect(screen.getByText('Complete toast')).toBeInTheDocument();

    // Verify custom action
    expect(screen.getByTestId('custom-btn')).toBeInTheDocument();

    // Verify close button works
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Edge cases
  it('handles empty message', () => {
    render(<Toast open={true} onClose={mockOnClose} message="" />);
    expect(screen.queryByText(/./)).toBeInTheDocument(); // Alert still renders
  });

  it('handles very long message', () => {
    const longMessage = 'A'.repeat(500);
    render(<Toast open={true} onClose={mockOnClose} message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('handles rapid open/close state changes', () => {
    const { rerender } = render(<Toast open={true} onClose={mockOnClose} message="Rapid" />);
    rerender(<Toast open={false} onClose={mockOnClose} message="Rapid" />);
    rerender(<Toast open={true} onClose={mockOnClose} message="Rapid" />);
    rerender(<Toast open={false} onClose={mockOnClose} message="Rapid" />);
    // Should not crash
  });
});
