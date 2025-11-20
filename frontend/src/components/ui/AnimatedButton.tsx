import { Button, ButtonProps } from '@mui/material';
import { motion, MotionProps } from 'motion/react';
import React from 'react';

// Create motion version of MUI Button
const MotionButton = motion(Button);

export interface AnimatedButtonProps extends Omit<ButtonProps, 'color' | 'variant'> {
  /**
   * Animation style to apply to the button
   * - scale: Scales up on hover, down on tap
   * - lift: Raises button slightly on hover
   * - glow: Adds purple glow effect on hover
   * - shimmer: Gradient overlay slides across on hover
   */
  animation?: 'scale' | 'lift' | 'glow' | 'shimmer';
  /**
   * MUI Button variant
   */
  variant?: 'contained' | 'outlined' | 'text';
  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * AnimatedButton - Material-UI Button with framer-motion animations
 *
 * Provides 4 animation styles:
 * - **scale**: Button scales up on hover (1.05x) and down on tap (0.95x)
 * - **lift**: Button lifts up on hover with shadow increase
 * - **glow**: Purple glow effect appears on hover
 * - **shimmer**: Gradient overlay slides across button on hover
 *
 * @example
 * ```tsx
 * <AnimatedButton animation="scale">Click Me</AnimatedButton>
 * <AnimatedButton animation="lift" variant="outlined">Hover Me</AnimatedButton>
 * <AnimatedButton animation="glow">Glow Effect</AnimatedButton>
 * <AnimatedButton animation="shimmer" variant="outlined">Shimmer</AnimatedButton>
 * ```
 */
export function AnimatedButton({
  animation = 'scale',
  variant = 'contained',
  children,
  disabled,
  className,
  sx,
  ...rest
}: AnimatedButtonProps) {
  // Animation configurations
  const animations: Record<string, Partial<MotionProps>> = {
    scale: {
      whileHover: disabled ? {} : { scale: 1.05 },
      whileTap: disabled ? {} : { scale: 0.95 },
      transition: { type: 'spring', stiffness: 300 },
    },
    lift: {
      whileHover: disabled ? {} : { y: -2 },
      whileTap: disabled ? {} : { y: 0 },
      transition: { type: 'spring', stiffness: 300 },
    },
    glow: {
      whileHover: disabled
        ? {}
        : {
            boxShadow: '0 0 0 8px rgba(124, 58, 237, 0.1)',
          },
      transition: { duration: 0.2 },
    },
    shimmer: {
      // Shimmer is handled differently with nested motion.div
      transition: { duration: 0.6 },
    },
  };

  // Additional styles for lift animation (shadow increase)
  const liftSx =
    animation === 'lift' && !disabled
      ? {
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          },
        }
      : {};

  // Shimmer implementation requires special structure
  if (animation === 'shimmer') {
    return (
      <MotionButton
        variant={variant}
        disabled={disabled}
        className={className}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          ...sx,
        }}
        {...rest}
      >
        {/* Shimmer overlay */}
        {!disabled && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              pointerEvents: 'none',
            }}
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
        )}
        {/* Button content */}
        <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      </MotionButton>
    );
  }

  // Standard animations (scale, lift, glow)
  return (
    <MotionButton
      variant={variant}
      disabled={disabled}
      className={className}
      sx={{
        ...liftSx,
        ...sx,
      }}
      {...animations[animation]}
      {...rest}
    >
      {children}
    </MotionButton>
  );
}
