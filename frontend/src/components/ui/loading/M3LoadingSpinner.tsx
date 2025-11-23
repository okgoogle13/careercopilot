/**
 * M3 Expressive LoadingSpinner Component
 * Circular loading spinner with M3 motion tokens
 */
import React from 'react';
import './M3LoadingSpinner.css';

export interface M3LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive LoadingSpinner component.
 *
 * Example: <M3LoadingSpinner size="large" />
 */
export const M3LoadingSpinner = React.forwardRef<HTMLDivElement, M3LoadingSpinnerProps>(
  (
    {
      size = 'medium',
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-loading-spinner',
      `m3-loading-spinner--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        role="status"
        aria-live="polite"
        aria-label="Loading"
        data-testid="m3-loading-spinner"
        {...props}
      >
        <svg className="m3-loading-spinner__svg" viewBox="0 0 50 50">
          <circle
            className="m3-loading-spinner__circle"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
          />
        </svg>
        <span className="m3-loading-spinner__sr-only">Loading...</span>
      </div>
    );
  }
);

M3LoadingSpinner.displayName = 'M3LoadingSpinner';

export default M3LoadingSpinner;
