/**
 * @deprecated Pebble is deprecated as of KR Solidarity v6.0.
 * Use {@link Strike} from './Strike' instead. See docs/design/01_CANON.md §2.C
 * Will be removed in v7.0.
 */
import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface PebbleProps extends HTMLMotionProps<'button'> {
  children?: React.ReactNode;

  /**
   * The visual style variant.
   * - Primary: Ink Gold (Action)
   * - Secondary: Surface Elevated (Navigation/Option)
   * - Ghost: Transparent (Subtle)
   * - Destructive: Solidarity Red (Danger)
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';

  /**
   * The size of the pebble.
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
 * **THE PEBBLE**
 *
 * A smooth, organically shaped action element.
 * Corresponds to the 'Leaf' (Primary) and 'Pebble' (Container) shapes in KeralaRage KrSolidarity.
 *
 * @example
 * <Pebble variant="primary" onClick={doSomething}>Click Me</Pebble>
 */
export const Pebble = React.forwardRef<HTMLButtonElement, PebbleProps>(
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
    // Base structural classes (Layout & Physics)
    const baseStyles =
      'relative overflow-hidden inline-flex items-center justify-center font-body font-medium transition-colors duration-short disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

    // Token-mapped variants (The Skin comes from tokens.json via tailwind config)
    const variants = {
      primary: 'bg-primary text-primary-foreground shadow-ink-rest rounded-leaf',
      secondary:
        'bg-surface-elevated text-secondary border border-white/10 shadow-sm rounded-pebble',
      ghost: 'hover:bg-surface-elevated hover:text-primary rounded-petal',
      destructive: 'bg-accent text-white rounded-leaf shadow-ink-rest',
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
        disabled={disabled || isLoading}
        whileHover={
          !disabled && !isLoading
            ? {
                scale: 1.03,
                boxShadow: variant === 'primary' ? 'var(--sys-shadow-glow-gold)' : undefined,
                transition: { type: 'spring', stiffness: 400, damping: 15, mass: 1 },
              }
            : undefined
        }
        whileTap={
          !disabled && !isLoading
            ? {
                scale: 0.96,
              }
            : undefined
        }
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

Pebble.displayName = 'Pebble';
