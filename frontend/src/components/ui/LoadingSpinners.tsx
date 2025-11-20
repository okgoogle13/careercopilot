import { Box } from '@mui/material';
import { motion } from 'motion/react';
import React from 'react';

export interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * RotatingSpinner - Single circle with partial border that rotates continuously
 *
 * @example
 * ```tsx
 * <RotatingSpinner size={24} color="#a855f7" />
 * ```
 */
export function RotatingSpinner({ size = 24, color = '#a855f7', className }: SpinnerProps) {
  return (
    <motion.div
      className={className}
      aria-label="Loading"
      role="status"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        width: size,
        height: size,
        border: `${size / 8}px solid ${color}20`,
        borderTopColor: color,
        borderRadius: '50%',
      }}
    />
  );
}

/**
 * PulsingDot - Single filled circle with scale animation
 *
 * @example
 * ```tsx
 * <PulsingDot size={12} color="#a855f7" />
 * ```
 */
export function PulsingDot({ size = 12, color = '#a855f7', className }: SpinnerProps) {
  return (
    <motion.div
      className={className}
      aria-label="Loading"
      role="status"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
      }}
    />
  );
}

/**
 * BouncingDots - Three circles bouncing with staggered delays
 *
 * @example
 * ```tsx
 * <BouncingDots dotSize={8} color="#a855f7" />
 * ```
 */
export function BouncingDots({
  size = 8,
  color = '#a855f7',
  className,
}: SpinnerProps & { dotSize?: number }) {
  const dotSize = size;

  return (
    <Box
      className={className}
      aria-label="Loading"
      role="status"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.15,
          }}
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            borderRadius: '50%',
          }}
        />
      ))}
    </Box>
  );
}

/**
 * GradientSpinner - Circular border with conic gradient that rotates
 *
 * @example
 * ```tsx
 * <GradientSpinner size={32} color="#a855f7" />
 * ```
 */
export function GradientSpinner({ size = 32, color = '#a855f7', className }: SpinnerProps) {
  return (
    <motion.div
      className={className}
      aria-label="Loading"
      role="status"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      style={{
        width: size,
        height: size,
        border: `${size / 8}px solid transparent`,
        borderRadius: '50%',
        background: `conic-gradient(from 0deg, ${color}, transparent 70%)`,
        WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${size / 8}px), white 0)`,
        mask: `radial-gradient(farthest-side, transparent calc(100% - ${size / 8}px), white 0)`,
      }}
    />
  );
}

/**
 * MorphingLoader - Shape-shifting square/circle with morphing border-radius
 *
 * @example
 * ```tsx
 * <MorphingLoader size={24} color="#a855f7" />
 * ```
 */
export function MorphingLoader({ size = 24, color = '#a855f7', className }: SpinnerProps) {
  return (
    <motion.div
      className={className}
      aria-label="Loading"
      role="status"
      animate={{
        borderRadius: ['50%', '25%', '50%'],
        scale: [1, 0.8, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  );
}

/**
 * LoadingSpinners - Component that displays all 5 spinner variants
 *
 * Useful for showcasing or demonstrating different loading animations.
 *
 * @example
 * ```tsx
 * <LoadingSpinners />
 * ```
 */
export function LoadingSpinners() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <RotatingSpinner />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Rotating</Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <PulsingDot />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Pulsing</Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <BouncingDots />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Bouncing</Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <GradientSpinner />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Gradient</Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <MorphingLoader />
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Morphing</Box>
      </Box>
    </Box>
  );
}
