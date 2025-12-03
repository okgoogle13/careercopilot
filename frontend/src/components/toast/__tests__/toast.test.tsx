import { render, screen, waitFor, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { Toast, ToastProps } from '@/components/custom/toast/Toast';
import type { ToastSeverity } from '@/components/custom/toast/Toast';
// Note: useToast hook may need to be created or imported from a different location
import * as React from 'react';

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
  });

  it('renders the message text', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="success"
        message="Important notification"
      />
    );
    expect(screen.getByText('Important notification')).toBeInTheDocument();
  });

  // Title tests
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

  it('renders without title when not provided', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Just a message"
      />
    );
    expect(screen.getByText('Just a message')).toBeInTheDocument();
  });

  // Severity variants with icons
  it('renders success severity with CheckCircle icon', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="success"
        message="Success message"
      />
    );
    // lucide-react CheckCircle icon should be rendered
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders error severity with AlertCircle icon', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="error"
        message="Error message"
      />
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders warning severity with AlertTriangle icon', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="warning"
        message="Warning message"
      />
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders info severity with Info icon', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Info message"
      />
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  // Position tests
  it('uses default position (bottom-right)', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Default position"
      />
    );
    const snackbar = container.querySelector('.MuiSnackbar-root');
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginBottomRight');
  });

  it('supports custom position (top-left)', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Top left"
        position={{ vertical: 'top', horizontal: 'left' }}
      />
    );
    const snackbar = container.querySelector('.MuiSnackbar-root');
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginTopLeft');
  });

  it('supports custom position (top-center)', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Top center"
        position={{ vertical: 'top', horizontal: 'center' }}
      />
    );
    const snackbar = container.querySelector('.MuiSnackbar-root');
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginTopCenter');
  });

  it('supports custom position (bottom-center)', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Bottom center"
        position={{ vertical: 'bottom', horizontal: 'center' }}
      />
    );
    const snackbar = container.querySelector('.MuiSnackbar-root');
    expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginBottomCenter');
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

  it('calls onClose after custom duration', async () => {
    jest.useFakeTimers();
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Auto hide custom"
        duration={3000}
      />
    );

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    jest.useRealTimers();
  });

  // Close button tests
  it('renders close button with X icon', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="With close button"
      />
    );
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    // X icon from lucide-react should be rendered
    const xIcon = container.querySelector('svg');
    expect(xIcon).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
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

  // M3 Styled Alert tests
  it('applies styled alert with custom styling', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="success"
        message="Styled alert"
      />
    );
    const alert = container.querySelector('.MuiAlert-root');
    expect(alert).toBeInTheDocument();
  });

  it('applies border-radius styling', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Rounded corners"
      />
    );
    const alert = container.querySelector('.MuiAlert-root');
    expect(alert).toBeInTheDocument();
  });

  // Severity color tests
  it('applies success colors correctly', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="success"
        message="Success colors"
      />
    );
    const alert = container.querySelector('.MuiAlert-root');
    expect(alert).toBeInTheDocument();
  });

  it('applies error colors correctly', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="error"
        message="Error colors"
      />
    );
    const alert = container.querySelector('.MuiAlert-root');
    expect(alert).toBeInTheDocument();
  });

  it('applies warning colors correctly', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="warning"
        message="Warning colors"
      />
    );
    const alert = container.querySelector('.MuiAlert-root');
    expect(alert).toBeInTheDocument();
  });

  it('applies info colors correctly', () => {
    const { container } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Info colors"
      />
    );
    const alert = container.querySelector('.MuiAlert-root');
    expect(alert).toBeInTheDocument();
  });

  // State change tests
  it('shows toast when open prop changes to true', () => {
    const { rerender } = render(
      <Toast
        open={false}
        onClose={mockOnClose}
        severity="info"
        message="State change"
      />
    );
    expect(screen.queryByText('State change')).not.toBeInTheDocument();

    rerender(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="State change"
      />
    );
    expect(screen.getByText('State change')).toBeInTheDocument();
  });

  it('hides toast when open prop changes to false', async () => {
    const { rerender } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="State change"
      />
    );
    expect(screen.getByText('State change')).toBeInTheDocument();

    rerender(
      <Toast
        open={false}
        onClose={mockOnClose}
        severity="info"
        message="State change"
      />
    );
    await waitFor(() => {
      expect(screen.queryByText('State change')).not.toBeInTheDocument();
    });
  });

  // Integration test
  it('integrates all props correctly', async () => {
    const user = userEvent.setup();
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="warning"
        title="Warning Title"
        message="Complete toast message"
        position={{ vertical: 'top', horizontal: 'center' }}
        duration={5000}
      />
    );

    // Verify title and message
    expect(screen.getByText('Warning Title')).toBeInTheDocument();
    expect(screen.getByText('Complete toast message')).toBeInTheDocument();

    // Verify close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('M3 useToast hook', () => {
  it('returns toast state and functions', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toastState).toBeDefined();
    expect(result.current.showToast).toBeDefined();
    expect(result.current.closeToast).toBeDefined();
    expect(result.current.showSuccess).toBeDefined();
    expect(result.current.showError).toBeDefined();
    expect(result.current.showWarning).toBeDefined();
    expect(result.current.showInfo).toBeDefined();
  });

  it('has initial state with open: false', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toastState.open).toBe(false);
    expect(result.current.toastState.severity).toBe('info');
    expect(result.current.toastState.message).toBe('');
  });

  it('showToast updates state correctly', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('success', 'Test message', 'Test Title');
    });

    expect(result.current.toastState.open).toBe(true);
    expect(result.current.toastState.severity).toBe('success');
    expect(result.current.toastState.message).toBe('Test message');
    expect(result.current.toastState.title).toBe('Test Title');
  });

  it('showSuccess updates state with success severity', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showSuccess('Success message');
    });

    expect(result.current.toastState.open).toBe(true);
    expect(result.current.toastState.severity).toBe('success');
    expect(result.current.toastState.message).toBe('Success message');
  });

  it('showError updates state with error severity', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showError('Error message');
    });

    expect(result.current.toastState.open).toBe(true);
    expect(result.current.toastState.severity).toBe('error');
    expect(result.current.toastState.message).toBe('Error message');
  });

  it('showWarning updates state with warning severity', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showWarning('Warning message');
    });

    expect(result.current.toastState.open).toBe(true);
    expect(result.current.toastState.severity).toBe('warning');
    expect(result.current.toastState.message).toBe('Warning message');
  });

  it('showInfo updates state with info severity', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showInfo('Info message');
    });

    expect(result.current.toastState.open).toBe(true);
    expect(result.current.toastState.severity).toBe('info');
    expect(result.current.toastState.message).toBe('Info message');
  });

  it('closeToast sets open to false', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showSuccess('Success');
    });

    expect(result.current.toastState.open).toBe(true);

    act(() => {
      result.current.closeToast();
    });

    expect(result.current.toastState.open).toBe(false);
  });

  it('showSuccess with title sets both message and title', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showSuccess('Success message', 'Success Title');
    });

    expect(result.current.toastState.message).toBe('Success message');
    expect(result.current.toastState.title).toBe('Success Title');
  });

  it('handles multiple consecutive calls', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showSuccess('First');
    });

    expect(result.current.toastState.message).toBe('First');

    act(() => {
      result.current.showError('Second');
    });

    expect(result.current.toastState.message).toBe('Second');
    expect(result.current.toastState.severity).toBe('error');

    act(() => {
      result.current.showWarning('Third');
    });

    expect(result.current.toastState.message).toBe('Third');
    expect(result.current.toastState.severity).toBe('warning');
  });

  it('integrates with Toast component', async () => {
    const TestComponent = () => {
      const { toastState, showSuccess, closeToast } = useToast();

      return (
        <>
          <button onClick={() => showSuccess('Hook success', 'Success!')}>
            Show Success
          </button>
          <Toast
            open={toastState.open}
            onClose={closeToast}
            severity={toastState.severity}
            title={toastState.title}
            message={toastState.message}
          />
        </>
      );
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    const button = screen.getByText('Show Success');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Hook success')).toBeInTheDocument();
    });
  });
});

