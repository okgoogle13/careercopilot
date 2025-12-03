/**
 * M3 Expressive Snackbar Component
 * Implements Material Design 3 Snackbar for CareerCopilot
 *
 * Bottom action notification. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Snackbar.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useEffect, useState } from 'react';
import './M3Snackbar.css';

export interface M3SnackbarProps {
  /**
   * Snackbar message
   */
  message: string;

  /**
   * Action button label
   */
  action?: string;

  /**
   * Action button click handler
   */
  onAction?: () => void;

  /**
   * Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
   * @default 4000
   */
  duration?: number;

  /**
   * If true, snackbar is visible
   * @default true
   */
  open?: boolean;

  /**
   * Callback fired when snackbar is dismissed
   */
  onClose?: () => void;

  /**
   * Position
   * @default 'bottom-center'
   */
  position?: 'bottom-center' | 'bottom-left' | 'bottom-right';

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Snackbar component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Snackbar
 *   message="Item deleted"
 *   action="Undo"
 *   onAction={() => undo()}
 * />
 * ```
 */
export const M3Snackbar: React.FC<M3SnackbarProps> = ({
  message,
  action,
  onAction,
  duration = 4000,
  open: controlledOpen,
  onClose,
  position = 'bottom-center',
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
    'm3-snackbar',
    `m3-snackbar--${position}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} role="status" aria-live="polite">
      <span className="m3-snackbar__message">{message}</span>
      {action && onAction && (
        <button
          type="button"
          className="m3-snackbar__action"
          onClick={onAction}
        >
          {action}
        </button>
      )}
      {onClose && (
        <button
          type="button"
          className="m3-snackbar__close"
          onClick={onClose}
          aria-label="Close snackbar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

M3Snackbar.displayName = 'M3Snackbar';

export default M3Snackbar;
