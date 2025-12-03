/**
 * M3 Expressive Navbar Component
 * Implements Material Design 3 Navbar for CareerCopilot
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 * - Elevation: --md-sys-elevation-*
 *
 * NOTE: CSS styles (M3Navbar.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useRef, useEffect } from 'react';
import './M3Navbar.css';

export interface M3NavbarMenuItem {
  /**
   * Unique identifier for the menu item
   */
  id: string;

  /**
   * Label text for the menu item
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
   * Click handler for the menu item
   */
  onClick?: (item: M3NavbarMenuItem) => void;
}

export interface M3NavbarUserMenu {
  /**
   * User name or display text
   */
  name: string;

  /**
   * User avatar (image URL or element)
   */
  avatar?: string | React.ReactNode;

  /**
   * User email
   */
  email?: string;

  /**
   * Menu items in the user dropdown
   */
  items: M3NavbarMenuItem[];
}

export interface M3NavbarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  /**
   * Logo/brand element (React node or image URL)
   */
  logo?: React.ReactNode | string;

  /**
   * Brand text to display next to logo
   */
  brand?: string;

  /**
   * Array of navigation menu items
   */
  menuItems?: M3NavbarMenuItem[];

  /**
   * User menu configuration
   */
  userMenu?: M3NavbarUserMenu;

  /**
   * Callback when a menu item is clicked
   */
  onMenuItemClick?: (item: M3NavbarMenuItem) => void;

  /**
   * Callback when a user menu item is clicked
   */
  onUserMenuItemClick?: (item: M3NavbarMenuItem) => void;

  /**
   * If true, show mobile menu button
   * @default true
   */
  showMobileMenu?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Navbar component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Navbar
 *   logo={<LogoIcon />}
 *   brand="CareerCopilot"
 *   menuItems={[
 *     { id: 'home', label: 'Home', path: '/home' },
 *     { id: 'dashboard', label: 'Dashboard', path: '/dashboard' }
 *   ]}
 *   userMenu={{
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     items: [
 *       { id: 'profile', label: 'Profile', path: '/profile' },
 *       { id: 'settings', label: 'Settings', path: '/settings' }
 *     ]
 *   }}
 * />
 * ```
 */
export const M3Navbar = React.forwardRef<HTMLElement, M3NavbarProps>(
  (
    {
      logo,
      brand,
      menuItems = [],
      userMenu,
      onMenuItemClick,
      onUserMenuItemClick,
      showMobileMenu = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close user menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          userMenuRef.current &&
          !userMenuRef.current.contains(event.target as Node)
        ) {
          setUserMenuOpen(false);
        }
      };

      if (userMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [userMenuOpen]);

    const handleMenuItemClick = (item: M3NavbarMenuItem) => {
      if (item.disabled) return;
      item.onClick?.(item);
      onMenuItemClick?.(item);
      setMobileMenuOpen(false);
    };

    const handleUserMenuItemClick = (item: M3NavbarMenuItem) => {
      if (item.disabled) return;
      item.onClick?.(item);
      onUserMenuItemClick?.(item);
      setUserMenuOpen(false);
    };

    const classNames = [
      'm3-navbar',
      mobileMenuOpen && 'm3-navbar--mobile-open',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <nav
        ref={ref}
        className={classNames}
        role="navigation"
        aria-label="Main navigation"
        data-testid="m3-navbar"
        {...props}
      >
        <div className="m3-navbar__container">
          {/* Logo/Brand Section */}
          <div className="m3-navbar__brand">
            {logo && (
              <div className="m3-navbar__logo">
                {typeof logo === 'string' ? (
                  <img src={logo} alt={brand || 'Logo'} />
                ) : (
                  logo
                )}
              </div>
            )}
            {brand && <span className="m3-navbar__brand-text">{brand}</span>}
          </div>

          {/* Desktop Menu Items */}
          {menuItems.length > 0 && (
            <div className="m3-navbar__menu m3-navbar__menu--desktop">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    'm3-navbar__menu-item',
                    item.active && 'm3-navbar__menu-item--active',
                    item.disabled && 'm3-navbar__menu-item--disabled',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleMenuItemClick(item)}
                  disabled={item.disabled}
                  aria-current={item.active ? 'page' : undefined}
                  data-testid={`m3-navbar-menu-item-${item.id}`}
                >
                  {item.icon && (
                    <span className="m3-navbar__menu-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className="m3-navbar__menu-label">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="m3-navbar__menu-badge">{item.badge}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* User Menu */}
          {userMenu && (
            <div className="m3-navbar__user-menu" ref={userMenuRef}>
              <button
                type="button"
                className="m3-navbar__user-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                data-testid="m3-navbar-user-button"
              >
                {userMenu.avatar ? (
                  typeof userMenu.avatar === 'string' ? (
                    <img
                      src={userMenu.avatar}
                      alt={userMenu.name}
                      className="m3-navbar__user-avatar"
                    />
                  ) : (
                    <div className="m3-navbar__user-avatar">
                      {userMenu.avatar}
                    </div>
                  )
                ) : (
                  <div className="m3-navbar__user-avatar m3-navbar__user-avatar--default">
                    {userMenu.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="m3-navbar__user-name">{userMenu.name}</span>
                <span className="m3-navbar__user-chevron" aria-hidden="true">
                  {userMenuOpen ? '▲' : '▼'}
                </span>
              </button>

              {userMenuOpen && (
                <div className="m3-navbar__user-dropdown">
                  {userMenu.email && (
                    <div className="m3-navbar__user-info">
                      <div className="m3-navbar__user-info-name">
                        {userMenu.name}
                      </div>
                      <div className="m3-navbar__user-info-email">
                        {userMenu.email}
                      </div>
                    </div>
                  )}
                  <div className="m3-navbar__user-menu-items">
                    {userMenu.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={[
                          'm3-navbar__user-menu-item',
                          item.disabled && 'm3-navbar__user-menu-item--disabled',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => handleUserMenuItemClick(item)}
                        disabled={item.disabled}
                        data-testid={`m3-navbar-user-menu-item-${item.id}`}
                      >
                        {item.icon && (
                          <span
                            className="m3-navbar__user-menu-icon"
                            aria-hidden="true"
                          >
                            {item.icon}
                          </span>
                        )}
                        <span className="m3-navbar__user-menu-label">
                          {item.label}
                        </span>
                        {item.badge !== undefined && (
                          <span className="m3-navbar__user-menu-badge">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {showMobileMenu && menuItems.length > 0 && (
            <button
              type="button"
              className="m3-navbar__mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
              data-testid="m3-navbar-mobile-toggle"
            >
              <span className="m3-navbar__mobile-toggle-icon">
                {mobileMenuOpen ? '✕' : '☰'}
              </span>
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && mobileMenuOpen && menuItems.length > 0 && (
          <div className="m3-navbar__menu m3-navbar__menu--mobile">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={[
                  'm3-navbar__menu-item',
                  item.active && 'm3-navbar__menu-item--active',
                  item.disabled && 'm3-navbar__menu-item--disabled',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleMenuItemClick(item)}
                disabled={item.disabled}
                aria-current={item.active ? 'page' : undefined}
                data-testid={`m3-navbar-mobile-menu-item-${item.id}`}
              >
                {item.icon && (
                  <span className="m3-navbar__menu-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className="m3-navbar__menu-label">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="m3-navbar__menu-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </nav>
    );
  }
);

M3Navbar.displayName = 'M3Navbar';

export default M3Navbar;
