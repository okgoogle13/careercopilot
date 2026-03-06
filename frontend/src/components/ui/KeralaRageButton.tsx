import { useMode } from '@/hooks/use-mode';
import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';
import { cn } from '../../lib/utils';

export interface KeralaRageButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'defiance';
  size?: 'sm' | 'md' | 'lg';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * KeralaRageButton - Production-ready button for Kerala Rage kr-solidarity.
 *
 * Compliant with SOLIDARITY_SPEC_V5.md:
 * - Uses --sys-shape-radius-pebble
 * - Uses --sys-color-* tokens
 * - Mandatory dark-substrate alignment
 * - M3 Expressive motion spring
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
    // Note: System is now dark-only as per spec. mode choice is purely for transition stability.
    const { mode } = useMode();

    // Size variants
    const sizeClasses = {
      sm: 'h-10 px-4 text-xs tracking-tighter',
      md: 'h-12 px-6 text-sm tracking-wide',
      lg: 'h-14 px-8 text-base tracking-widest',
    };

    // Variant Styles mapping to --sys- tokens
    const variantStyles = {
      primary: {
        background: 'bg-[var(--sys-color-inkGold-base)]',
        text: 'text-[var(--sys-color-charcoalBackground-base)]',
        hover: 'hover:opacity-90',
        shadow:
          'shadow-[var(--sys-shadow-elevation1Pebble)] hover:shadow-[var(--sys-shadow-elevation3HoverLift)]',
        border: 'border-none',
      },
      secondary: {
        background: 'bg-[var(--sys-color-charcoalBackground-steps-2)]',
        text: 'text-[var(--sys-color-worker-ash-base)]',
        hover: 'hover:bg-[var(--sys-color-charcoalBackground-steps-3)]',
        shadow: 'shadow-[var(--sys-shadow-elevation1Pebble)]',
        border: 'border border-[var(--sys-color-worker-ash-base)]/20',
      },
      tertiary: {
        background: 'bg-transparent',
        text: 'text-[var(--sys-color-inkGold-base)]',
        hover: 'hover:bg-[var(--sys-color-inkGold-base)]/10',
        shadow: '',
        border: 'border border-[var(--sys-color-inkGold-base)]/40',
      },
      defiance: {
        background: 'bg-[var(--sys-color-solidarityRed-base)]',
        text: 'text-[var(--sys-color-paperWhite-base)]',
        hover: 'hover:brightness-110',
        shadow: 'shadow-[var(--sys-shadow-solidarityBleed)]',
        border: 'border-none',
      },
    };

    const styles = variantStyles[variant];

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'font-bold uppercase inline-flex items-center justify-center relative overflow-hidden',
          'transition-all duration-300',
          'disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed',

          // Size/Radius
          sizeClasses[size],
          'rounded-[var(--sys-shape-radius-pebble)]',

          // Variant colors
          styles.background,
          styles.text,
          styles.shadow,
          styles.border,

          className
        )}
        style={{
          fontFamily: 'var(--sys-type-fontFamilies-primary)',
          fontVariationSettings: "'wght' 700, 'GRAD' var(--grad, 0)",
        }}
        whileHover={
          !disabled
            ? {
                scale: 1.03,
                '--grad': 100,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 15,
                  mass: 1,
                },
              }
            : undefined
        }
        whileTap={
          !disabled
            ? {
                scale: 0.97,
                '--grad': 0,
              }
            : undefined
        }
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="mr-2"
          >
            <span className="block w-4 h-4 border-2 border-current border-t-transparent rounded-sentry" />
          </motion.div>
        ) : startIcon ? (
          <span className="mr-2 flex items-center">{startIcon}</span>
        ) : null}

        <span className="relative z-10 transition-transform duration-300 group-active:scale-95">
          {children}
        </span>

        {!loading && endIcon && <span className="ml-2 flex items-center">{endIcon}</span>}

        {/* Subtle Screenprint Grit Hover Overlay */}
        {!disabled && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] pointer-events-none transition-opacity bg-[url('/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-screenprint-grit--v1.svg')]" />
        )}
      </motion.button>
    );
  }
);

KeralaRageButton.displayName = 'KeralaRageButton';
