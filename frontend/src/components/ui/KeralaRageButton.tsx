import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';
import { cn } from '../../lib/utils';

export interface KeralaRageButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * KeralaRageButton (Seed Archetype)
 *
 * Kerala Rage kr-solidarity button component implementing the Seed archetype.
 * Production-ready button with semantic token support and loading states.
 *
 * Design Principles:
 * 1. Uses --sys-color-* semantic tokens (never hardcoded colors)
 * 2. Work Sans typography via CSS variable
 * 3. Asymmetric border radius per Seed archetype (40px 12px 40px 12px)
 * 4. Spring physics with viscous-breeze easing
 * 5. WCAG AA compliant focus states
 * 6. Solidarity mode only (no mode-switching)
 */
export const KeralaRageButton = React.forwardRef<HTMLButtonElement, KeralaRageButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className,
      children,
      disabled,
      startIcon,
      endIcon,
      loading,
      ...props
    },
    ref
  ) => {
    // Size variants
    const sizeClasses = {
      sm: 'h-10 px-4 text-sm',
      md: 'h-12 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    // Variant styles using semantic tokens (Solidarity mode only)
    const variantStyles = {
      primary: {
        backgroundColor: 'var(--sys-color-inkGold-base)',
        color: 'var(--sys-color-charcoalBackground-base)',
        boxShadow: '0 0 12px rgba(218, 246, 116, 0.15)',
        border: 'none',
      },
      secondary: {
        backgroundColor: 'var(--sys-color-charcoalBackground-steps-3)',
        color: 'var(--sys-color-concreteGrey-base)',
        border: '2px solid var(--sys-color-concreteGrey-base)',
        boxShadow: 'none',
      },
      tertiary: {
        backgroundColor: 'transparent',
        color: 'var(--sys-color-solidarityRed-base)',
        border: '2px solid var(--sys-color-solidarityRed-base)',
        boxShadow: 'none',
      },
    };

    return (
      <motion.button
        ref={ref}
        style={{
          fontFamily: 'var(--sys-type-font-work-sans, "Work Sans", sans-serif)',
          borderRadius: '40px 12px 40px 12px', // Seed archetype asymmetric radius
          fontVariationSettings: "'wght' 600, 'GRAD' var(--grad, 0)",
          ...variantStyles[variant],
        }}
        className={cn(
          // Base styles
          'font-bold uppercase tracking-wide',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sys-color-inkGold-base)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sys-color-charcoalBackground-base)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Size
          sizeClasses[size],

          className
        )}
        whileHover={
          !disabled
            ? {
                y: -2,
                '--grad': 150,
                transition: {
                  type: 'spring',
                  stiffness: 500,
                  damping: 27,
                  mass: 1,
                },
              }
            : undefined
        }
        whileTap={
          !disabled
            ? {
                y: 0,
                '--grad': 0,
                scale: 0.98,
              }
            : undefined
        }
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            className="mr-2 inline-flex"
          >
            <span className="block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          </motion.div>
        ) : startIcon ? (
          <span className="mr-2 inline-flex items-center">{startIcon}</span>
        ) : null}

        {children}

        {!loading && endIcon && <span className="ml-2 inline-flex items-center">{endIcon}</span>}
      </motion.button>
    );
  }
);

KeralaRageButton.displayName = 'KeralaRageButton';
