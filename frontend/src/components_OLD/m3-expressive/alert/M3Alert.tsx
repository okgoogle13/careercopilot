/**
 * M3 Expressive Alert Component
 * Implements Material Design 3 feedback component with M3 styling
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3Alert.css';



export interface M3AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The severity level of the alert
   * @default 'info'
   */
  severity?: 'info' | 'success' | 'warning' | 'error';

  /**
   * Optional icon to display
   */
  icon?: React.ReactNode;

  /**
   * Callback fired when the close button is clicked
   */
  onClose?: () => void;

  /**
   * Content of the component
   */
  children?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Alert component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Alert severity="success" onClose={() => console.log('closed')}>
 *   Operation completed successfully!
 * </M3Alert>
 * ```
 */
export const M3Alert = React.forwardRef<HTMLDivElement, M3AlertProps>(
  (
    {
      severity = 'info',
      icon,
      onClose,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-alert',
      `m3-alert--${severity}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        role="alert"
        data-testid="m3-alert"
        {...props}
      >
        {icon && <span className="m3-alert__icon">{icon}</span>}
        <span className="m3-alert__message">{children}</span>
        {onClose && (
          <button
            type="button"
            className="m3-alert__close-button"
            onClick={onClose}
            aria-label="Close alert"
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    );
  }
);

M3Alert.displayName = 'M3Alert';

export default M3Alert;
