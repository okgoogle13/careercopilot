/**
 * M3 Expressive Input Component
 * Implements Material Design 3 Input for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Input.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Input.css';

export interface M3InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input variant style
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined';

  /**
   * Color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * If true, input is in error state
   * @default false
   */
  error?: boolean;

  /**
   * Helper text to display below the input
   */
  helperText?: string;

  /**
   * Label text for the input
   */
  label?: string;
}

/**
 * M3 Expressive Input component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Input variant="filled" color="primary" placeholder="Enter text" />
 * <M3Input variant="outlined" type="email" label="Email" />
 * <M3Input error helperText="This field is required" />
 * ```
 */
export const M3Input = React.forwardRef<
  HTMLInputElement,
  M3InputProps
>(
  (
    {
      variant = 'filled',
      color = 'primary',
      size = 'medium',
      error = false,
      helperText,
      label,
      className = '',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-input',
      `m3-input--${variant}`,
      `m3-input--${color}`,
      `m3-input--${size}`,
      error && 'm3-input--error',
      disabled && 'm3-input--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputId = props.id || `m3-input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="m3-input-wrapper">
        {label && (
          <label htmlFor={inputId} className="m3-input__label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={classNames}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {helperText && (
          <span
            id={`${inputId}-helper`}
            className={`m3-input__helper ${error ? 'm3-input__helper--error' : ''}`}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

M3Input.displayName = 'M3Input';

export default M3Input;
