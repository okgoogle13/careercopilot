import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface StrikeProps extends HTMLMotionProps<'button'> {
  children?: React.ReactNode;

  /**
   * The visual style variant.
   * - Primary: Ink Gold (Defiance action)
   * - Secondary: Surface Elevated (Navigation/Option)
   * - Ghost: Transparent (Subtle)
   * - Destructive: Solidarity Red (Danger)
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';

  /**
   * The size of the Strike button.
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Optional icon to display before the label.
   */
  iconLeft?: React.ReactNode;

  /**
   * Optional icon to display after the label.
   */
  iconRight?: React.ReactNode;

  /**
   * If true, shows a spinner and disables interaction.
   */
  isLoading?: boolean;
}

/**
 * **THE STRIKE**
 *
 * Archetype: Strike — Primary action, decisive CTA. Defiance and finality.
 * Shape palette: `shape.block03` (base) → `shape.block02` (active/hover)
 * Motion coupling: `typeSpringSlam` (600ms, cubic-bezier(0.34, 1.56, 0.64, 1))
 *
 * KR Shape Token: `--sys-shape-block03` default → `--sys-shape-block02` on active.
 * A sharp corner is a refusal. A Strike button does not apologize for its presence.
 *
 * @example
 * <Strike variant="primary" onClick={submit}>DEPOSIT HISTORY</Strike>
 */
export const Strike = React.forwardRef<HTMLButtonElement, StrikeProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      iconLeft,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative overflow-hidden inline-flex items-center justify-center font-body font-medium transition-colors duration-short disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

    const variants = {
      primary: 'bg-primary text-primary-foreground shadow-ink-rest rounded-strike',
      secondary:
        'bg-surface-elevated text-secondary border border-white/10 shadow-sm rounded-scaffold',
      ghost: 'hover:bg-surface-elevated hover:text-primary rounded-scaffold',
      destructive: 'bg-accent text-white rounded-strike shadow-ink-rest',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-5 py-2 text-sm',
      lg: 'h-12 px-8 text-base',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        data-archetype="strike"
        type={props.type ?? 'button'}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        whileHover={
          !disabled && !isLoading
            ? {
                y: -2,
                scale: 1.02,
                boxShadow: variant === 'primary' ? 'var(--sys-shadow-glow-gold)' : undefined,
                transition: { type: 'spring', stiffness: 400, damping: 15, mass: 1 },
              }
            : undefined
        }
        whileTap={
          !disabled && !isLoading
            ? {
                y: 0,
                scale: 0.98,
              }
            : undefined
        }
        {...props}
      >
        {isLoading && (
          <Loader2
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {!isLoading && iconLeft && <span className="mr-2 relative z-10">{iconLeft}</span>}
        <span className="relative z-10">{children}</span>
        {!isLoading && iconRight && <span className="ml-2 relative z-10">{iconRight}</span>}

        {/* Subtle Screenprint Grit Hover Overlay */}
        {!disabled && (
          <div className="absolute inset-0 opacity-0 hover:opacity-[0.05] pointer-events-none transition-opacity bg-[url('/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-019--v1.svg')]" />
        )}
      </motion.button>
    );
  }
);

Strike.displayName = 'Strike';
