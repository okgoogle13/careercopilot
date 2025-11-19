import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertColor } from '@mui/material';
import { Toast, ToastProps } from './Toast';

type ToastContextType = {
  showToast: (message: string, options?: ToastOptions) => void;
  showSuccess: (message: string, options?: Omit<ToastOptions, 'severity'>) => void;
  showError: (message: string, options?: Omit<ToastOptions, 'severity'>) => void;
  showWarning: (message: string, options?: Omit<ToastOptions, 'severity'>) => void;
  showInfo: (message: string, options?: Omit<ToastOptions, 'severity'>) => void;
};

type ToastOptions = {
  severity?: AlertColor;
  autoHideDuration?: number;
  action?: ReactNode;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
};

type ToastState = ToastProps & {
  key: number;
  open: boolean;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * A provider component that makes the toast context available to all child components.
 * Wrap your app with this component to use the toast functionality.
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [count, setCount] = useState(0);

  const showToast = useCallback((
    message: string,
    {
      severity = 'info',
      autoHideDuration = 6000,
      action,
      anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
    }: ToastOptions = {}
  ) => {
    const key = count + 1;
    setCount(key);

    setToasts((prevToasts) => [
      ...prevToasts,
      {
        key,
        open: true,
        message,
        severity,
        autoHideDuration,
        action,
        anchorOrigin,
        onClose: () => {
          setToasts((prevToasts) =>
            prevToasts.map((toast) =>
              toast.key === key ? { ...toast, open: false } : toast
            )
          );
          // Remove the toast after the close animation
          setTimeout(() => {
            setToasts((prevToasts) =>
              prevToasts.filter((toast) => toast.key !== key)
            );
          }, 300);
        },
      },
    ]);
  }, [count]);

  const showSuccess = useCallback(
    (message: string, options?: Omit<ToastOptions, 'severity'>) => {
      showToast(message, { ...options, severity: 'success' });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, options?: Omit<ToastOptions, 'severity'>) => {
      showToast(message, { ...options, severity: 'error' });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'severity'>) => {
      showToast(message, { ...options, severity: 'warning' });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, options?: Omit<ToastOptions, 'severity'>) => {
      showToast(message, { ...options, severity: 'info' });
    },
    [showToast]
  );

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.key} {...toast} />
      ))}
    </ToastContext.Provider>
  );
};

/**
 * A hook that provides access to the toast context.
 * Must be used within a `ToastProvider`.
 * @returns An object with toast utility functions.
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
