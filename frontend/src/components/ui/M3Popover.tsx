/**
 * M3 Expressive Popover Component
 * Implements Material Design 3 popover with positioning
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Elevation: --md-sys-elevation-*
 * - Motion: --md-sys-motion-*
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './M3Popover.css';

export interface M3PopoverProps {
  /**
   * If true, popover is open
   */
  open: boolean;

  /**
   * Callback when popover requests to close
   */
  onClose?: () => void;

  /**
   * Anchor element or ref
   */
  anchorEl?: HTMLElement | null;

  /**
   * Placement of the popover
   * @default 'bottom'
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Popover content
   */
  children: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Popover component using design tokens.
 *
 * Example usage:
 * ```tsx
 * const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
 * const open = Boolean(anchorEl);
 *
 * <button onClick={(e) => setAnchorEl(e.currentTarget)}>Open</button>
 * <M3Popover
 *   open={open}
 *   anchorEl={anchorEl}
 *   onClose={() => setAnchorEl(null)}
 * >
 *   <div>Popover content</div>
 * </M3Popover>
 * ```
 */
export const M3Popover = React.forwardRef<HTMLDivElement, M3PopoverProps>(
  (
    {
      open,
      onClose,
      anchorEl,
      placement = 'bottom',
      children,
      className = '',
    },
    ref
  ) => {
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const updatePosition = useCallback(() => {
      if (!anchorEl || !popoverRef.current) return;

      const anchorRect = anchorEl.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = anchorRect.top - popoverRect.height - 8;
          left = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2;
          break;
        case 'bottom':
          top = anchorRect.bottom + 8;
          left = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2;
          break;
        case 'left':
          top = anchorRect.top + anchorRect.height / 2 - popoverRect.height / 2;
          left = anchorRect.left - popoverRect.width - 8;
          break;
        case 'right':
          top = anchorRect.top + anchorRect.height / 2 - popoverRect.height / 2;
          left = anchorRect.right + 8;
          break;
      }

      setPosition({ top, left });
    }, [anchorEl, placement]);

    useEffect(() => {
      if (open) {
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
          window.removeEventListener('resize', updatePosition);
          window.removeEventListener('scroll', updatePosition, true);
        };
      }
    }, [open, updatePosition]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node) &&
          anchorEl &&
          !anchorEl.contains(event.target as Node)
        ) {
          onClose?.();
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose?.();
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleEscape);
        };
      }
    }, [open, onClose, anchorEl]);

    if (!open) {
      return null;
    }

    const classNames = [
      'm3-popover',
      `m3-popover--${placement}`,
      open && 'm3-popover--open',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <>
        <div className="m3-popover-backdrop" data-testid="m3-popover-backdrop" />
        <div
          ref={(node) => {
            popoverRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className={classNames}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          role="dialog"
          aria-modal="true"
          data-testid="m3-popover"
        >
          {children}
        </div>
      </>
    );
  }
);

M3Popover.displayName = 'M3Popover';

export default M3Popover;
