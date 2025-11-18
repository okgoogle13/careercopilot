/**
 * M3 Expressive Menu Component
 * Implements Material Design 3 dropdown menu with actions
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Elevation: --md-sys-elevation-*
 * - Typography: --md-sys-typescale-*
 * - Spacing: --md-sys-spacing-*
 * - Motion: --md-sys-motion-*
 */
import React, { useState, useRef, useEffect } from 'react';
import './M3Menu.css';

export interface M3MenuItem {
  /**
   * Menu item label
   */
  label: string;

  /**
   * Menu item value/id
   */
  value: string;

  /**
   * Icon element
   */
  icon?: React.ReactNode;

  /**
   * If true, item is disabled
   */
  disabled?: boolean;

  /**
   * If true, shows divider after item
   */
  divider?: boolean;

  /**
   * Click handler for this item
   */
  onClick?: () => void;
}

export interface M3MenuProps {
  /**
   * Menu items
   */
  items: M3MenuItem[];

  /**
   * Trigger element (button, icon, etc.)
   */
  trigger: React.ReactNode;

  /**
   * Menu position relative to trigger
   * @default 'bottom-start'
   */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

  /**
   * If true, menu is open (controlled)
   */
  open?: boolean;

  /**
   * Open state change handler
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Menu item selection handler
   */
  onSelect?: (value: string) => void;

  /**
   * Custom className
   */
  className?: string;

  /**
   * If true, menu closes on item click
   * @default true
   */
  closeOnSelect?: boolean;
}

/**
 * M3 Expressive Menu component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Menu
 *   trigger={<button>Open Menu</button>}
 *   items={[
 *     { label: 'Edit', value: 'edit', icon: <Icon /> },
 *     { label: 'Delete', value: 'delete', divider: true }
 *   ]}
 *   onSelect={(value) => console.log(value)}
 * />
 * ```
 */
export const M3Menu: React.FC<M3MenuProps> = ({
  items,
  trigger,
  placement = 'bottom-start',
  open: controlledOpen,
  onOpenChange,
  onSelect,
  className = '',
  closeOnSelect = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const handleTriggerClick = () => {
    setOpen(!open);
    if (!open) {
      setFocusedIndex(0);
    }
  };

  const handleItemClick = (item: M3MenuItem) => {
    if (item.disabled) return;

    item.onClick?.();
    onSelect?.(item.value);

    if (closeOnSelect) {
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    const enabledItems = items.filter((item) => !item.disabled);

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < items.length) {
          handleItemClick(items[focusedIndex]);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev + 1;
          while (next < items.length && items[next].disabled) {
            next++;
          }
          return next < items.length ? next : prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && items[next].disabled) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const getPlacementStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    switch (placement) {
      case 'top':
        styles.bottom = '100%';
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        styles.marginBottom = 'var(--md-sys-spacing-1)';
        break;
      case 'bottom':
        styles.top = '100%';
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        styles.marginTop = 'var(--md-sys-spacing-1)';
        break;
      case 'left':
        styles.right = '100%';
        styles.top = '50%';
        styles.transform = 'translateY(-50%)';
        styles.marginRight = 'var(--md-sys-spacing-1)';
        break;
      case 'right':
        styles.left = '100%';
        styles.top = '50%';
        styles.transform = 'translateY(-50%)';
        styles.marginLeft = 'var(--md-sys-spacing-1)';
        break;
      case 'bottom-start':
        styles.top = '100%';
        styles.left = '0';
        styles.marginTop = 'var(--md-sys-spacing-1)';
        break;
      case 'bottom-end':
        styles.top = '100%';
        styles.right = '0';
        styles.marginTop = 'var(--md-sys-spacing-1)';
        break;
      case 'top-start':
        styles.bottom = '100%';
        styles.left = '0';
        styles.marginBottom = 'var(--md-sys-spacing-1)';
        break;
      case 'top-end':
        styles.bottom = '100%';
        styles.right = '0';
        styles.marginBottom = 'var(--md-sys-spacing-1)';
        break;
    }

    return styles;
  };

  const classNames = [
    'm3-menu',
    open && 'm3-menu--open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} ref={menuRef} data-testid="m3-menu">
      <div
        ref={triggerRef}
        className="m3-menu__trigger"
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="m3-menu__dropdown"
          style={getPlacementStyles()}
          role="menu"
          data-testid="m3-menu-dropdown"
        >
          {items.map((item, index) => (
            <React.Fragment key={item.value}>
              <div
                className={[
                  'm3-menu__item',
                  item.disabled && 'm3-menu__item--disabled',
                  focusedIndex === index && 'm3-menu__item--focused',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleItemClick(item)}
                role="menuitem"
                aria-disabled={item.disabled}
                tabIndex={-1}
              >
                {item.icon && <span className="m3-menu__item-icon">{item.icon}</span>}
                <span className="m3-menu__item-label">{item.label}</span>
              </div>
              {item.divider && <div className="m3-menu__divider" role="separator" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

M3Menu.displayName = 'M3Menu';

export default M3Menu;
