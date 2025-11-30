
import { Box, ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { m3Theme } from '../../../styles/m3-theme';

export interface M3SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * RotatingSpinner - Single circle with partial border that rotates continuously
 */
export function M3RotatingSpinner({ size = 24, color = m3Theme.palette.primary.main, className }: M3SpinnerProps) {
  return (
    <motion.div
      className={className}
      aria-label="Loading"
      role="status"
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1, 
        repeat: Infinity, 
        ease: m3Theme.motion.easing.linear as any
      }}
      style={{
        width: size,
        height: size,
        border: `${size / 8}px solid ${color}33`,
        borderTopColor: color,
        borderRadius: '50%',
      }}
    />
  );
}

/**
 * PulsingDot - Single filled circle with scale animation
 */
export function M3PulsingDot({ size = 12, color = m3Theme.palette.primary.main, className }: M3SpinnerProps) {
  return (
    <motion.div
      className={className}
      aria-label="Loading"
      role="status"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        ease: m3Theme.motion.easing.standard as any
      }}
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
 */
export function M3BouncingDots({
  size = 8,
  color = m3Theme.palette.primary.main,
  className,
}: M3SpinnerProps) {
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
            ease: m3Theme.motion.easing.standard as any,
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
    </Box>
  );
}

/**
 * GradientSpinner - Circular border with conic gradient that rotates
 */
export function M3GradientSpinner({ size = 32, color = m3Theme.palette.primary.main, className }: M3SpinnerProps) {
  return (
    <motion.div
      className={className}
      aria-label="Loading"
      role="status"
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 2, 
        repeat: Infinity, 
        ease: m3Theme.motion.easing.linear as any
      }}
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
 */
export function M3MorphingLoader({ size = 24, color = m3Theme.palette.primary.main, className }: M3SpinnerProps) {
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
        ease: m3Theme.motion.easing.standard as any,
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
 * M3LoadingSpinners - Component that displays all 5 spinner variants
 */
export function M3LoadingSpinners() {
  return (
    <ThemeProvider theme={m3Theme}>
        <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
        }}
        >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <M3RotatingSpinner />
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Rotating</Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <M3PulsingDot />
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Pulsing</Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <M3BouncingDots />
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Bouncing</Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <M3GradientSpinner />
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Gradient</Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <M3MorphingLoader />
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Morphing</Box>
        </Box>
        </Box>
    </ThemeProvider>
  );
}
