/**
 * M3 Expressive Sidebar Component
 * Implements Material Design 3 card surface with M3 styling
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3Sidebar.css';



export interface M3SidebarProps extends React.divAttributes<HTMLDivElement> {
  /**
   * The variant to use
   * @default 'filled'
   */
  variant?: 'filled' | 'elevated' | 'outlined';

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
 * M3 Expressive Sidebar component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Sidebar variant="filled" color="primary">
 *   Card Content
 * </M3Sidebar>
 * ```
 */
export const M3Sidebar = React.forwardRef<HTMLDivElement, M3SidebarProps>(
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
      'm3-sidebar',
      `m3-sidebar--${variant}`,
      `m3-sidebar--${color}`,
      `m3-sidebar--${size}`,
      disabled && 'm3-sidebar--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        disabled={disabled}
        data-testid="m3-sidebar"
        {...props}
      >
        {children}
      </div>
    );
  }
);

M3Sidebar.displayName = 'M3Sidebar';

export default M3Sidebar;
