/**
 * ELECTRIC ALCHEMIST: LOADING SPINNERS
 *
 * Collection of loading spinner components using Electric Alchemist design system.
 * Uses Framer Motion for animations and design system tokens for colors.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * RotatingSpinner Component
 *
 * Single circle with partial border that rotates continuously.
 */
export function RotatingSpinner({
  size = 24,
  color = '#D0BCFF', // primary color from tokens
  className,
}: SpinnerProps) {
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
 * PulsingDot Component
 *
 * Single filled circle with scale animation.
 */
export function PulsingDot({
  size = 12,
  color = '#D0BCFF',
  className,
}: SpinnerProps) {
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
 * BouncingDots Component
 *
 * Three circles bouncing with staggered delays.
 */
export function BouncingDots({
  size = 8,
  color = '#D0BCFF',
  className,
}: SpinnerProps & { dotSize?: number }) {
  return (
    <div
      className={cn('flex items-center gap-2', className)}
      aria-label="Loading"
      role="status"
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
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
}

/**
 * GradientSpinner Component
 *
 * Circular border with conic gradient that rotates.
 */
export function GradientSpinner({
  size = 32,
  color = '#D0BCFF',
  className,
}: SpinnerProps) {
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
 * MorphingLoader Component
 *
 * Shape-shifting square/circle with morphing border-radius.
 */
export function MorphingLoader({
  size = 24,
  color = '#D0BCFF',
  className,
}: SpinnerProps) {
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
 * LoadingSpinners Component
 *
 * Component that displays all 5 spinner variants for showcasing.
 */
export function LoadingSpinners() {
  return (
    <div className="flex items-center gap-12">
      <div className="flex flex-col items-center gap-2">
        <RotatingSpinner />
        <div className="text-data text-xs text-on-surface-variant">Rotating</div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <PulsingDot />
        <div className="text-data text-xs text-on-surface-variant">Pulsing</div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <BouncingDots />
        <div className="text-data text-xs text-on-surface-variant">Bouncing</div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <GradientSpinner />
        <div className="text-data text-xs text-on-surface-variant">Gradient</div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <MorphingLoader />
        <div className="text-data text-xs text-on-surface-variant">Morphing</div>
      </div>
    </div>
  );
}

