/**
 * M3 Expressive Skeleton Component
 * Implements Material Design 3 feedback component with M3 styling
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React from 'react';
import './M3Skeleton.css';



export interface M3SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The shape variant of the skeleton
   * @default 'text'
   */
  variant?: 'text' | 'rectangular' | 'circular';

  /**
   * Width of the skeleton (number = px, string = any CSS unit)
   */
  width?: string | number;

  /**
   * Height of the skeleton (number = px, string = any CSS unit)
   */
  height?: string | number;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Skeleton component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Skeleton variant="text" width={200} height={20} />
 * <M3Skeleton variant="circular" width={40} height={40} />
 * <M3Skeleton variant="rectangular" width="100%" height={200} />
 * ```
 */
export const M3Skeleton = React.forwardRef<HTMLDivElement, M3SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-skeleton',
      `m3-skeleton--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inlineStyles: React.CSSProperties = {
      ...style,
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
      <div
        ref={ref}
        className={classNames}
        style={inlineStyles}
        data-testid="m3-skeleton"
        aria-busy="true"
        aria-live="polite"
        {...props}
      />
    );
  }
);

M3Skeleton.displayName = 'M3Skeleton';

export default M3Skeleton;
