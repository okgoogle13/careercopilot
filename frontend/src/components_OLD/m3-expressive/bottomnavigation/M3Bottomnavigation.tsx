/**
 * M3 Expressive BottomNavigation Component
 * Implements Material Design 3 BottomNavigation for CareerCopilot
 *
 * Mobile navigation bar at the bottom of the screen. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Bottomnavigation.css) must be imported in the application root
 * or in pages that use this component.
 */

import React from 'react';
import './M3Bottomnavigation.css';

export interface M3BottomNavigationItem {
  /**
   * Item label
   */
  label: string;

  /**
   * Item value/id
   */
  value: string;

  /**
   * Item icon
   */
  icon: React.ReactNode;

  /**
   * Optional badge or notification count
   */
  badge?: string | number;

  /**
   * If true, item is disabled
   */
  disabled?: boolean;
}

export interface M3BottomnavigationProps {
  /**
   * Navigation items
   */
  items: M3BottomNavigationItem[];

  /**
   * Currently selected item value
   */
  value?: string;

  /**
   * Default selected item value (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Change handler
   */
  onChange?: (value: string) => void;

  /**
   * Color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive BottomNavigation component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Bottomnavigation
 *   items={[
 *     { label: 'Home', value: 'home', icon: <HomeIcon /> },
 *     { label: 'Search', value: 'search', icon: <SearchIcon /> },
 *     { label: 'Profile', value: 'profile', icon: <ProfileIcon /> },
 *   ]}
 *   value={selectedValue}
 *   onChange={(value) => setSelectedValue(value)}
 * />
 * ```
 */
export const M3Bottomnavigation: React.FC<M3BottomnavigationProps> = ({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  color = 'primary',
  className = '',
}) => {
  const [internalValue, setInternalValue] = React.useState<string>(
    defaultValue || items[0]?.value || ''
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleItemClick = (itemValue: string) => {
    if (isControlled) {
      onChange?.(itemValue);
    } else {
      setInternalValue(itemValue);
      onChange?.(itemValue);
    }
  };

  const classNames = [
    'm3-bottomnavigation',
    `m3-bottomnavigation--${color}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={classNames} role="tablist" aria-label="Bottom navigation">
      {items.map((item) => {
        const isActive = item.value === currentValue;
        return (
          <button
            key={item.value}
            className={[
              'm3-bottomnavigation__item',
              isActive && 'm3-bottomnavigation__item--active',
              item.disabled && 'm3-bottomnavigation__item--disabled',
            ]
              .filter(Boolean)
              .join(' ')}
            role="tab"
            aria-selected={isActive}
            aria-label={item.label}
            disabled={item.disabled}
            onClick={() => handleItemClick(item.value)}
            tabIndex={isActive ? 0 : -1}
          >
            <div className="m3-bottomnavigation__icon-wrapper">
              <span className="m3-bottomnavigation__icon">{item.icon}</span>
              {item.badge !== undefined && (
                <span className="m3-bottomnavigation__badge">{item.badge}</span>
              )}
            </div>
            <span className="m3-bottomnavigation__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

M3Bottomnavigation.displayName = 'M3Bottomnavigation';

export default M3Bottomnavigation;
