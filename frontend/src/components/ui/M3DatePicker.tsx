/**
 * M3 Expressive DatePicker Component
 * Implements Material Design 3 text input with M3 styling
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3DatePicker.css';



export interface M3DatePickerProps extends React.inputAttributes<HTMLInputElement> {
  /**
   * The variant to use
   * @default 'outlined'
   */
  variant?: 'outlined' | 'filled';

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
   * If true, component is disabled
   * @default false
   */
  disabled?: boolean;

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
 * M3 Expressive DatePicker component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3DatePicker variant="outlined" color="primary">
 *   
 * </M3DatePicker>
 * ```
 */
export const M3DatePicker = React.forwardRef<HTMLInputElement, M3DatePickerProps>(
  (
    {
      variant = 'outlined',
      color = 'primary',
      size = 'medium',
      disabled = false,
      children,
      className = '',
      
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-date-picker',
      `m3-date-picker--${variant}`,
      `m3-date-picker--${color}`,
      `m3-date-picker--${size}`,
      disabled && 'm3-date-picker--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <input
        ref={ref}
        className={classNames}
        disabled={disabled}
        data-testid="m3-date-picker"
        {...props}
      >
        {children}
      </input>
    );
  }
);

M3DatePicker.displayName = 'M3DatePicker';

export default M3DatePicker;
