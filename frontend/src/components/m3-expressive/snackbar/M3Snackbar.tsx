/**
 * M3 Expressive Snackbar Component
 * Implements Material Design 3 Snackbar for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Snackbar.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';

export interface M3SnackbarProps
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
 * M3 Expressive Snackbar component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Snackbar>Content</M3Snackbar>
 * ```
 */
export const M3Snackbar = React.forwardRef<
  HTMLDivElement,
  M3SnackbarProps
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
      'm3-snackbar',
      // `m3-snackbar--${variant}`,
      // `m3-snackbar--${color}`,
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

M3Snackbar.displayName = 'M3Snackbar';

export default M3Snackbar;
