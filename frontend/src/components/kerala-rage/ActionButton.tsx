import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

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
 * ActionButton (Strike Archetype)
 *
 * Kerala Rage kr-solidarity button component implementing the Strike archetype.
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
          whileHover: {
            y: -2,
            scale: 1.01,
            borderRadius: 'var(--sys-shape-blockRiot02)', // Active/Hover morph
          },
          whileTap: {
            scale: 0.98,
            borderRadius: 'var(--sys-shape-strikePuff01)', // 'Puff' morph on press
          },
          transition: KrDarkSpring,
        };

    return (
      <motion.button
        ref={ref}
        type="button"
        style={{
          fontFamily: 'var(--sys-type-fontFamilies-primary)',
          borderRadius: 'var(--sys-shape-blockRiot03)', // Strike archetype asymmetric radius
          ...variantStyles[variant],
        }}
        className={cn(
          'type-solidarityProtest uppercase',
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
