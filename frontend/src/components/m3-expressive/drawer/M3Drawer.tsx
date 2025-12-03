/**
 * M3 Expressive Drawer Component
 * Implements Material Design 3 Drawer for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Drawer.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';

export interface M3DrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * [Add your variant prop]
   * @default 'default'
   */
  // variant?: 'default' | 'variant2';

  /**
   * [Add your color prop]
   * @default 'primary'
   */
  // color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Component content
   */
  children?: React.ReactNode;
}

/**
 * M3 Expressive Drawer component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Drawer>Content</M3Drawer>
 * ```
 */
export const M3Drawer = React.forwardRef<
  HTMLDivElement,
  M3DrawerProps
>(
  (
    {
      // variant = 'default',
      // color = 'primary',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-drawer',
      // `m3-drawer--${variant}`,
      // `m3-drawer--${color}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        {...props}
      >
        {children}
      </div>
    );
  }
);

M3Drawer.displayName = 'M3Drawer';

export default M3Drawer;
