/**
 * M3 Expressive Button Component
 * Demonstrates Material Design 3 Expressive styling with design tokens
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-primary-*, --md-sys-color-secondary-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-duration-*, --md-sys-motion-easing-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 * - State: --md-sys-state-*
 */
import React from 'react';
import './M3Button.css';

export interface M3ButtonProps {
  /**
   * The variant to use
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined' | 'text' | 'tonal' | 'elevated';
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
   * If `true`, the button will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  /**
   * If `true`, the button will be disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the button will show a loading indicator
   * @default false
   */
  loading?: boolean;
  /**
   * The type of the button
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Icon to display before button text
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display after button text
   */
  endIcon?: React.ReactNode;
  /**
   * The content of the button
   */
  children: React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Callback fired when the button is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * M3 Expressive Button component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Button variant="filled" color="primary">
 *   Click Me
 * </M3Button>
 *
 * <M3Button variant="tonal" color="secondary" startIcon={<Icon />}>
 *   With Icon
 * </M3Button>
 * ```
 */
export const M3Button = React.forwardRef<HTMLButtonElement, M3ButtonProps>(
  (
    {
      variant = 'filled',
      color = 'primary',
      size = 'medium',
      fullWidth = false,
      disabled = false,
      loading = false,
      type = 'button',
      startIcon,
      endIcon,
      children,
      className = '',
      onClick,
    },
    ref
  ) => {
    const classNames = [
      'm3-button',
      `m3-button--${variant}`,
      `m3-button--${color}`,
      `m3-button--${size}`,
      fullWidth && 'm3-button--full-width',
      disabled && 'm3-button--disabled',
      loading && 'm3-button--loading',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={disabled || loading}
        onClick={onClick}
        data-testid="m3-button"
      >
        {(loading || startIcon) && (
          <span className="m3-button__icon m3-button__icon--start">
            {loading ? (
              <span className="m3-button__spinner" aria-label="Loading" />
            ) : (
              startIcon
            )}
          </span>
        )}
        <span className="m3-button__label">{children}</span>
        {endIcon && !loading && (
          <span className="m3-button__icon m3-button__icon--end">{endIcon}</span>
        )}
      </button>
    );
  }
);

M3Button.displayName = 'M3Button';

export default M3Button;
