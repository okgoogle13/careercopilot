/**
 * M3 Expressive Select Component
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
import './M3Select.css';



export interface M3SelectProps extends React.inputAttributes<HTMLInputElement> {
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
 * M3 Expressive Select component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Select variant="outlined" color="primary">
 *   
 * </M3Select>
 * ```
 */
export const M3Select = React.forwardRef<HTMLInputElement, M3SelectProps>(
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
      'm3-select',
      `m3-select--${variant}`,
      `m3-select--${color}`,
      `m3-select--${size}`,
      disabled && 'm3-select--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <input
        ref={ref}
        className={classNames}
        disabled={disabled}
        data-testid="m3-select"
        {...props}
      >
        {children}
      </input>
    );
  }
);

M3Select.displayName = 'M3Select';

export default M3Select;
