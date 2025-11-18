/**
 * M3 Expressive Tooltip Component
 * Implements Material Design 3 tooltip with positioning
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Typography: --md-sys-typescale-*
 * - Motion: --md-sys-motion-*
 */
import React, { useState, useRef, useCallback } from 'react';
import './M3Tooltip.css';

export interface M3TooltipProps {
  /**
   * Tooltip content
   */
  title: React.ReactNode;

  /**
   * Placement of the tooltip
   * @default 'top'
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * If true, tooltip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Delay before showing tooltip (ms)
   * @default 200
   */
  enterDelay?: number;

  /**
   * Delay before hiding tooltip (ms)
   * @default 0
   */
  leaveDelay?: number;

  /**
   * Children element that triggers the tooltip
   */
  children: React.ReactElement;

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
 * <M3Tooltip title="Delete item">
 *   <button>Delete</button>
 * </M3Tooltip>
 * ```
 */
export const M3Tooltip: React.FC<M3TooltipProps> = ({
  title,
  placement = 'top',
  disabled = false,
  enterDelay = 200,
  leaveDelay = 0,
  children,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (disabled || !title) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, enterDelay);
  }, [disabled, title, enterDelay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, leaveDelay);
  }, [leaveDelay]);

  const handleFocus = useCallback(() => {
    if (disabled || !title) return;
    setVisible(true);
  }, [disabled, title]);

  const handleBlur = useCallback(() => {
    setVisible(false);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const classNames = [
    'm3-tooltip-wrapper',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const tooltipClassNames = [
    'm3-tooltip',
    `m3-tooltip--${placement}`,
    visible && 'm3-tooltip--visible',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} data-testid="m3-tooltip-wrapper">
      {React.cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        'aria-describedby': visible ? 'm3-tooltip-content' : undefined,
      })}
      {visible && title && (
        <div
          className={tooltipClassNames}
          role="tooltip"
          id="m3-tooltip-content"
          data-testid="m3-tooltip"
        >
          {title}
        </div>
      )}
    </div>
  );
};

M3Tooltip.displayName = 'M3Tooltip';

export default M3Tooltip;
