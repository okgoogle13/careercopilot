/**
 * M3 Expressive TabBar Component
 * Implements Material Design 3 TabBar for CareerCopilot
 *
 * Horizontal tab bar with selection indicator. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Tabbar.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import './M3Tabbar.css';

export interface M3TabItem {
  /**
   * Tab label
   */
  label: string;

  /**
   * Tab value/id
   */
  value: string;

  /**
   * Optional icon
   */
  icon?: React.ReactNode;

  /**
   * If true, tab is disabled
   */
  disabled?: boolean;

  /**
   * Badge or notification count
   */
  badge?: string | number;
}

export interface M3TabbarProps {
  /**
   * Tab items
   */
  items: M3TabItem[];

  /**
   * Currently selected tab value
   */
  value?: string;

  /**
   * Default selected tab value (uncontrolled)
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
   * If true, tabs scroll horizontally on overflow
   * @default false
   */
  scrollable?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive TabBar component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Tabbar
 *   items={[
 *     { label: 'Home', value: 'home', icon: <HomeIcon /> },
 *     { label: 'Profile', value: 'profile' },
 *   ]}
 *   value={selectedTab}
 *   onChange={(value) => setSelectedTab(value)}
 * />
 * ```
 */
export const M3Tabbar: React.FC<M3TabbarProps> = ({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  color = 'primary',
  scrollable = false,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue || items[0]?.value || ''
  );
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleTabClick = useCallback(
    (itemValue: string) => {
      if (isControlled) {
        onChange?.(itemValue);
      } else {
        setInternalValue(itemValue);
        onChange?.(itemValue);
      }
    },
    [isControlled, onChange]
  );

  // Update indicator position
  useEffect(() => {
    const activeTab = tabRefs.current.get(currentValue);
    if (activeTab && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      const left = tabRect.left - containerRect.left;
      const width = tabRect.width;

      setIndicatorStyle({
        left: `${left}px`,
        width: `${width}px`,
      });
    }
  }, [currentValue, items]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const enabledItems = items.filter((item) => !item.disabled);
      const currentEnabledIndex = enabledItems.findIndex(
        (item) => item.value === currentValue
      );

      let nextIndex = currentEnabledIndex;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledItems.length - 1;
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = currentEnabledIndex < enabledItems.length - 1 ? currentEnabledIndex + 1 : 0;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = enabledItems.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex >= 0 && nextIndex < enabledItems.length) {
        handleTabClick(enabledItems[nextIndex].value);
        tabRefs.current.get(enabledItems[nextIndex].value)?.focus();
      }
    },
    [currentValue, items, handleTabClick]
  );

  const classNames = [
    'm3-tabbar',
    `m3-tabbar--${color}`,
    scrollable && 'm3-tabbar--scrollable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={containerRef} className={classNames} role="tablist">
      <div className="m3-tabbar__indicator" style={indicatorStyle} />
      {items.map((item, index) => {
        const isActive = item.value === currentValue;
        return (
          <button
            key={item.value}
            ref={(el) => {
              if (el) {
                tabRefs.current.set(item.value, el);
              } else {
                tabRefs.current.delete(item.value);
              }
            }}
            className={[
              'm3-tabbar__tab',
              isActive && 'm3-tabbar__tab--active',
              item.disabled && 'm3-tabbar__tab--disabled',
            ]
              .filter(Boolean)
              .join(' ')}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${item.value}`}
            id={`tab-${item.value}`}
            disabled={item.disabled}
            onClick={() => handleTabClick(item.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={isActive ? 0 : -1}
          >
            {item.icon && <span className="m3-tabbar__icon">{item.icon}</span>}
            <span className="m3-tabbar__label">{item.label}</span>
            {item.badge !== undefined && (
              <span className="m3-tabbar__badge">{item.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

M3Tabbar.displayName = 'M3Tabbar';

export default M3Tabbar;
