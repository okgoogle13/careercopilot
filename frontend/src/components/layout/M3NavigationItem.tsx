/**
 * M3 Expressive NavigationItem Component
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
import './M3NavigationItem.css';



export interface M3NavigationItemProps extends React.buttonAttributes<HTMLButtonElement> {
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
 * M3 Expressive NavigationItem component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3NavigationItem variant="filled" color="primary">
 *   Click Me
 * </M3NavigationItem>
 * ```
 */
export const M3NavigationItem = React.forwardRef<HTMLButtonElement, M3NavigationItemProps>(
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
      'm3-navigation-item',
      `m3-navigation-item--${variant}`,
      `m3-navigation-item--${color}`,
      `m3-navigation-item--${size}`,
      disabled && 'm3-navigation-item--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled}
        data-testid="m3-navigation-item"
        {...props}
      >
        {children}
      </button>
    );
  }
);

M3NavigationItem.displayName = 'M3NavigationItem';

export default M3NavigationItem;
