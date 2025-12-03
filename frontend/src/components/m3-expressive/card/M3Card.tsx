/**
 * M3 Expressive Card Component
 * Implements Material Design 3 Card for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Card.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Card.css';

export interface M3CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Elevation level (0-5)
   * @default 'level0'
   */
  elevation?: 'level0' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5';

  /**
   * If true, card is clickable (adds pointer cursor and hover elevation)
   * @default false
   */
  clickable?: boolean;

  /**
   * Component content
   */
  children?: React.ReactNode;
}

/**
 * M3 Expressive Card component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Card>Content</M3Card>
 * <M3Card elevation="level2" clickable>Clickable Card</M3Card>
 * ```
 */
export const M3Card = React.forwardRef<
  HTMLDivElement,
  M3CardProps
>(
  (
    {
      elevation = 'level0',
      clickable = false,
      className = '',
      children,
      role,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-card',
      `m3-card--elevation-${elevation}`,
      clickable && 'm3-card--clickable',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const cardRole = role || (clickable ? 'button' : undefined);

    return (
      <div
        ref={ref}
        className={classNames}
        role={cardRole}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

M3Card.displayName = 'M3Card';

export default M3Card;
