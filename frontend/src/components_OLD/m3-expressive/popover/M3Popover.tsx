/**
 * M3 Expressive Popover Component
 * Implements Material Design 3 feedback component with M3 styling
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3Popover.css';



export interface M3PopoverProps extends React.divAttributes<HTMLDivElement> {
  /**
   * The variant to use
   * @default 'filled'
   */
  variant?: 'filled' | 'outlined' | 'tonal';

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
 * M3 Expressive Popover component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Popover variant="filled" color="primary">
 *   Feedback Message
 * </M3Popover>
 * ```
 */
export const M3Popover = React.forwardRef<HTMLDivElement, M3PopoverProps>(
  (
    {
      variant = 'filled',
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
      'm3-popover',
      `m3-popover--${variant}`,
      `m3-popover--${color}`,
      `m3-popover--${size}`,
      disabled && 'm3-popover--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        disabled={disabled}
        data-testid="m3-popover"
        {...props}
      >
        {children}
      </div>
    );
  }
);

M3Popover.displayName = 'M3Popover';

export default M3Popover;
