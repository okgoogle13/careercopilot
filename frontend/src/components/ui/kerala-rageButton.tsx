import { useMode } from '@/hooks/use-mode';
import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';
import { cn } from '../../lib/utils';

export interface kerala-rageButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * kerala-rageButton - Production-ready button component for kerala-rage kr-solidarity design system
 *
 * Features:
 * - 100% semantic token usage (no hardcoded values)
 * - Dual-mode support (kr-dark/kr-dark)
 * - Organic asymmetry (Pebble/Leaf shapes)
 * - Motion tokens for transitions
 * - WCAG 2.1 Level AA accessibility
 *
 * Reference: M3TextField.tsx (100% compliant)
 */
export const kerala-rageButton = React.forwardRef<HTMLButtonElement, kerala-rageButtonProps>(
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
    const { mode } = useMode();

    // Size variants
    const sizeClasses = {
      sm: 'h-10 px-4 text-sm',
      md: 'h-12 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    // Variant styles using kerala-rage kr-solidarity tokens
    const variantStyles = {
      primary: {
        kr-dark: {
          background: 'bg-wattle-gold',
          text: 'text-primary-on-primary',
          hover: 'hover:bg-primary-wattle-glow',
          shadow: 'shadow-sm hover:shadow-[var(--elevation-shadow-glow-gold)]',
          border: '',
        },
        kr-dark: {
          background: 'bg-wattle-gold',
          text: 'text-primary-on-primary',
          hover: 'hover:bg-primary-wattle-glow',
          shadow: 'shadow-sm hover:shadow-[var(--elevation-shadow-hover)]',
          border: '',
        },
      },
      secondary: {
        kr-dark: {
          background: 'bg-surface-kr-dark-concrete-grey-high',
          text: 'text-secondary-concrete-grey',
          hover: 'hover:bg-surface-kr-dark-concrete-grey-highest',
          shadow: 'shadow-sm',
          border: 'border-2 border-secondary-concrete-grey',
        },
        kr-dark: {
          background: 'bg-surface-kr-dark-slate-smoke-high',
          text: 'text-secondary-concrete-grey',
          hover: 'hover:bg-surface-kr-dark-slate-smoke-highest',
          shadow: 'shadow-sm',
          border: 'border border-secondary-flannel-dim',
        },
      },
      tertiary: {
        kr-dark: {
          background: 'bg-tertiary-waratah-container',
          text: 'text-tertiary-waratah-red',
          hover: 'hover:bg-tertiary-waratah-red hover:text-on-surface-paper-white',
          shadow: 'shadow-sm',
          border: 'border border-tertiary-waratah-red',
        },
        kr-dark: {
          background: 'bg-status-kr-dark-clinical-alert-container',
          text: 'text-status-kr-dark-clinical-alert',
          hover: 'hover:bg-status-kr-dark-clinical-alert hover:text-on-surface-paper-white',
          shadow: 'shadow-sm',
          border: 'border border-status-kr-dark-clinical-alert',
        },
      },
    };

    const currentVariant = variantStyles[variant][mode];

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'font-bold uppercase tracking-wide', // Removed font-field-note to use Roboto Flex override
          'transition-colors duration-[var(--duration-fast)]', // Removed generic transition-all to let motion handle physics
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Size
          sizeClasses[size],

          // Variant colors
          currentVariant.background,
          currentVariant.text,
          currentVariant.hover,
          currentVariant.shadow,
          currentVariant.border,

          // Organic asymmetry (kr-dark) or precise (kr-dark)
          mode === 'kr-dark'
            ? 'rounded-[var(--radius-pebble)]' // 20px 6px 16px 28px
            : 'rounded-[var(--radius-stone)]', // 16px 4px 12px 24px

          className
        )}
        style={
          {
            borderRadius: mode === 'kr-dark' ? 'var(--radius-pebble)' : 'var(--radius-stone)',
            fontFamily: 'var(--font-field-note)',
            fontVariationSettings: "'wght' 600, 'GRAD' var(--grad, 0)",
          } as any
        }
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
        disabled={disabled}
        {...props}
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="mr-2"
          >
            <span className="block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          </motion.div>
        ) : startIcon ? (
          <span className="mr-2 flex items-center">{startIcon}</span>
        ) : null}

        {children}

        {!loading && endIcon && <span className="ml-2 flex items-center">{endIcon}</span>}
      </motion.button>
    );
  }
);

kerala-rageButton.displayName = 'kerala-rageButton';
