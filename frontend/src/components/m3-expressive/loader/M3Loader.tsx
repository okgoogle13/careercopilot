/**
 * M3 Expressive Loader Component
 * Implements Material Design 3 Loader for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Loader.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';

export interface M3LoaderProps
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
 * M3 Expressive Loader component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Loader>Content</M3Loader>
 * ```
 */
export const M3Loader = React.forwardRef<
  HTMLDivElement,
  M3LoaderProps
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
      'm3-loader',
      // `m3-loader--${variant}`,
      // `m3-loader--${color}`,
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

M3Loader.displayName = 'M3Loader';

export default M3Loader;
