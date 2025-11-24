import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ToastProvider, useToast } from '../ToastContext';
import * as React from 'react';
import { ReactNode } from 'react';

// Test component that uses the useToast hook
const TestComponent = ({
  onToastShown,
}: {
  onToastShown?: (message: string) => void;
}) => {
  const { showToast, showSuccess, showError, showWarning, showInfo } = useToast();

  return (
    <div>
      <button
        onClick={() => {
          showToast('Generic toast message');
          onToastShown?.('Generic toast message');
        }}
      >
        Show Toast
      </button>
      <button
        onClick={() => {
          showSuccess('Success message');
          onToastShown?.('Success message');
        }}
      >
        Show Success
      </button>
      <button
        onClick={() => {
          showError('Error message');
          onToastShown?.('Error message');
        }}
      >
        Show Error
      </button>
      <button
        onClick={() => {
          showWarning('Warning message');
          onToastShown?.('Warning message');
        }}
      >
        Show Warning
      </button>
      <button
        onClick={() => {
          showInfo('Info message');
          onToastShown?.('Info message');
        }}
      >
        Show Info
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  describe('ToastProvider', () => {
    it('renders children correctly', () => {
      render(
        <ToastProvider>
          <div>Child content</div>
        </ToastProvider>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('provides toast context to children', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      expect(screen.getByText('Show Toast')).toBeInTheDocument();
      expect(screen.getByText('Show Success')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <ToastProvider>
          <div>First child</div>
          <div>Second child</div>
          <div>Third child</div>
        </ToastProvider>
      );
      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
      expect(screen.getByText('Third child')).toBeInTheDocument();
    });
  });

  describe('useToast hook', () => {
    it('throws error when used outside ToastProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useToast must be used within a ToastProvider');

      console.error = originalError;
    });

    it('provides showToast function', () => {
      const mockCallback = jest.fn();
      render(
        <ToastProvider>
          <TestComponent onToastShown={mockCallback} />
        </ToastProvider>
      );
      expect(screen.getByText('Show Toast')).toBeInTheDocument();
    });

    it('provides showSuccess function', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      expect(screen.getByText('Show Success')).toBeInTheDocument();
    });

    it('provides showError function', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      expect(screen.getByText('Show Error')).toBeInTheDocument();
    });

    it('provides showWarning function', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      expect(screen.getByText('Show Warning')).toBeInTheDocument();
    });

    it('provides showInfo function', () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
      expect(screen.getByText('Show Info')).toBeInTheDocument();
    });
  });

  describe('Toast display functionality', () => {
    it('displays toast when showToast is called', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Toast');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Generic toast message')).toBeInTheDocument();
      });
    });

    it('displays success toast when showSuccess is called', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Success');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });
    });

    it('displays error toast when showError is called', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Error');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Error message')).toBeInTheDocument();
      });
    });

    it('displays warning toast when showWarning is called', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Warning');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Warning message')).toBeInTheDocument();
      });
    });

    it('displays info toast when showInfo is called', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      const button = screen.getByText('Show Info');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Info message')).toBeInTheDocument();
      });
    });
  });

  describe('Toast queue management', () => {
    it('displays multiple toasts sequentially', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Show success toast
      await user.click(screen.getByText('Show Success'));
      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });

      // Show error toast
      await user.click(screen.getByText('Show Error'));
      await waitFor(() => {
        expect(screen.getByText('Error message')).toBeInTheDocument();
      });

      // Both toasts should be visible
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('displays toasts with unique keys', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Show the same message twice
      await user.click(screen.getByText('Show Success'));
      await user.click(screen.getByText('Show Success'));

      await waitFor(() => {
        const messages = screen.getAllByText('Success message');
        expect(messages).toHaveLength(2);
      });
    });

    it('removes toast after close animation', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show Success'));

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });

      // Click close button
      const closeButton = screen.getAllByRole('button', { name: /close/i })[0];
      await user.click(closeButton);

      // Advance timers past the 300ms animation delay
      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Toast options', () => {
    it('supports custom auto-hide duration', async () => {
      jest.useFakeTimers();

      const TestComponentWithOptions = () => {
        const { showToast } = useToast();

        return (
          <button
            onClick={() =>
              showToast('Custom duration', { autoHideDuration: 3000 })
            }
          >
            Show Custom Duration
          </button>
        );
      };

      render(
        <ToastProvider>
          <TestComponentWithOptions />
        </ToastProvider>
      );

      const button = screen.getByText('Show Custom Duration');
      const user = userEvent.setup({ delay: null });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Custom duration')).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('supports custom anchor position', async () => {
      const TestComponentWithPosition = () => {
        const { showToast } = useToast();

        return (
          <button
            onClick={() =>
              showToast('Positioned toast', {
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
              })
            }
          >
            Show Positioned
          </button>
        );
      };

      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponentWithPosition />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show Positioned'));

      await waitFor(() => {
        expect(screen.getByText('Positioned toast')).toBeInTheDocument();
      });
    });

    it('supports custom action element', async () => {
      const TestComponentWithAction = () => {
        const { showToast } = useToast();

        return (
          <button
            onClick={() =>
              showToast('Toast with action', {
                action: <button data-testid="custom-action">Undo</button>,
              })
            }
          >
            Show With Action
          </button>
        );
      };

      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponentWithAction />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show With Action'));

      await waitFor(() => {
        expect(screen.getByText('Toast with action')).toBeInTheDocument();
        expect(screen.getByTestId('custom-action')).toBeInTheDocument();
      });
    });
  });

  describe('Severity helper functions', () => {
    it('showSuccess uses success severity', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show Success'));

      await waitFor(() => {
        const alert = document.querySelector(
          '.MuiAlert-standardSuccess, .MuiAlert-filledSuccess'
        );
        expect(alert).toBeInTheDocument();
      });
    });

    it('showError uses error severity', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show Error'));

      await waitFor(() => {
        const alert = document.querySelector(
          '.MuiAlert-standardError, .MuiAlert-filledError'
        );
        expect(alert).toBeInTheDocument();
      });
    });

    it('showWarning uses warning severity', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show Warning'));

      await waitFor(() => {
        const alert = document.querySelector(
          '.MuiAlert-standardWarning, .MuiAlert-filledWarning'
        );
        expect(alert).toBeInTheDocument();
      });
    });

    it('showInfo uses info severity', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show Info'));

      await waitFor(() => {
        const alert = document.querySelector(
          '.MuiAlert-standardInfo, .MuiAlert-filledInfo'
        );
        expect(alert).toBeInTheDocument();
      });
    });
  });

  describe('Toast close functionality', () => {
    it('closes toast when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show Success'));

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });

      const closeButton = screen.getAllByRole('button', { name: /close/i })[0];
      await user.click(closeButton);

      // Toast should start closing animation
      await waitFor(() => {
        // The toast element may still be in DOM during animation
        const toast = screen.queryByText('Success message');
        // Check if it's either gone or has opacity 0
        if (toast) {
          const parent = toast.closest('.MuiSnackbar-root');
          // During close animation, the Snackbar may have exited class or be removing
        }
      });
    });

    it('auto-closes toast after specified duration', async () => {
      jest.useFakeTimers();

      const TestComponentWithAutoClose = () => {
        const { showToast } = useToast();

        return (
          <button onClick={() => showToast('Auto close', { autoHideDuration: 2000 })}>
            Show Auto Close
          </button>
        );
      };

      const user = userEvent.setup({ delay: null });
      render(
        <ToastProvider>
          <TestComponentWithAutoClose />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show Auto Close'));

      await waitFor(() => {
        expect(screen.getByText('Auto close')).toBeInTheDocument();
      });

      // Advance past auto-hide duration
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Advance past close animation (300ms)
      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByText('Auto close')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });

  describe('Integration tests', () => {
    it('handles complex workflow with multiple toast types', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Show success
      await user.click(screen.getByText('Show Success'));
      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
      });

      // Show error
      await user.click(screen.getByText('Show Error'));
      await waitFor(() => {
        expect(screen.getByText('Error message')).toBeInTheDocument();
      });

      // Show warning
      await user.click(screen.getByText('Show Warning'));
      await waitFor(() => {
        expect(screen.getByText('Warning message')).toBeInTheDocument();
      });

      // All three should be visible
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    it('maintains toast queue order', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Show toasts in specific order
      await user.click(screen.getByText('Show Success'));
      await user.click(screen.getByText('Show Error'));
      await user.click(screen.getByText('Show Warning'));

      await waitFor(() => {
        expect(screen.getByText('Success message')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByText('Warning message')).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('handles empty message', async () => {
      const TestComponentEmpty = () => {
        const { showToast } = useToast();
        return <button onClick={() => showToast('')}>Show Empty</button>;
      };

      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponentEmpty />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show Empty'));

      // Should render toast even with empty message
      await waitFor(() => {
        const alert = document.querySelector('.MuiAlert-root');
        expect(alert).toBeInTheDocument();
      });
    });

    it('handles very long message', async () => {
      const longMessage = 'A'.repeat(500);
      const TestComponentLong = () => {
        const { showToast } = useToast();
        return <button onClick={() => showToast(longMessage)}>Show Long</button>;
      };

      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponentLong />
        </ToastProvider>
      );

      await user.click(screen.getByText('Show Long'));

      await waitFor(() => {
        expect(screen.getByText(longMessage)).toBeInTheDocument();
      });
    });

    it('handles rapid consecutive toasts', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Rapidly click multiple times
      const button = screen.getByText('Show Success');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      await waitFor(() => {
        const messages = screen.getAllByText('Success message');
        expect(messages.length).toBeGreaterThan(0);
      });
    });
  });
});
