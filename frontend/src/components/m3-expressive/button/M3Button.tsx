/**
 * M3 Expressive Button Component
 * Implements Material Design 3 button variants for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Button.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';

export interface M3ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant style
   * @default 'filled'
   */
  variant?: 'filled' | 'elevated' | 'outlined' | 'text' | 'tonal';

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
   * Icon element to display at start
   */
  startIcon?: React.ReactNode;

  /**
   * Icon element to display at end
   */
  endIcon?: React.ReactNode;

  /**
   * If true, full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * M3 Expressive Button component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Button variant="filled" color="primary">Click Me</M3Button>
 * <M3Button variant="outlined" size="large" startIcon={<SaveIcon />}>Save</M3Button>
 * <M3Button variant="text" disabled>Disabled</M3Button>
 * ```
 */
export const M3Button = React.forwardRef<
  HTMLButtonElement,
  M3ButtonProps
>(
  (
    {
      variant = 'filled',
      color = 'primary',
      size = 'medium',
      startIcon,
      endIcon,
      fullWidth = false,
      className = '',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-button',
      `m3-button--${variant}`,
      `m3-button--${color}`,
      `m3-button--${size}`,
      fullWidth && 'm3-button--fullWidth',
      disabled && 'm3-button--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled}
        {...props}
      >
        {startIcon && <span className="m3-button__icon m3-button__icon--start">{startIcon}</span>}
        <span className="m3-button__label">{children}</span>
        {endIcon && <span className="m3-button__icon m3-button__icon--end">{endIcon}</span>}
      </button>
    );
  }
);

M3Button.displayName = 'M3Button';

export default M3Button;