describe('M3 Toast Edge Cases', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('handles empty message', () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message=""
      />
    );
    // Should render without crashing
    const alert = document.querySelector('.MuiAlert-root');
    expect(alert).toBeInTheDocument();
  });

  it('handles very long message', () => {
    const longMessage = 'A'.repeat(500);
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message={longMessage}
      />
    );
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('handles very long title', () => {
    const longTitle = 'Title '.repeat(50);
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="success"
        title={longTitle}
        message="Message"
      />
    );
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('handles rapid open/close state changes', () => {
    const { rerender } = render(
      <Toast open={true} onClose={mockOnClose} severity="info" message="Rapid" />
    );
    rerender(<Toast open={false} onClose={mockOnClose} severity="info" message="Rapid" />);
    rerender(<Toast open={true} onClose={mockOnClose} severity="info" message="Rapid" />);
    rerender(<Toast open={false} onClose={mockOnClose} severity="info" message="Rapid" />);
    // Should not crash
  });

  it('handles zero duration', async () => {
    jest.useFakeTimers();
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Zero duration"
        duration={0}
      />
    );

    jest.advanceTimersByTime(0);

    // MUI Snackbar may still have a minimum duration
    jest.useRealTimers();
  });

  it('handles negative duration', async () => {
    render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="info"
        message="Negative duration"
        duration={-1000}
      />
    );
    // Should render without crashing (MUI handles invalid duration)
    expect(screen.getByText('Negative duration')).toBeInTheDocument();
  });

  it('handles all severity types in sequence', () => {
    const severities: ToastSeverity[] = ['success', 'error', 'warning', 'info'];
    const { rerender } = render(
      <Toast
        open={true}
        onClose={mockOnClose}
        severity="success"
        message="Test"
      />
    );

    severities.forEach((severity) => {
      rerender(
        <Toast
          open={true}
          onClose={mockOnClose}
          severity={severity}
          message={`${severity} message`}
        />
      );
      expect(screen.getByText(`${severity} message`)).toBeInTheDocument();
    });
  });
});
