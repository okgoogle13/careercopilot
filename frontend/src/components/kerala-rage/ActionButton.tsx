import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMode } from '@/hooks/use-mode';

/**
 * ActionButtonProps
 * 
 * @property variant - The visual style of the button (primary, secondary, or accent).
 * @property label - The text label displayed on the button.
 * @property size - Optional size constraint (default md).
 */
export interface ActionButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'accent';
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ActionButton (Pebble)
 * 
 * Foundational interaction primitive for the Kerala Rage design system.
 * Implements the "Pebble" primitive with hand-cut organic radii.
 * 
 * @mission Technically solid, accessible, and correctly wired to the Fraunces presets.
 */
export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ variant = 'primary', className, label, size = 'md', ...props }, ref) => {
    const { mode } = useMode();
    const shouldReduceMotion = useReducedMotion();

    const variantStyles = {
      primary: 'bg-ink-gold text-asphalt-black shadow-ink-glow-sm',
      secondary: 'bg-transparent border-ink-gold text-ink-gold border',
      accent: 'bg-solidarity-red text-paper-white shadow-solidarity-glow',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-8 py-3 text-sm',
      lg: 'px-10 py-4 text-base',
    };

    // Use reduced motion if preferred
    const motionProps = shouldReduceMotion
      ? { whileHover: { opacity: 0.8 }, whileTap: { opacity: 0.6 } }
      : { whileHover: { y: -4, scale: 1.02 }, whileTap: { scale: 0.98 } };

    return (
      <motion.button
        ref={ref}
        type="button"
        className={cn(
          'rounded-pebble font-field-note font-bold uppercase tracking-wider',
          'transition-colors duration-quick focus-visible:ring-2 focus-visible:ring-ink-gold focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt-black outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        style={{
          // Buttons use Field Note (Work Sans) by default per specs, 
          // but we apply axis presets if they were to switch to Fraunces.
          fontFamily: 'var(--font-field-note)',
          // TODO[asset]: Human will determine if labels should switch to Fraunces presets (energetic/restrained).
        }}
        {...motionProps}
        {...props}
      >
        {label}
      </motion.button>
    );
  }
);

ActionButton.displayName = 'ActionButton';
