/**
 * M3 Expressive Stepper Component
 * Implements Material Design 3 Stepper for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Stepper.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';

export interface M3StepperProps
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
 * M3 Expressive Stepper component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Stepper>Content</M3Stepper>
 * ```
 */
export const M3Stepper = React.forwardRef<
  HTMLDivElement,
  M3StepperProps
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
      'm3-stepper',
      // `m3-stepper--${variant}`,
      // `m3-stepper--${color}`,
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

M3Stepper.displayName = 'M3Stepper';

export default M3Stepper;
