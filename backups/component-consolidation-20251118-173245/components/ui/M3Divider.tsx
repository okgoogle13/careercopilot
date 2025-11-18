/**
 * M3 Expressive Divider Component
 * Implements Material Design 3 horizontal and vertical dividers
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Spacing: --md-sys-spacing-*
 */
import React from 'react';
import './M3Divider.css';

export interface M3DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /**
   * Divider orientation
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Divider style variant
   * @default 'fullWidth'
   */
  variant?: 'fullWidth' | 'inset' | 'middle';

  /**
   * If true, adds extra margin
   * @default false
   */
  flexItem?: boolean;

  /**
   * Text content to display in divider
   */
  children?: React.ReactNode;

  /**
   * Text alignment when children present
   * @default 'center'
   */
  textAlign?: 'left' | 'center' | 'right';

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Divider component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Divider />
 * <M3Divider orientation="vertical" />
 * <M3Divider>OR</M3Divider>
 * ```
 */
export const M3Divider = React.forwardRef<HTMLHRElement, M3DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'fullWidth',
      flexItem = false,
      children,
      textAlign = 'center',
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'm3-divider',
      `m3-divider--${orientation}`,
      `m3-divider--${variant}`,
      flexItem && 'm3-divider--flex-item',
      children && 'm3-divider--with-text',
      children && `m3-divider--text-${textAlign}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if (children) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={classNames}
          role="separator"
          data-testid="m3-divider"
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        >
          <span className="m3-divider__text">{children}</span>
        </div>
      );
    }

    return (
      <hr
        ref={ref}
        className={classNames}
        data-testid="m3-divider"
        {...props}
      />
    );
  }
);

M3Divider.displayName = 'M3Divider';

export default M3Divider;
