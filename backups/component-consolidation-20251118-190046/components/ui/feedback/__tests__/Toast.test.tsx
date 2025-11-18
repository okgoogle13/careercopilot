import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { Toast } from '../Toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Wrapper component to provide Material-UI theme context
const theme = createTheme();
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {component}
    </ThemeProvider>
  );
};

describe('Toast Component', () => {
  describe('Visibility', () => {
    it('renders when open=true', () => {
      const mockOnClose = jest.fn();
      renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Test notification"
        />
      );

      expect(screen.getByText('Test notification')).toBeInTheDocument();
    });

    it('does not render when open=false', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={false}
          onClose={mockOnClose}
          message="Hidden notification"
        />
      );

      // The snackbar should exist in the DOM but not be visible
      expect(screen.queryByText('Hidden notification')).not.toBeInTheDocument();
    });
  });

  describe('Message Display', () => {
    it('displays message text correctly', () => {
      const mockOnClose = jest.fn();
      const testMessage = 'Operation completed successfully';
      renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message={testMessage}
        />
      );

      expect(screen.getByText(testMessage)).toBeInTheDocument();
    });

    it('renders message with long text', () => {
      const mockOnClose = jest.fn();
      const longMessage = 'This is a very long notification message that should be displayed in full within the toast component without any truncation issues';
      renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message={longMessage}
        />
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('calls onClose when close button clicked', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Click to close"
        />
      );

      // The Alert component includes a close button by default
      const closeButton = screen.getByRole('button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose after autoHideDuration expires', async () => {
      jest.useFakeTimers('modern');
      const mockOnClose = jest.fn();
      const autoHideDuration = 3000;

      renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Auto-closing toast"
          autoHideDuration={autoHideDuration}
        />
      );

      expect(mockOnClose).not.toHaveBeenCalled();

      // Advance timers by the auto-hide duration
      jest.advanceTimersByTime(autoHideDuration);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });

      jest.useRealTimers();
    });
  });

  describe('Severity Levels', () => {
    it('renders with severity=success', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Success message"
          severity="success"
        />
      );

      expect(screen.getByText('Success message')).toBeInTheDocument();
      const alert = container.querySelector('.MuiAlert-standardSuccess');
      expect(alert).toBeInTheDocument();
    });

    it('renders with severity=error', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Error message"
          severity="error"
        />
      );

      expect(screen.getByText('Error message')).toBeInTheDocument();
      const alert = container.querySelector('.MuiAlert-standardError');
      expect(alert).toBeInTheDocument();
    });

    it('renders with severity=warning', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Warning message"
          severity="warning"
        />
      );

      expect(screen.getByText('Warning message')).toBeInTheDocument();
      const alert = container.querySelector('.MuiAlert-standardWarning');
      expect(alert).toBeInTheDocument();
    });

    it('renders with default severity=info', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Info message"
        />
      );

      expect(screen.getByText('Info message')).toBeInTheDocument();
      const alert = container.querySelector('.MuiAlert-standardInfo');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Anchor Origin Positioning', () => {
    it('positions toast at default bottom-center', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Default position"
        />
      );

      const snackbar = container.querySelector('.MuiSnackbar-root');
      expect(snackbar).toBeInTheDocument();
      // Default position is bottom-center, which applies specific classes
      expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginBottomCenter');
    });

    it('positions toast at top-left', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Top-left position"
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        />
      );

      const snackbar = container.querySelector('.MuiSnackbar-root');
      expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginTopLeft');
    });

    it('positions toast at bottom-right', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Bottom-right position"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
      );

      const snackbar = container.querySelector('.MuiSnackbar-root');
      expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginBottomRight');
    });

    it('positions toast at top-right', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Top-right position"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
      );

      const snackbar = container.querySelector('.MuiSnackbar-root');
      expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginTopRight');
    });
  });

  describe('Custom Action Element', () => {
    it('renders custom action element when provided', () => {
      const mockOnClose = jest.fn();
      const customAction = <button data-testid="custom-action">Undo</button>;

      renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Action available"
          action={customAction}
        />
      );

      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
      expect(screen.getByText('Undo')).toBeInTheDocument();
    });

    it('action element is clickable', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      const mockActionClick = jest.fn();
      const customAction = (
        <button
          data-testid="custom-action"
          onClick={mockActionClick}
        >
          Retry
        </button>
      );

      renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Retry available"
          action={customAction}
        />
      );

      const actionButton = screen.getByTestId('custom-action');
      await user.click(actionButton);

      expect(mockActionClick).toHaveBeenCalledTimes(1);
    });

    it('renders multiple elements in action prop', () => {
      const mockOnClose = jest.fn();
      const customAction = (
        <div data-testid="action-container">
          <button>Action 1</button>
          <button>Action 2</button>
        </div>
      );

      renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Multiple actions"
          action={customAction}
        />
      );

      expect(screen.getByTestId('action-container')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('handles complete toast workflow with all props', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      const mockActionClick = jest.fn();

      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Complete workflow test"
          severity="success"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={5000}
          action={
            <button
              data-testid="action-button"
              onClick={mockActionClick}
            >
              Dismiss
            </button>
          }
          className="custom-class"
          sx={{ minWidth: '300px' }}
        />
      );

      // Verify message is displayed
      expect(screen.getByText('Complete workflow test')).toBeInTheDocument();

      // Verify severity
      const alert = container.querySelector('.MuiAlert-standardSuccess');
      expect(alert).toBeInTheDocument();

      // Verify position
      const snackbar = container.querySelector('.MuiSnackbar-root');
      expect(snackbar).toHaveClass('MuiSnackbar-anchorOriginTopRight');

      // Verify action button is clickable
      const actionButton = screen.getByTestId('action-button');
      await user.click(actionButton);
      expect(mockActionClick).toHaveBeenCalledTimes(1);
    });

    it('updates message when prop changes', () => {
      const mockOnClose = jest.fn();
      const { rerender } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Initial message"
        />
      );

      expect(screen.getByText('Initial message')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toast
            open={true}
            onClose={mockOnClose}
            message="Updated message"
          />
        </ThemeProvider>
      );

      expect(screen.queryByText('Initial message')).not.toBeInTheDocument();
      expect(screen.getByText('Updated message')).toBeInTheDocument();
    });

    it('opens and closes toast dynamically', () => {
      const mockOnClose = jest.fn();
      const { rerender } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Dynamic toast"
        />
      );

      expect(screen.getByText('Dynamic toast')).toBeInTheDocument();

      rerender(
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toast
            open={false}
            onClose={mockOnClose}
            message="Dynamic toast"
          />
        </ThemeProvider>
      );

      expect(screen.queryByText('Dynamic toast')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Custom class test"
          className="custom-toast-class"
        />
      );

      const snackbar = container.querySelector('.MuiSnackbar-root');
      expect(snackbar).toHaveClass('custom-toast-class');
    });

    it('applies custom sx props', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithTheme(
        <Toast
          open={true}
          onClose={mockOnClose}
          message="Custom sx test"
          sx={{ minWidth: '400px' }}
        />
      );

      const snackbar = container.querySelector('.MuiSnackbar-root') as HTMLElement;
      expect(snackbar).toHaveStyle({ minWidth: '400px' });
    });

    it('renders multiple toast instances independently', () => {
      const mockOnClose1 = jest.fn();
      const mockOnClose2 = jest.fn();

      const { container } = render(
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toast
            open={true}
            onClose={mockOnClose1}
            message="Toast 1"
            severity="success"
          />
          <Toast
            open={true}
            onClose={mockOnClose2}
            message="Toast 2"
            severity="error"
          />
        </ThemeProvider>
      );

      expect(screen.getByText('Toast 1')).toBeInTheDocument();
      expect(screen.getByText('Toast 2')).toBeInTheDocument();

      const alerts = container.querySelectorAll('.MuiAlert-root');
      expect(alerts).toHaveLength(2);
    });
  });
});
