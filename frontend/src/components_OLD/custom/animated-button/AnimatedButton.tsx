/**
 * ELECTRIC ALCHEMIST: ANIMATED BUTTON
 *
 * Button component with motion animations using Electric Alchemist design system.
 * Replaces CSS modules with Tailwind classes and design system tokens.
 */

import React from 'react';
import { motion, type HTMLMotionProps, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  /**
   * Animation style to apply to the button
   */
  animation?: 'scale' | 'lift' | 'glow' | 'shimmer';
  /**
   * Button variant
   */
  variant?: 'contained' | 'outlined' | 'text';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * AnimatedButton Component
 *
 * Native Button with motion animations and design system tokens.
 */
export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      animation = 'scale',
      variant = 'contained',
      size = 'md',
      children,
      disabled,
      className,
      ...rest
    },
    ref
  ) => {
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
            boxShadow: '0 0 0 8px rgba(208, 188, 255, 0.1)',
          },
        transition: { duration: 0.2 },
      },
      shimmer: {
        transition: { duration: 0.6 },
      },
    };

    const variantStyles = {
      contained: 'bg-primary-container text-on-primary-container border-primary-container',
      outlined: 'bg-transparent text-primary border-outline-variant',
      text: 'bg-transparent text-primary border-transparent',
    };

    const sizeStyles = {
      sm: 'h-9 px-3 text-xs',
      md: 'h-11 px-6 text-sm',
      lg: 'h-14 px-8 text-base',
    };

    const baseStyles =
      'inline-flex items-center justify-center rounded-[24px] border font-ai transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50';

    // Shimmer implementation requires special structure
    if (animation === 'shimmer') {
      return (
        <motion.button
          ref={ref}
          className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
          disabled={disabled}
          {...rest}
        >
          {/* Shimmer overlay */}
          {!disabled && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              }}
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          )}
          {/* Button content */}
          <span className="relative z-10">{children}</span>
        </motion.button>
      );
    }

    // Standard animations (scale, lift, glow)
    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled}
        {...animations[animation]}
        {...rest}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

