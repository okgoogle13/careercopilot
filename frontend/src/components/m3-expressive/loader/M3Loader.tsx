/**
 * M3 Expressive Loader Component
 * Implements Material Design 3 Loader for CareerCopilot
 *
 * Circular progress with percentage. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Loader.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Loader.css';

export interface M3LoaderProps {
  /**
   * Progress value (0-100)
   */
  value?: number;

  /**
   * If true, shows indeterminate progress
   * @default false
   */
  indeterminate?: boolean;

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
   * If true, shows percentage text
   * @default true
   */
  showPercentage?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Loader component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Loader value={50} />
 * <M3Loader indeterminate />
 * ```
 */
export const M3Loader: React.FC<M3LoaderProps> = ({
  value,
  indeterminate = false,
  size = 'medium',
  color = 'primary',
  showPercentage = true,
  className = '',
}) => {
  const clampedValue = value !== undefined ? Math.min(100, Math.max(0, value)) : 0;
  const radius = size === 'small' ? 18 : size === 'large' ? 30 : 24;
  const circumference = 2 * Math.PI * radius;
  const offset = indeterminate ? 0 : circumference - (clampedValue / 100) * circumference;

  const classNames = [
    'm3-loader',
    `m3-loader--${size}`,
    `m3-loader--${color}`,
    indeterminate && 'm3-loader--indeterminate',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} role="progressbar" aria-valuenow={indeterminate ? undefined : clampedValue} aria-valuemin={0} aria-valuemax={100}>
      <svg className="m3-loader__svg" viewBox="0 0 64 64">
        <circle
          className="m3-loader__circle-background"
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="4"
        />
        <circle
          className="m3-loader__circle-progress"
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showPercentage && !indeterminate && (
        <span className="m3-loader__percentage">{Math.round(clampedValue)}%</span>
      )}
    </div>
  );
};

M3Loader.displayName = 'M3Loader';

export default M3Loader;
