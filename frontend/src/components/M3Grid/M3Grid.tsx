/**
 * M3 Expressive Grid Component
 * Implements Material Design 3 responsive 12-column grid system
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Spacing: --md-sys-spacing-*
 */
import React from 'react';
import './M3Grid.css';

export interface M3GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, the component is a grid container
   * @default false
   */
  container?: boolean;

  /**
   * If true, the component is a grid item
   * @default false
   */
  item?: boolean;

  /**
   * Number of columns to span on extra-small screens (0-600px)
   * @default undefined
   */
  xs?: number;

  /**
   * Number of columns to span on small screens (600-960px)
   * @default undefined
   */
  sm?: number;

  /**
   * Number of columns to span on medium screens (960-1280px)
   * @default undefined
   */
  md?: number;

  /**
   * Number of columns to span on large screens (1280px+)
   * @default undefined
   */
  lg?: number;

  /**
   * Spacing multiplier between grid items (1-8)
   * @default 2
   */
  spacing?: number;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * M3 Expressive Grid component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Grid container spacing={4}>
 *   <M3Grid item xs={12} md={6}>
 *     <div>Content 1</div>
 *   </M3Grid>
 *   <M3Grid item xs={12} md={6}>
 *     <div>Content 2</div>
 *   </M3Grid>
 * </M3Grid>
 * ```
 */
export const M3Grid = React.forwardRef<HTMLDivElement, M3GridProps>(
  (
    {
      container = false,
      item = false,
      xs,
      sm,
      md,
      lg,
      spacing = 2,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-grid',
      container && 'm3-grid--container',
      container && `m3-grid--spacing-${spacing}`,
      item && 'm3-grid--item',
      xs !== undefined && `m3-grid--xs-${xs}`,
      sm !== undefined && `m3-grid--sm-${sm}`,
      md !== undefined && `m3-grid--md-${md}`,
      lg !== undefined && `m3-grid--lg-${lg}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        data-testid="m3-grid"
        {...props}
      >
        {children}
      </div>
    );
  }
);

M3Grid.displayName = 'M3Grid';

export default M3Grid;
