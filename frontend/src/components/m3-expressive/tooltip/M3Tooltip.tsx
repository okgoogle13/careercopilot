/**
 * M3 Expressive Tooltip Component
 * Implements Material Design 3 feedback component with M3 styling
 *
 * Hover popover. Uses CSS variables from m3-design-tokens.css.
 */
import React, { useState, useRef, useEffect } from 'react';
import './M3Tooltip.css';

export interface M3TooltipProps {
  /**
   * Tooltip content/text
   */
  title: string;

  /**
   * Element that triggers the tooltip
   */
  children: React.ReactElement;

  /**
   * Tooltip placement
   * @default 'top'
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Delay before showing tooltip (ms)
   * @default 0
   */
  delay?: number;

  /**
   * If true, tooltip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Tooltip component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Tooltip title="Tooltip text">
 *   <button>Hover me</button>
 * </M3Tooltip>
 * ```
 */
export const M3Tooltip: React.FC<M3TooltipProps> = ({
  title,
  children,
  placement = 'top',
  delay = 0,
  disabled = false,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + 8;
          break;
      }

      setPosition({ top, left });
    }
  }, [visible, placement]);

  const handleMouseEnter = () => {
    if (disabled) return;
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      {visible && !disabled && (
        <div
          ref={tooltipRef}
          className={[
            'm3-tooltip',
            `m3-tooltip--${placement}`,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 1300,
          }}
          role="tooltip"
        >
          {title}
        </div>
      )}
    </>
  );
};

M3Tooltip.displayName = 'M3Tooltip';

export default M3Tooltip;
