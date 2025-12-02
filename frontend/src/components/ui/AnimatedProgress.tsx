/**
 * ELECTRIC ALCHEMIST: ANIMATED PROGRESS
 *
 * Animated progress bar with spring physics using Electric Alchemist design system.
 * Uses design system tokens for colors and styling.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AnimatedProgressProps {
  /**
   * Current progress value (0-100 by default, or 0-max if max is specified)
   */
  value: number;
  /**
   * Maximum value (default: 100)
   */
  max?: number;
  /**
   * Whether to show percentage text above the bar
   */
  showPercentage?: boolean;
  /**
   * Whether to animate the progress change (default: true)
   */
  animated?: boolean;
  /**
   * Visual variant affecting the color of the progress bar
   */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /**
   * Optional label to display above the progress bar
   */
  label?: string;
  /**
   * Additional className
   */
  className?: string;
}

const variantColors: Record<string, string> = {
  default: '#D0BCFF', // primary
  success: '#10b981', // success green
  warning: '#f59e0b', // warning orange
  error: '#FF6B9D', // error from tokens
};

/**
 * AnimatedProgress Component
 *
 * Animated progress bar with spring physics.
 */
export function AnimatedProgress({
  value,
  max = 100,
  showPercentage = true,
  animated = true,
  variant = 'default',
  label,
  className,
}: AnimatedProgressProps) {
  const clampedValue = Math.min(max, Math.max(0, value));
  const percentage = useMemo(() => (clampedValue / max) * 100, [clampedValue, max]);

  const color = variantColors[variant] || variantColors.default;

  return (
    <div className={cn('w-full', className)}>
      {/* Labels */}
      {(showPercentage || label) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <p className="text-human text-sm font-medium text-on-surface">{label}</p>
          )}
          {showPercentage && (
            <p className="text-human text-sm text-on-surface-variant">
              {Math.round(percentage)}%
            </p>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(percentage)}%`}
        className="w-full h-3 rounded-full bg-surface-container overflow-hidden"
      >
        {/* Progress Fill */}
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={animated ? { width: '0%' } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? {
                  type: 'spring',
                  damping: 30,
                  stiffness: 100,
                }
              : { duration: 0 }
          }
        />
      </div>
    </div>
  );
}

