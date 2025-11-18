import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, useToast } from '../toast';

describe('Toast', () => {
  describe('Rendering', () => {
    it('renders when open is true', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          message="Test message"
        />
      );
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('does not render when open is false', () => {
      render(
        <Toast
          open={false}
          onClose={() => {}}
          severity="info"
          message="Test message"
        />
      );
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });

    it('renders with title', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          title="Title"
          message="Message"
        />
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Message')).toBeInTheDocument();
    });

    it('renders without title', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          message="Message only"
        />
      );
      expect(screen.getByText('Message only')).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  describe('Severity Variants', () => {
    it('renders success variant', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="success"
          message="Success message"
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('renders error variant', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="error"
          message="Error message"
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('renders warning variant', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="warning"
          message="Warning message"
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    it('renders info variant', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          message="Info message"
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('renders with default position (bottom-right)', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          message="Message"
        />
      );
      expect(screen.getByText('Message')).toBeInTheDocument();
    });

    it('renders with custom position (top-left)', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          message="Message"
          position={{ vertical: 'top', horizontal: 'left' }}
        />
      );
      expect(screen.getByText('Message')).toBeInTheDocument();
    });

    it('renders with top-center position', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          message="Message"
          position={{ vertical: 'top', horizontal: 'center' }}
        />
      );
      expect(screen.getByText('Message')).toBeInTheDocument();
    });

    it('renders with bottom-center position', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          message="Message"
          position={{ vertical: 'bottom', horizontal: 'center' }}
        />
      );
      expect(screen.getByText('Message')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      render(
        <Toast
          open={true}
          onClose={handleClose}
          severity="info"
          message="Message"
        />
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('auto-closes after default duration (6000ms)', async () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();

      render(
        <Toast
          open={true}
          onClose={handleClose}
          severity="info"
          message="Message"
        />
      );

      expect(handleClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(6000);

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalled();
      });

      jest.useRealTimers();
    });

    it('auto-closes after custom duration', async () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();

      render(
        <Toast
          open={true}
          onClose={handleClose}
          severity="info"
          message="Message"
          duration={3000}
        />
      );

      expect(handleClose).not.toHaveBeenCalled();

      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalled();
      });

      jest.useRealTimers();
    });
  });

  describe('Icons', () => {
    it('displays success icon for success variant', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="success"
          message="Success"
        />
      );
      const alert = screen.getByRole('alert');
      expect(alert.querySelector('svg')).toBeInTheDocument();
    });

    it('displays error icon for error variant', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="error"
          message="Error"
        />
      );
      const alert = screen.getByRole('alert');
      expect(alert.querySelector('svg')).toBeInTheDocument();
    });

    it('displays warning icon for warning variant', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="warning"
          message="Warning"
        />
      );
      const alert = screen.getByRole('alert');
      expect(alert.querySelector('svg')).toBeInTheDocument();
    });

    it('displays info icon for info variant', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          message="Info"
        />
      );
      const alert = screen.getByRole('alert');
      expect(alert.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA role', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          message="Message"
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('close button has accessible label', () => {
      render(
        <Toast
          open={true}
          onClose={() => {}}
          severity="info"
          message="Message"
        />
      );
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      render(
        <Toast
          open={true}
          onClose={handleClose}
          severity="info"
          message="Message"
        />
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      closeButton.focus();
      await user.keyboard('{Enter}');

      expect(handleClose).toHaveBeenCalled();
    });
  });
});

describe('useToast Hook', () => {
  const TestComponent = () => {
    const {
      toastState,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      closeToast,
    } = useToast();

    return (
      <div>
        <button onClick={() => showSuccess('Success message')}>Show Success</button>
        <button onClick={() => showError('Error message')}>Show Error</button>
        <button onClick={() => showWarning('Warning message')}>Show Warning</button>
        <button onClick={() => showInfo('Info message')}>Show Info</button>
        <button onClick={closeToast}>Close</button>
        <Toast
          open={toastState.open}
          onClose={closeToast}
          severity={toastState.severity}
          title={toastState.title}
          message={toastState.message}
        />
      </div>
    );
  };

  describe('Toast State Management', () => {
    it('shows success toast', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      await user.click(screen.getByText('Show Success'));
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('shows error toast', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      await user.click(screen.getByText('Show Error'));
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('shows warning toast', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      await user.click(screen.getByText('Show Warning'));
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    it('shows info toast', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      await user.click(screen.getByText('Show Info'));
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });

    it('closes toast', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      await user.click(screen.getByText('Show Success'));
      expect(screen.getByText('Success message')).toBeInTheDocument();

      await user.click(screen.getByText('Close'));
      await waitFor(() => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      });
    });

    it('shows toast with title', async () => {
      const user = userEvent.setup();
      const TestComponentWithTitle = () => {
        const { toastState, showToast, closeToast } = useToast();

        return (
          <div>
            <button onClick={() => showToast('success', 'Message', 'Title')}>
              Show With Title
            </button>
            <Toast
              open={toastState.open}
              onClose={closeToast}
              severity={toastState.severity}
              title={toastState.title}
              message={toastState.message}
            />
          </div>
        );
      };

      render(<TestComponentWithTitle />);

      await user.click(screen.getByText('Show With Title'));
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Message')).toBeInTheDocument();
    });
  });

  describe('Hook Return Values', () => {
    it('provides all helper functions', () => {
      const TestHookValues = () => {
        const hook = useToast();
        return (
          <div>
            <span data-testid="has-showSuccess">{typeof hook.showSuccess}</span>
            <span data-testid="has-showError">{typeof hook.showError}</span>
            <span data-testid="has-showWarning">{typeof hook.showWarning}</span>
            <span data-testid="has-showInfo">{typeof hook.showInfo}</span>
            <span data-testid="has-closeToast">{typeof hook.closeToast}</span>
          </div>
        );
      };

      render(<TestHookValues />);

      expect(screen.getByTestId('has-showSuccess')).toHaveTextContent('function');
      expect(screen.getByTestId('has-showError')).toHaveTextContent('function');
      expect(screen.getByTestId('has-showWarning')).toHaveTextContent('function');
      expect(screen.getByTestId('has-showInfo')).toHaveTextContent('function');
      expect(screen.getByTestId('has-closeToast')).toHaveTextContent('function');
    });
  });
});
