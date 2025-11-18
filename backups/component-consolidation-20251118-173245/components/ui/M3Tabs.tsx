/**
 * M3 Expressive Tabs Component
 * Implements Material Design 3 tabs navigation with keyboard support
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React, { useState, useCallback, createContext, useContext } from 'react';
import './M3Tabs.css';

// Context for sharing active tab state
interface TabsContextValue {
  activeTab: string | number;
  onChange: (value: string | number) => void;
  variant: 'primary' | 'secondary';
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface M3TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * The variant style to use
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';

  /**
   * Currently active tab value
   */
  value?: string | number;

  /**
   * Default active tab (for uncontrolled)
   */
  defaultValue?: string | number;

  /**
   * Callback when tab changes
   */
  onChange?: (value: string | number) => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Children (M3Tab components)
   */
  children?: React.ReactNode;
}

export interface M3TabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /**
   * Value identifier for this tab
   */
  value: string | number;

  /**
   * Tab label
   */
  label: string;

  /**
   * Optional icon
   */
  icon?: React.ReactNode;

  /**
   * Show badge indicator
   */
  badge?: number | string;
}

/**
 * M3 Expressive Tabs component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Tabs value={activeTab} onChange={setActiveTab}>
 *   <M3Tab value="overview" label="Overview" />
 *   <M3Tab value="details" label="Details" icon={<Icon />} />
 *   <M3Tab value="settings" label="Settings" badge={3} />
 * </M3Tabs>
 * ```
 */
export const M3Tabs = React.forwardRef<HTMLDivElement, M3TabsProps>(
  (
    {
      variant = 'primary',
      value,
      defaultValue,
      onChange,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string | number>(
      defaultValue ?? 0
    );
    const isControlled = value !== undefined;
    const activeTab = isControlled ? value : internalValue;

    const handleChange = useCallback(
      (newValue: string | number) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [isControlled, onChange]
    );

    const classNames = [
      'm3-tabs',
      `m3-tabs--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <TabsContext.Provider value={{ activeTab, onChange: handleChange, variant }}>
        <div
          ref={ref}
          className={classNames}
          role="tablist"
          data-testid="m3-tabs"
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

M3Tabs.displayName = 'M3Tabs';

/**
 * Individual tab component
 */
export const M3Tab = React.forwardRef<HTMLButtonElement, M3TabProps>(
  (
    {
      value,
      label,
      icon,
      badge,
      disabled = false,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const context = useContext(TabsContext);
    if (!context) {
      throw new Error('M3Tab must be used within M3Tabs');
    }

    const { activeTab, onChange, variant } = context;
    const isActive = activeTab === value;

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!disabled) {
          onChange(value);
          onClick?.(event);
        }
      },
      [disabled, onChange, value, onClick]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        // Keyboard navigation handled by native button focus
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!disabled) {
            onChange(value);
          }
        }
      },
      [disabled, onChange, value]
    );

    const tabClassNames = [
      'm3-tab',
      `m3-tab--${variant}`,
      isActive && 'm3-tab--active',
      disabled && 'm3-tab--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-disabled={disabled}
        className={tabClassNames}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        data-testid={`m3-tab-${value}`}
        {...props}
      >
        {icon && <span className="m3-tab__icon">{icon}</span>}
        <span className="m3-tab__label">{label}</span>
        {badge !== undefined && (
          <span className="m3-tab__badge">{badge}</span>
        )}
        {isActive && <span className="m3-tab__indicator" />}
      </button>
    );
  }
);

M3Tab.displayName = 'M3Tab';

export default M3Tabs;
