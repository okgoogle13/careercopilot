/**
 * M3 Expressive Spinner Component
 * Implements Material Design 3 Spinner for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Spinner.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';

export interface M3SpinnerProps
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
 * M3 Expressive Spinner component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Spinner>Content</M3Spinner>
 * ```
 */
export const M3Spinner = React.forwardRef<
  HTMLDivElement,
  M3SpinnerProps
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
      'm3-spinner',
      // `m3-spinner--${variant}`,
      // `m3-spinner--${color}`,
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

M3Spinner.displayName = 'M3Spinner';

export default M3Spinner;
