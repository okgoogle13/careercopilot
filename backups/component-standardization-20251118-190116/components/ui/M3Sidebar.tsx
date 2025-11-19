/**
 * M3 Expressive Sidebar Component
 * Implements Material Design 3 navigation sidebar with collapse functionality
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React, { useState, useCallback } from 'react';
import './M3Sidebar.css';

export interface M3SidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Sidebar variant
   * @default 'standard'
   */
  variant?: 'standard' | 'rail';

  /**
   * Position on screen
   * @default 'left'
   */
  position?: 'left' | 'right';

  /**
   * Collapsed state (controlled)
   */
  collapsed?: boolean;

  /**
   * Default collapsed state (uncontrolled)
   */
  defaultCollapsed?: boolean;

  /**
   * Callback when collapse state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Width when expanded
   * @default '280px'
   */
  width?: string;

  /**
   * Width when collapsed
   * @default '80px'
   */
  collapsedWidth?: string;

  /**
   * Header content (logo, title, etc.)
   */
  header?: React.ReactNode;

  /**
   * Footer content
   */
  footer?: React.ReactNode;

  /**
   * Navigation items
   */
  children?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

export interface M3SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Item label
   */
  label: string;

  /**
   * Optional icon
   */
  icon?: React.ReactNode;

  /**
   * Active state
   */
  active?: boolean;

  /**
   * Badge count or text
   */
  badge?: number | string;
}

/**
 * M3 Expressive Sidebar component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Sidebar
 *   header={<Logo />}
 *   collapsed={collapsed}
 *   onCollapsedChange={setCollapsed}
 * >
 *   <M3SidebarItem label="Dashboard" icon={<Icon />} active />
 *   <M3SidebarItem label="Jobs" icon={<Icon />} badge={5} />
 * </M3Sidebar>
 * ```
 */
export const M3Sidebar = React.forwardRef<HTMLElement, M3SidebarProps>(
  (
    {
      variant = 'standard',
      position = 'left',
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      width = '280px',
      collapsedWidth = '80px',
      header,
      footer,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const isControlled = controlledCollapsed !== undefined;
    const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

    const handleToggle = useCallback(() => {
      const newCollapsed = !collapsed;
      if (!isControlled) {
        setInternalCollapsed(newCollapsed);
      }
      onCollapsedChange?.(newCollapsed);
    }, [collapsed, isControlled, onCollapsedChange]);

    const classNames = [
      'm3-sidebar',
      `m3-sidebar--${variant}`,
      `m3-sidebar--${position}`,
      collapsed && 'm3-sidebar--collapsed',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const sidebarStyle = {
      width: collapsed ? collapsedWidth : width,
    };

    return (
      <aside
        ref={ref}
        className={classNames}
        style={sidebarStyle}
        data-testid="m3-sidebar"
        {...props}
      >
        {/* Header */}
        {header && (
          <div className="m3-sidebar__header">
            {header}
            <button
              type="button"
              className="m3-sidebar__toggle"
              onClick={handleToggle}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L10 10L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation items */}
        <nav className="m3-sidebar__nav">
          <ul className="m3-sidebar__list">{children}</ul>
        </nav>

        {/* Footer */}
        {footer && <div className="m3-sidebar__footer">{footer}</div>}
      </aside>
    );
  }
);

M3Sidebar.displayName = 'M3Sidebar';

/**
 * Sidebar navigation item
 */
export const M3SidebarItem = React.forwardRef<HTMLAnchorElement, M3SidebarItemProps>(
  (
    {
      label,
      icon,
      active = false,
      badge,
      className = '',
      href = '#',
      ...props
    },
    ref
  ) => {
    const itemClassNames = [
      'm3-sidebar-item',
      active && 'm3-sidebar-item--active',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <li>
        <a
          ref={ref}
          href={href}
          className={itemClassNames}
          aria-current={active ? 'page' : undefined}
          data-testid="m3-sidebar-item"
          {...props}
        >
          {icon && <span className="m3-sidebar-item__icon">{icon}</span>}
          <span className="m3-sidebar-item__label">{label}</span>
          {badge !== undefined && (
            <span className="m3-sidebar-item__badge">{badge}</span>
          )}
        </a>
      </li>
    );
  }
);

M3SidebarItem.displayName = 'M3SidebarItem';

export default M3Sidebar;
