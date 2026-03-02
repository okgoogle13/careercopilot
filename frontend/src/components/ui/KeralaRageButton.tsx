import { useMode } from '../../hooks/use-mode';
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
 * KeralaRageButton - Production-ready button component for KeralaRage KrSolidarity design system
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
    const { mode } = useMode();

    // Size variants
    const sizeClasses = {
      sm: 'h-10 px-4 text-sm',
      md: 'h-12 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    // Variant styles using KeralaRage KrSolidarity tokens
    const variantStyles: any = {
      primary: {
        'KrDark': {
          background: 'bg-ink-gold',
          text: 'text-primary-on-primary',
          hover: 'hover:bg-primary-ink-glow',
          shadow: 'shadow-sm hover:shadow-[var(--elevation-shadow-glow-gold)]',
          border: '',
        },
        'KrLight': { // Assuming kr-light exists or use KrDark as fallback
          background: 'bg-ink-gold',
          text: 'text-primary-on-primary',
          hover: 'hover:bg-primary-ink-glow',
          shadow: 'shadow-sm hover:shadow-[var(--elevation-shadow-hover)]',
          border: '',
        },
      },
      secondary: {
        'KrDark' : {
          background: 'bg-surface-KrDark-concrete-grey-high',
          text: 'text-secondary-concrete-grey',
          hover: 'hover:bg-surface-KrDark-concrete-grey-highest',
          shadow: 'shadow-sm',
          border: 'border-2 border-secondary-concrete-grey',
        },
        'KrLight': {
          background: 'bg-surface-KrDark-slate-smoke-high',
          text: 'text-secondary-concrete-grey',
          hover: 'hover:bg-surface-KrDark-slate-smoke-highest',
          shadow: 'shadow-sm',
          border: 'border border-secondary-flannel-dim',
        },
      },
      tertiary: {
        'KrDark': {
          background: 'bg-tertiary-solidarity-container',
          text: 'text-tertiary-solidarity-red',
          hover: 'hover:bg-tertiary-solidarity-red hover:text-on-surface-paper-white',
          shadow: 'shadow-sm',
          border: 'border border-tertiary-solidarity-red',
        },
        'KrLight': {
          background: 'bg-status-KrDark-clinical-alert-container',
          text: 'text-status-KrDark-clinical-alert',
          hover: 'hover:bg-status-KrDark-clinical-alert hover:text-on-surface-paper-white',
          shadow: 'shadow-sm',
          border: 'border border-status-KrDark-clinical-alert',
        },
      },
    };

    // Fix: provide fallback for variantStyles access
    const currentVariant = (variantStyles[variant] && variantStyles[variant][mode]) || variantStyles.primary['KrDark'];

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'font-bold uppercase tracking-wide',
          'transition-colors duration-[var(--duration-fast)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Size
          sizeClasses[size],

          // Variant colors
          currentVariant.background,
          currentVariant.text,
          currentVariant.hover,
          currentVariant.shadow,
          currentVariant.border,

          // Rounded pebble in KrDark, sharper stone in KrLight.
          mode === 'KrDark'
            ? 'rounded-[var(--radius-pebble)]'
            : 'rounded-[var(--radius-stone)]',

          className
        )}
        style={
          {
            borderRadius: mode === 'KrDark' ? 'var(--radius-pebble)' : 'var(--radius-stone)',
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
            transition={{ repeat: Infinity, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
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

KeralaRageButton.displayName = 'KeralaRageButton';
