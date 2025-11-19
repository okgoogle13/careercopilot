/**
 * M3 Expressive Alert Component
 * Implements Material Design 3 alert/notification banners
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 */
import React, { useState } from 'react';
import './M3Alert.css';

export interface M3AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Alert severity level
   * @default 'info'
   */
  severity?: 'info' | 'success' | 'warning' | 'error';

  /**
   * Alert variant
   * @default 'standard'
   */
  variant?: 'standard' | 'filled' | 'outlined';

  /**
   * Alert title
   */
  title?: string;

  /**
   * If true, displays close button
   * @default false
   */
  closable?: boolean;

  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;

  /**
   * Icon to display
   */
  icon?: React.ReactNode;

  /**
   * Action buttons or elements
   */
  action?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * M3 Expressive Alert component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Alert severity="success" title="Success" closable>
 *   Operation completed successfully
 * </M3Alert>
 * ```
 */
export const M3Alert = React.forwardRef<HTMLDivElement, M3AlertProps>(
  (
    {
      severity = 'info',
      variant = 'standard',
      title,
      closable = false,
      onClose,
      icon,
      action,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(true);

    const handleClose = () => {
      setVisible(false);
      onClose?.();
    };

    if (!visible) {
      return null;
    }

    const classNames = [
      'm3-alert',
      `m3-alert--${severity}`,
      `m3-alert--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Default icons for each severity
    const defaultIcons = {
      info: (
        <svg className="m3-alert__icon-svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
      success: (
        <svg className="m3-alert__icon-svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      warning: (
        <svg className="m3-alert__icon-svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      ),
      error: (
        <svg className="m3-alert__icon-svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
    };

    const displayIcon = icon !== undefined ? icon : defaultIcons[severity];

    return (
      <div
        ref={ref}
        role="alert"
        className={classNames}
        data-testid="m3-alert"
        {...props}
      >
        {displayIcon && <div className="m3-alert__icon">{displayIcon}</div>}

        <div className="m3-alert__content">
          {title && <div className="m3-alert__title">{title}</div>}
          {children && <div className="m3-alert__message">{children}</div>}
        </div>

        {action && <div className="m3-alert__action">{action}</div>}

        {closable && (
          <button
            type="button"
            className="m3-alert__close"
            onClick={handleClose}
            aria-label="Close alert"
          >
            <svg className="m3-alert__close-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

M3Alert.displayName = 'M3Alert';

export default M3Alert;
