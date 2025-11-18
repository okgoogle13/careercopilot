/**
 * M3 Expressive Skeleton Component
 * Implements Material Design 3 skeleton loading placeholders
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 */
import React from 'react';
import './M3Skeleton.css';

export interface M3SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Skeleton variant
   * @default 'text'
   */
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';

  /**
   * Width of the skeleton
   * @default '100%'
   */
  width?: string | number;

  /**
   * Height of the skeleton
   * @default undefined
   */
  height?: string | number;

  /**
   * If true, the skeleton will animate
   * @default true
   */
  animation?: boolean | 'pulse' | 'wave';

  /**
   * Custom className
   */
  className?: string;

  /**
   * Children (if provided, skeleton wraps children instead of showing placeholder)
   */
  children?: React.ReactNode;
}

/**
 * M3 Expressive Skeleton component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Skeleton variant="text" width="60%" />
 * <M3Skeleton variant="circular" width={40} height={40} />
 * <M3Skeleton variant="rectangular" height={200} />
 * ```
 */
export const M3Skeleton = React.forwardRef<HTMLDivElement, M3SkeletonProps>(
  (
    {
      variant = 'text',
      width = '100%',
      height,
      animation = 'pulse',
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const hasChildren = Boolean(children);

    const classNames = [
      'm3-skeleton',
      `m3-skeleton--${variant}`,
      animation && `m3-skeleton--animation-${animation === true ? 'pulse' : animation}`,
      hasChildren && 'm3-skeleton--with-children',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Default heights for different variants
    const defaultHeights: Record<string, string | undefined> = {
      text: '1em',
      rectangular: undefined,
      circular: width,
      rounded: undefined,
    };

    const computedHeight = height ?? defaultHeights[variant];

    const skeletonStyle: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof computedHeight === 'number' ? `${computedHeight}px` : computedHeight,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={classNames}
        style={skeletonStyle}
        data-testid="m3-skeleton"
        {...props}
      >
        {hasChildren ? children : null}
      </div>
    );
  }
);

M3Skeleton.displayName = 'M3Skeleton';

export default M3Skeleton;
