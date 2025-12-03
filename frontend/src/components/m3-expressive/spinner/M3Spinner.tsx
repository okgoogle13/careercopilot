/**
 * M3 Expressive Spinner Component
 * Implements Material Design 3 Spinner for CareerCopilot
 *
 * Indeterminate loading animation. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Spinner.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Spinner.css';

export interface M3SpinnerProps {
  /**
   * Size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Spinner component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Spinner />
 * <M3Spinner size="large" color="secondary" />
 * ```
 */
export const M3Spinner: React.FC<M3SpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className = '',
}) => {
  const classNames = [
    'm3-spinner',
    `m3-spinner--${size}`,
    `m3-spinner--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} role="status" aria-live="polite" aria-label="Loading">
      <div className="m3-spinner__circle" />
    </div>
  );
};

M3Spinner.displayName = 'M3Spinner';

export default M3Spinner;
