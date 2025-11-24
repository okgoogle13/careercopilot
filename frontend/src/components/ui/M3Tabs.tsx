/**
 * M3 Expressive Tabs Component
 * Implements Material Design 3 button with M3 styling
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3Tabs.css';



export interface M3TabsProps extends React.buttonAttributes<HTMLButtonElement> {
  /**
   * The variant to use
   * @default 'filled'
   */
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';

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
 * M3 Expressive Tabs component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Tabs variant="filled" color="primary">
 *   Click Me
 * </M3Tabs>
 * ```
 */
export const M3Tabs = React.forwardRef<HTMLButtonElement, M3TabsProps>(
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
      'm3-tabs',
      `m3-tabs--${variant}`,
      `m3-tabs--${color}`,
      `m3-tabs--${size}`,
      disabled && 'm3-tabs--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled}
        data-testid="m3-tabs"
        {...props}
      >
        {children}
      </button>
    );
  }
);

M3Tabs.displayName = 'M3Tabs';

export default M3Tabs;
