/**
 * M3 Expressive Progress Component
 * Implements Material Design 3 progress indicators with M3 styling
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3Progress.css';

export interface M3ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  /**
   * The type of progress indicator
   * @default 'linear'
   */
  type?: 'linear' | 'circular';

  /**
   * The color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * The size of the component
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Progress value (0-100). If not provided, shows indeterminate state.
   */
  value?: number;

  /**
   * Show percentage label
   * @default false
   */
  showLabel?: boolean;

  /**
   * Custom label text (overrides percentage)
   */
  label?: string;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Progress component using design tokens.
 *
 * Example usage:
 * <M3Progress type="linear" value={75} showLabel />
 * <M3Progress type="circular" value={50} color="secondary" />
 * <M3Progress type="linear" /> // Indeterminate
 */
export const M3Progress = React.forwardRef<HTMLDivElement, M3ProgressProps>(
  (
    {
      type = 'linear',
      color = 'primary',
      size = 'medium',
      value,
      showLabel = false,
      label,
      className = '',
      ...props
    },
    ref
  ) => {
    const isIndeterminate = value === undefined;
    const clampedValue = value !== undefined ? Math.min(100, Math.max(0, value)) : 0;

    const classNames = [
      'm3-progress',
      `m3-progress--${type}`,
      `m3-progress--${color}`,
      `m3-progress--${size}`,
      isIndeterminate && 'm3-progress--indeterminate',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Linear progress bar
    if (type === 'linear') {
      return (
        <div
          ref={ref}
          className={classNames}
          role="progressbar"
          aria-valuenow={isIndeterminate ? undefined : clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          data-testid="m3-progress"
          {...props}
        >
          <div className="m3-progress__track">
            <div
              className="m3-progress__indicator"
              style={
                isIndeterminate
                  ? undefined
                  : { transform: `scaleX(${clampedValue / 100})` }
              }
            />
          </div>
          {showLabel && (
            <span className="m3-progress__label">
              {label || `${clampedValue}%`}
            </span>
          )}
        </div>
      );
    }

    // Circular progress indicator
    const circleSize = size === 'small' ? 40 : size === 'large' ? 56 : 48;
    const strokeWidth = size === 'small' ? 3 : size === 'large' ? 5 : 4;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = isIndeterminate
      ? circumference * 0.25
      : circumference * (1 - clampedValue / 100);

    return (
      <div
        ref={ref}
        className={classNames}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        data-testid="m3-progress"
        {...props}
      >
        <svg
          className="m3-progress__svg"
          width={circleSize}
          height={circleSize}
          viewBox={`0 0 ${circleSize} ${circleSize}`}
        >
          {/* Track circle */}
          <circle
            className="m3-progress__track-circle"
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            className="m3-progress__indicator-circle"
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
          />
        </svg>
        {showLabel && (
          <span className="m3-progress__label m3-progress__label--circular">
            {label || `${clampedValue}%`}
          </span>
        )}
      </div>
    );
  }
);

M3Progress.displayName = 'M3Progress';

export default M3Progress;
