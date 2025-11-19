/**
 * M3 Expressive Container Component
 * Implements Material Design 3 responsive container with max-width breakpoints
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 */
import React from 'react';
import './M3Container.css';

export interface M3ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width breakpoint
   * @default 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | false;

  /**
   * Disable horizontal padding
   * @default false
   */
  disableGutters?: boolean;

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
 * M3 Expressive Container component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Container maxWidth="lg">
 *   <h1>Page Content</h1>
 * </M3Container>
 * ```
 */
export const M3Container = React.forwardRef<HTMLDivElement, M3ContainerProps>(
  (
    {
      maxWidth = 'lg',
      disableGutters = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-container',
      maxWidth !== false && `m3-container--${maxWidth}`,
      disableGutters && 'm3-container--no-gutters',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        data-testid="m3-container"
        {...props}
      >
        {children}
      </div>
    );
  }
);

M3Container.displayName = 'M3Container';

export default M3Container;
