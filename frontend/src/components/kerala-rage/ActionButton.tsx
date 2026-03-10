import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
 * ActionButton (Seed Archetype)
 *
 * Kerala Rage kr-solidarity button component implementing the Seed archetype.
 * Foundational interaction primitive with semantic token support.
 *
 * Design Principles:
 * 1. Uses --sys-color-* semantic tokens (never hardcoded colors)
 * 2. Work Sans typography (field-note stack)
 * 3. Asymmetric border radius per Seed archetype (40px 12px 40px 12px)
 * 4. Spring physics with viscous-breeze easing
 * 5. WCAG AA compliant focus states
 */
export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ variant = 'primary', className, label, size = 'md', ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    // Variant styles using semantic tokens
    const variantStyles = {
      primary: {
        backgroundColor: 'var(--sys-color-inkGold-base)',
        color: 'var(--sys-color-charcoalBackground-base)',
        boxShadow: '0 0 12px rgba(218, 246, 116, 0.15)',
        border: 'none',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: 'var(--sys-color-inkGold-base)',
        border: '2px solid var(--sys-color-inkGold-base)',
        boxShadow: 'none',
      },
      accent: {
        backgroundColor: 'var(--sys-color-solidarityRed-base)',
        color: 'var(--sys-color-worker-ash-base)',
        boxShadow: '0 0 12px rgba(241, 71, 20, 0.2)',
        border: 'none',
      },
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-8 py-3 text-sm',
      lg: 'px-10 py-4 text-base',
    };

    // Use reduced motion if preferred
    const motionProps = shouldReduceMotion
      ? { whileHover: { opacity: 0.8 }, whileTap: { opacity: 0.6 } }
      : {
          whileHover: { y: -4, scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 20,
          },
        };

    return (
      <motion.button
        ref={ref}
        type="button"
        style={{
          fontFamily: 'var(--sys-type-font-work-sans, "Work Sans", sans-serif)',
          borderRadius: 'var(--shape-marchSurge01)', // March archetype asymmetric radius
          ...variantStyles[variant],
        }}
        className={cn(
          'font-bold uppercase tracking-wider',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sys-color-inkGold-base)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sys-color-charcoalBackground-base)]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          sizeStyles[size],
          className
        )}
        {...(motionProps as any)}
        {...(props as any)}
      >
        {label}
      </motion.button>
    );
  }
);

ActionButton.displayName = 'ActionButton';
