/**
 * M3 Expressive Toast Component
 * Implements Material Design 3 Toast for CareerCopilot
 *
 * Auto-dismiss notification. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Toast.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useEffect, useState } from 'react';
import './M3Toast.css';

export interface M3ToastProps {
  /**
   * Toast message content
   */
  message: string;

  /**
   * Toast variant
   * @default 'info'
   */
  variant?: 'info' | 'success' | 'warning' | 'error';

  /**
   * Auto-dismiss duration in milliseconds
   * @default 3000
   */
  duration?: number;

  /**
   * If true, toast is visible
   * @default true
   */
  open?: boolean;

  /**
   * Callback fired when toast is dismissed
   */
  onClose?: () => void;

  /**
   * Optional icon
   */
  icon?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Toast component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Toast message="Operation completed" variant="success" />
 * ```
 */
export const M3Toast: React.FC<M3ToastProps> = ({
  message,
  variant = 'info',
  duration = 3000,
  open: controlledOpen,
  onClose,
  icon,
  className = '',
}) => {
  const [internalOpen, setInternalOpen] = useState(true);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        if (!isControlled) {
          setInternalOpen(false);
        }
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, isControlled, onClose]);

  if (!open) return null;

  const classNames = [
    'm3-toast',
    `m3-toast--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} role="alert" aria-live="polite">
      {icon && <span className="m3-toast__icon">{icon}</span>}
      <span className="m3-toast__message">{message}</span>
      {onClose && (
        <button
          type="button"
          className="m3-toast__close"
          onClick={onClose}
          aria-label="Close toast"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

M3Toast.displayName = 'M3Toast';

export default M3Toast;
