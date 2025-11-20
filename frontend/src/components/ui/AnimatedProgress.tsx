import { Box, Typography } from '@mui/material';
import { motion } from 'motion/react';
import React, { useMemo } from 'react';

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
   * If false, progress bar will update instantly
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
   * Additional className for custom styling
   */
  className?: string;
}

const variantColors: Record<string, string> = {
  default: '#a855f7', // purple-500
  success: '#10b981', // green-500
  warning: '#f59e0b', // orange-500
  error: '#ef4444', // red-500
};

/**
 * AnimatedProgress - Animated progress bar with spring physics
 *
 * Features:
 * - Smooth spring animation for natural motion
 * - Multiple color variants (default, success, warning, error)
 * - Optional percentage display
 * - Optional label text
 * - Configurable max value
 * - Can disable animation for instant updates
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AnimatedProgress value={75} />
 *
 * // With label and custom variant
 * <AnimatedProgress value={60} label="Upload Progress" variant="success" />
 *
 * // No animation (instant)
 * <AnimatedProgress value={50} animated={false} />
 *
 * // Custom max value
 * <AnimatedProgress value={150} max={200} />
 *
 * // Controlled progress example
 * const [progress, setProgress] = useState(0);
 * useEffect(() => {
 *   const timer = setInterval(() => {
 *     setProgress(prev => prev >= 100 ? 0 : prev + 10);
 *   }, 500);
 *   return () => clearInterval(timer);
 * }, []);
 * <AnimatedProgress value={progress} />
 * ```
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
  // Calculate percentage and clamp value
  const clampedValue = Math.min(max, Math.max(0, value));
  const percentage = useMemo(() => (clampedValue / max) * 100, [clampedValue, max]);

  const color = variantColors[variant] || variantColors.default;

  return (
    <Box className={className} sx={{ width: '100%' }}>
      {/* Labels */}
      {(showPercentage || label) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          {label && (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
          )}
          {showPercentage && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {Math.round(percentage)}%
            </Typography>
          )}
        </Box>
      )}

      {/* Progress Bar Container */}
      <Box
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(percentage)}%`}
        sx={{
          width: '100%',
          height: 12,
          borderRadius: 9999, // pill shape
          bgcolor: '#e5e7eb', // gray-200
          overflow: 'hidden',
        }}
      >
        {/* Progress Fill */}
        <motion.div
          style={{
            height: '100%',
            borderRadius: 9999,
            backgroundColor: color,
          }}
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
      </Box>
    </Box>
  );
}
