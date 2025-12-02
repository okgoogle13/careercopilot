import React from 'react';
import styles from './toast.module.css';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  open: boolean;
  onClose: () => void;
  severity: ToastSeverity;
  title?: string;
  message: string;
  duration?: number;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

const getSeverityClass = (severity: ToastSeverity) => {
  const severityMap = {
    success: styles['toast--success'],
    error: styles['toast--error'],
    warning: styles['toast--warning'],
    info: styles['toast--info'],
  };
  return severityMap[severity];
};

const iconMapping = {
  success: React.createElement(CheckCircle, { size: 20 }),
  error: React.createElement(AlertCircle, { size: 20 }),
  warning: React.createElement(AlertTriangle, { size: 20 }),
  info: React.createElement(Info, { size: 20 }),
};

const getPositionClass = (position) => {
  const verticalClass = position.vertical === 'top' ? styles['toast--top'] : styles['toast--bottom'];
  const horizontalMap = {
    left: styles['toast--left'],
    center: styles['toast--center'],
    right: styles['toast--right'],
  };
  return verticalClass + ' ' + horizontalMap[position.horizontal];
};

export const Toast = React.forwardRef((props, ref) => {
  const {
    open,
    onClose,
    severity,
    title,
    message,
    duration = 6000,
    position = { vertical: 'bottom', horizontal: 'right' },
  } = props;

  React.useEffect(() => {
    if (!open || duration <= 0) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return React.createElement(
    'div',
    {
      className: styles.toast + ' ' + getSeverityClass(severity) + ' ' + getPositionClass(position),
      role: 'alert',
      ref: ref,
    },
    React.createElement(
      'div',
      { className: styles['toast-icon'] },
      iconMapping[severity]
    ),
    React.createElement(
      'div',
      { className: styles['toast-content'] },
      title && React.createElement('div', { className: styles['toast-title'] }, title),
      React.createElement('div', { className: styles['toast-message'] }, message)
    ),
    React.createElement(
      'button',
      {
        className: styles['toast-close'],
        onClick: onClose,
        'aria-label': 'Close notification',
        type: 'button',
      },
      React.createElement(X, { size: 18 })
    )
  );
});

export const useToast = () => {
  const [toastState, setToastState] = React.useState({
    open: false,
    severity: 'info',
    message: '',
  });

  const showToast = (severity, message, title) => {
    setToastState({ open: true, severity, message, title });
  };

  const closeToast = () => {
    setToastState((prev) => ({ ...prev, open: false }));
  };

  return {
    toastState,
    showToast,
    closeToast,
    showSuccess: (message, title) => showToast('success', message, title),
    showError: (message, title) => showToast('error', message, title),
    showWarning: (message, title) => showToast('warning', message, title),
    showInfo: (message, title) => showToast('info', message, title),
  };
};

export default Toast;
