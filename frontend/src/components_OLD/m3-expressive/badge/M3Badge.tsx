/**
 * M3 Expressive Badge Component
 * Implements Material Design 3 Badge for CareerCopilot
 *
 * Overlay indicator for notifications and counts. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Badge.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Badge.css';

export interface M3BadgeProps {
  /**
   * Badge content (number, text, or icon)
   */
  children?: React.ReactNode;

  /**
   * Badge value (if provided, overrides children)
   */
  value?: string | number;

  /**
   * Maximum value to display (shows "99+" if exceeded)
   */
  max?: number;

  /**
   * Badge variant
   * @default 'standard'
   */
  variant?: 'standard' | 'dot';

  /**
   * Color role from M3 palette
   * @default 'error'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * If true, badge is invisible (but still takes up space)
   * @default false
   */
  invisible?: boolean;

  /**
   * Badge anchor element (the element to attach badge to)
   */
  anchor?: React.ReactElement;

  /**
   * Badge position relative to anchor
   * @default 'top-right'
   */
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Badge component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Badge value={5}>
 *   <button>Notifications</button>
 * </M3Badge>
 * <M3Badge variant="dot" anchor={<IconButton><BellIcon /></IconButton>} />
 * ```
 */
export const M3Badge: React.FC<M3BadgeProps> = ({
  children,
  value,
  max = 99,
  variant = 'standard',
  color = 'error',
  invisible = false,
  anchor,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  className = '',
}) => {
  const displayValue = React.useMemo(() => {
    if (value === undefined) return null;
    if (typeof value === 'number' && value > max) {
      return `${max}+`;
    }
    return String(value);
  }, [value, max]);

  const classNames = [
    'm3-badge',
    `m3-badge--${variant}`,
    `m3-badge--${color}`,
    `m3-badge--${anchorOrigin.vertical}-${anchorOrigin.horizontal}`,
    invisible && 'm3-badge--invisible',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (anchor) {
    return (
      <span className="m3-badge-wrapper">
        {React.cloneElement(anchor, {
          className: `${anchor.props.className || ''} m3-badge__anchor`.trim(),
        })}
        {!invisible && (
          <span className={classNames} role="status" aria-live="polite">
            {variant === 'dot' ? null : displayValue || children}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={classNames} role="status" aria-live="polite">
      {variant === 'dot' ? null : displayValue || children}
    </span>
  );
};

M3Badge.displayName = 'M3Badge';

export default M3Badge;
