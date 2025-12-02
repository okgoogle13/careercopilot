/**
 * M3 Expressive Breadcrumb Component
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
import './M3Breadcrumb.css';



export interface M3BreadcrumbProps extends React.buttonAttributes<HTMLButtonElement> {
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
 * M3 Expressive Breadcrumb component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Breadcrumb variant="filled" color="primary">
 *   Click Me
 * </M3Breadcrumb>
 * ```
 */
export const M3Breadcrumb = React.forwardRef<HTMLButtonElement, M3BreadcrumbProps>(
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
      'm3-breadcrumb',
      `m3-breadcrumb--${variant}`,
      `m3-breadcrumb--${color}`,
      `m3-breadcrumb--${size}`,
      disabled && 'm3-breadcrumb--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled}
        data-testid="m3-breadcrumb"
        {...props}
      >
        {children}
      </button>
    );
  }
);

M3Breadcrumb.displayName = 'M3Breadcrumb';

export default M3Breadcrumb;
