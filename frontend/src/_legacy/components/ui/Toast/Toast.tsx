import React, { ReactNode } from 'react';
import { Snackbar, Alert, AlertColor, SnackbarOrigin, SxProps, Theme } from '@mui/material';

export interface ToastProps {
  /**
   * Whether the toast is open
   */
  open: boolean;
  /**
   * Callback when the toast is closed
   */
  onClose: () => void;
  /**
   * The message to display in the toast
   */
  message: string;
  /**
   * The severity of the toast
   * @default 'info'
   */
  severity?: AlertColor;
  /**
   * The position of the toast
   * @default { vertical: 'bottom', horizontal: 'center' }
   */
  anchorOrigin?: SnackbarOrigin;
  /**
   * Auto hide duration in milliseconds
   * @default 6000
   */
  autoHideDuration?: number;
  /**
   * Additional action to display
   */
  action?: ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Additional styles
   */
  sx?: SxProps<Theme>;
}

/**
 * A customizable toast notification component built with Material-UI's Snackbar and Alert components.
 * Supports different severity levels, custom positioning, and automatic hiding.
 */
export const Toast = ({
  open,
  onClose,
  message,
  severity = 'info',
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  autoHideDuration = 6000,
  action,
  className = '',
  sx = {},
}: ToastProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      className={className}
      sx={sx}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
        action={action}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
