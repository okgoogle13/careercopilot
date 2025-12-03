/**
 * M3 Expressive Progress Component
 * Implements Material Design 3 Progress for CareerCopilot
 *
 * Progress indicator (bar or circular). Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Progress.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Progress.css';

export interface M3ProgressProps {
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
   * Progress variant
   * @default 'linear'
   */
  variant?: 'linear' | 'circular';

  /**
   * Color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Size (for circular variant)
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Progress component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Progress value={50} />
 * <M3Progress indeterminate variant="circular" />
 * ```
 */
export const M3Progress: React.FC<M3ProgressProps> = ({
  value,
  indeterminate = false,
  variant = 'linear',
  color = 'primary',
  size = 'medium',
  className = '',
}) => {
  const classNames = [
    'm3-progress',
    `m3-progress--${variant}`,
    `m3-progress--${color}`,
    variant === 'circular' && `m3-progress--${size}`,
    indeterminate && 'm3-progress--indeterminate',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const clampedValue = value !== undefined ? Math.min(100, Math.max(0, value)) : 0;

  if (variant === 'circular') {
    const radius = size === 'small' ? 18 : size === 'large' ? 30 : 24;
    const circumference = 2 * Math.PI * radius;
    const offset = indeterminate ? 0 : circumference - (clampedValue / 100) * circumference;

    return (
      <div className={classNames} role="progressbar" aria-valuenow={indeterminate ? undefined : clampedValue} aria-valuemin={0} aria-valuemax={100}>
        <svg className="m3-progress__svg" viewBox="0 0 64 64">
          <circle
            className="m3-progress__circle-background"
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            strokeWidth="4"
          />
          <circle
            className="m3-progress__circle-progress"
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={classNames} role="progressbar" aria-valuenow={indeterminate ? undefined : clampedValue} aria-valuemin={0} aria-valuemax={100}>
      <div className="m3-progress__track">
        <div
          className="m3-progress__bar"
          style={indeterminate ? undefined : { width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

M3Progress.displayName = 'M3Progress';

export default M3Progress;
