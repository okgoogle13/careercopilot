/**
 * M3 Expressive Tooltip Component
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
import './M3Tooltip.css';



export interface M3TooltipProps extends React.divAttributes<HTMLDivElement> {
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
 * M3 Expressive Tooltip component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Tooltip variant="filled" color="primary">
 *   Feedback Message
 * </M3Tooltip>
 * ```
 */
export const M3Tooltip = React.forwardRef<HTMLDivElement, M3TooltipProps>(
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
      'm3-tooltip',
      `m3-tooltip--${variant}`,
      `m3-tooltip--${color}`,
      `m3-tooltip--${size}`,
      disabled && 'm3-tooltip--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        disabled={disabled}
        data-testid="m3-tooltip"
        {...props}
      >
        {children}
      </div>
    );
  }
);

M3Tooltip.displayName = 'M3Tooltip';

export default M3Tooltip;
