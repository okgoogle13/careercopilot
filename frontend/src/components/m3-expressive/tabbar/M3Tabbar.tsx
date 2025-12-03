/**
 * M3 Expressive Tabbar Component
 * Implements Material Design 3 Tabbar for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Tabbar.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';

export interface M3TabbarProps
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
 * M3 Expressive Tabbar component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Tabbar>Content</M3Tabbar>
 * ```
 */
export const M3Tabbar = React.forwardRef<
  HTMLDivElement,
  M3TabbarProps
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
      'm3-tabbar',
      // `m3-tabbar--${variant}`,
      // `m3-tabbar--${color}`,
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

M3Tabbar.displayName = 'M3Tabbar';

export default M3Tabbar;
