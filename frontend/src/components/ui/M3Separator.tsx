/**
 * M3 Expressive Separator Component
 * Implements Material Design 3 inline separator
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Spacing: --md-sys-spacing-*
 */
import React from 'react';
import './M3Separator.css';

export interface M3SeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Orientation of the separator
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Separator component using design tokens.
 * Used for inline content separation (vs Divider for block-level).
 *
 * Example usage:
 * ```tsx
 * <span>Item 1</span>
 * <M3Separator orientation="vertical" />
 * <span>Item 2</span>
 * ```
 */
export const M3Separator = React.forwardRef<HTMLSpanElement, M3SeparatorProps>(
  (
    {
      orientation = 'vertical',
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-separator',
      `m3-separator--${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span
        ref={ref}
        className={classNames}
        role="separator"
        aria-orientation={orientation}
        data-testid="m3-separator"
        {...props}
      />
    );
  }
);

M3Separator.displayName = 'M3Separator';

export default M3Separator;
