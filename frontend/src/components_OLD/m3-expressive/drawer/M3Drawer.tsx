/**
 * M3 Expressive Drawer Component
 * Implements Material Design 3 Drawer for CareerCopilot
 *
 * Side panel that slides in from left or right. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Drawer.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import './M3Drawer.css';

export interface M3DrawerProps {
  /**
   * If true, drawer is open
   * @default false
   */
  open: boolean;

  /**
   * Callback fired when drawer should close
   */
  onClose: () => void;

  /**
   * Placement of the drawer
   * @default 'left'
   */
  placement?: 'left' | 'right';

  /**
   * If true, shows backdrop overlay
   * @default true
   */
  showBackdrop?: boolean;

  /**
   * If true, clicking backdrop closes drawer
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * If true, pressing Escape closes drawer
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Optional header/title content
   */
  header?: React.ReactNode;

  /**
   * Drawer content
   */
  children?: React.ReactNode;

  /**
   * Custom width (defaults to spacing-56 or spacing-80 on mobile)
   */
  width?: string;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Drawer component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Drawer open={isOpen} onClose={() => setIsOpen(false)} placement="right">
 *   <M3Drawer.Header>Drawer Title</M3Drawer.Header>
 *   <div>Content</div>
 * </M3Drawer>
 * ```
 */
export const M3Drawer: React.FC<M3DrawerProps> & {
  Header: React.FC<{ children: React.ReactNode; className?: string }>;
} = ({
  open,
  onClose,
  placement = 'left',
  showBackdrop = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  header,
  children,
  width,
  className = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Save focus when drawer opens
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  // Keyboard and focus management
  useEffect(() => {
    if (!open) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    // Focus first focusable element
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const focusableElements = drawer.querySelectorAll<HTMLElement>(focusableSelectors);
    const firstFocusable = Array.from(focusableElements).find(
      (el) => el.offsetParent !== null
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [open, closeOnEscape, onClose]);

  // Swipe to close (mobile)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (placement === 'right' && isLeftSwipe) {
      onClose();
    } else if (placement === 'left' && isRightSwipe) {
      onClose();
    }
  };

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose]
  );

  if (!open) return null;

  const classNames = [
    'm3-drawer',
    `m3-drawer--${placement}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = width ? { width } : undefined;

  return (
    <>
      {showBackdrop && (
        <div
          className="m3-drawer__backdrop"
          onClick={handleBackdropClick}
        />
      )}
      <div
        ref={drawerRef}
        className={classNames}
        style={style}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {header && (
          <div className="m3-drawer__header">
            {header}
            <button
              className="m3-drawer__close"
              onClick={onClose}
              aria-label="Close drawer"
            >
              ×
            </button>
          </div>
        )}
        <div className="m3-drawer__content">{children}</div>
      </div>
    </>
  );
};

// Header sub-component
M3Drawer.Header = ({ children, className = '' }) => (
  <div className={`m3-drawer__header-content ${className}`}>{children}</div>
);

M3Drawer.displayName = 'M3Drawer';

export default M3Drawer;
