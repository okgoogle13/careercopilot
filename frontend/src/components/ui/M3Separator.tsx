/**
 * M3 Expressive Separator Component
 * Implements Material Design 3 divider with M3 styling
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Spacing: --md-sys-spacing-*
 * - Typography: --md-sys-typescale-*
 */
import React from 'react';
import './M3Separator.css';

export interface M3SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the separator
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Optional text label to display in the separator
   */
  children?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Separator component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Separator />
 * <M3Separator orientation="vertical" />
 * <M3Separator>OR</M3Separator>
 * ```
 */
export const M3Separator = React.forwardRef<HTMLDivElement, M3SeparatorProps>(
  (
    {
      orientation = 'horizontal',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-separator',
      `m3-separator--${orientation}`,
      children && 'm3-separator--with-text',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        role="separator"
        aria-orientation={orientation}
        data-testid="m3-separator"
        {...props}
      >
        {children && <span className="m3-separator__text">{children}</span>}
      </div>
    );
  }
);

M3Separator.displayName = 'M3Separator';

export default M3Separator;
