/**
 * M3 Expressive ListItem Component
 * Implements Material Design 3 ListItem for CareerCopilot
 *
 * Individual row/item component for lists. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Listitem.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Listitem.css';

export interface M3ListitemProps {
  /**
   * List item content
   */
  children?: React.ReactNode;

  /**
   * Primary text/label
   */
  primary?: React.ReactNode;

  /**
   * Secondary text/description
   */
  secondary?: React.ReactNode;

  /**
   * Leading element (avatar, icon, etc.)
   */
  leading?: React.ReactNode;

  /**
   * Trailing element (icon, button, etc.)
   */
  trailing?: React.ReactNode;

  /**
   * If true, item is clickable
   * @default false
   */
  clickable?: boolean;

  /**
   * If true, item is selected
   * @default false
   */
  selected?: boolean;

  /**
   * If true, item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Internal prop: if true, this is the last item (used by M3List)
   */
  isLast?: boolean;
}

/**
 * M3 Expressive ListItem component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3ListItem
 *   primary="Item Title"
 *   secondary="Item description"
 *   leading={<Avatar />}
 *   trailing={<IconButton />}
 *   clickable
 * />
 * ```
 */
export const M3Listitem: React.FC<M3ListitemProps> = ({
  children,
  primary,
  secondary,
  leading,
  trailing,
  clickable = false,
  selected = false,
  disabled = false,
  onClick,
  className = '',
  isLast = false,
}) => {
  const classNames = [
    'm3-listitem',
    clickable && 'm3-listitem--clickable',
    selected && 'm3-listitem--selected',
    disabled && 'm3-listitem--disabled',
    isLast && 'm3-listitem--last',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (!disabled && clickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && clickable) {
      e.preventDefault();
      onClick?.();
    }
  };

  const Component = clickable ? 'button' : 'li';

  return (
    <Component
      className={classNames}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      role={clickable ? 'button' : 'listitem'}
      tabIndex={clickable && !disabled ? 0 : undefined}
      aria-selected={selected}
      aria-disabled={disabled}
    >
      {leading && <div className="m3-listitem__leading">{leading}</div>}
      <div className="m3-listitem__content">
        {children || (
          <>
            {primary && <div className="m3-listitem__primary">{primary}</div>}
            {secondary && <div className="m3-listitem__secondary">{secondary}</div>}
          </>
        )}
      </div>
      {trailing && <div className="m3-listitem__trailing">{trailing}</div>}
    </Component>
  );
};

M3Listitem.displayName = 'M3Listitem';

export default M3Listitem;
