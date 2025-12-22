/**
 * M3 Expressive Sidebar Component
 * Implements Material Design 3 navigation sidebar with M3 styling
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

export interface M3SidebarNavItem {
  /**
   * Unique identifier for the nav item
   */
  id: string;

  /**
   * Label text for the nav item
   */
  label: string;

  /**
   * Icon element to display
   */
  icon?: React.ReactNode;

  /**
   * Path or href for navigation
   */
  path?: string;

  /**
   * If true, item is active
   */
  active?: boolean;

  /**
   * If true, item is disabled
   */
  disabled?: boolean;

  /**
   * Badge or notification count
   */
  badge?: string | number;

  /**
   * Nested navigation items (for collapsible sections)
   */
  children?: M3SidebarNavItem[];

  /**
   * Custom data attributes
   */
  'data-testid'?: string;
}

export interface M3SidebarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /**
   * Array of navigation items
   */
  items: M3SidebarNavItem[];

  /**
   * Currently active item ID
   */
  activeItemId?: string;

  /**
   * Callback when a nav item is clicked
   */
  onItemClick?: (item: M3SidebarNavItem, event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * If true, sidebar is collapsed
   * @default false
   */
  collapsed?: boolean;

  /**
   * Width of the sidebar
   * @default '256px'
   */
  width?: string;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Sidebar component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Sidebar
 *   items={[
 *     { id: 'home', label: 'Home', icon: <HomeIcon />, path: '/home' },
 *     { id: 'settings', label: 'Settings', icon: <SettingsIcon />, path: '/settings' }
 *   ]}
 *   activeItemId="home"
 *   onItemClick={(item) => navigate(item.path)}
 * />
 * ```
 */
export const M3Sidebar = React.forwardRef<HTMLDivElement, M3SidebarProps>(
  (
    {
      items,
      activeItemId,
      onItemClick,
      collapsed = false,
      width = '256px',
      className = '',
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const handleItemClick = useCallback(
      (item: M3SidebarNavItem, event: React.MouseEvent<HTMLButtonElement>) => {
        if (item.disabled) return;

        // Toggle expanded state for items with children
        if (item.children && item.children.length > 0) {
          setExpandedItems((prev) => {
            const next = new Set(prev);
            if (next.has(item.id)) {
              next.delete(item.id);
            } else {
              next.add(item.id);
            }
            return next;
          });
        }

        onItemClick?.(item, event);
      },
      [onItemClick]
    );

    const handleKeyDown = useCallback(
      (item: M3SidebarNavItem, event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleItemClick(item, event as unknown as React.MouseEvent<HTMLButtonElement>);
        }
      },
      [handleItemClick]
    );

    const renderNavItem = (item: M3SidebarNavItem, level: number = 0): React.ReactNode => {
      const isActive = activeItemId === item.id || item.active;
      const isExpanded = expandedItems.has(item.id);
      const hasChildren = item.children && item.children.length > 0;

      return (
        <li key={item.id} className="m3-sidebar__nav-item">
          <button
            type="button"
            className={[
              'm3-sidebar__nav-button',
              isActive && 'm3-sidebar__nav-button--active',
              item.disabled && 'm3-sidebar__nav-button--disabled',
              hasChildren && 'm3-sidebar__nav-button--has-children',
              level > 0 && 'm3-sidebar__nav-button--nested',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={(e) => handleItemClick(item, e)}
            onKeyDown={(e) => handleKeyDown(item, e)}
            disabled={item.disabled}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-current={isActive ? 'page' : undefined}
            data-testid={item['data-testid'] || `m3-sidebar-item-${item.id}`}
            data-level={level}
          >
            {item.icon && (
              <span className="m3-sidebar__nav-icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            {!collapsed && (
              <>
                <span className="m3-sidebar__nav-label">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="m3-sidebar__nav-badge">{item.badge}</span>
                )}
                {hasChildren && (
                  <span className="m3-sidebar__nav-chevron" aria-hidden="true">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                )}
              </>
            )}
          </button>
          {hasChildren && isExpanded && !collapsed && (
            <ul className="m3-sidebar__nav-list m3-sidebar__nav-list--nested">
              {item.children!.map((child) => renderNavItem(child, level + 1))}
            </ul>
          )}
        </li>
      );
    };

    const classNames = [
      'm3-sidebar',
      collapsed && 'm3-sidebar--collapsed',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <nav
        ref={ref}
        className={classNames}
        style={{ width: collapsed ? '64px' : width }}
        aria-label="Main navigation"
        data-testid="m3-sidebar"
        {...props}
      >
        <ul className="m3-sidebar__nav-list">
          {items.map((item) => renderNavItem(item))}
        </ul>
      </nav>
    );
  }
);

M3Sidebar.displayName = 'M3Sidebar';

export default M3Sidebar;
