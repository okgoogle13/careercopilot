import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface StrikeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
      'inline-flex items-center justify-center font-body font-medium transition-all duration-short ease-viscous disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

    const variants = {
      primary:
        'bg-primary text-primary-foreground hover:bg-primary-bright hover:-translate-y-0.5 shadow-ink-rest hover:shadow-glow-gold rounded-leaf',
      secondary:
        'bg-surface-elevated text-secondary border border-white/10 hover:bg-surface-elevated/80 hover:text-primary hover:-translate-y-0.5 shadow-sm rounded-pebble',
      ghost: 'hover:bg-surface-elevated hover:text-primary rounded-petal',
      destructive: 'bg-accent text-white hover:bg-accent-dim rounded-leaf shadow-ink-rest',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-5 py-2 text-sm',
      lg: 'h-12 px-8 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        data-archetype="strike"
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && iconLeft && <span className="mr-2">{iconLeft}</span>}
        {children}
        {!isLoading && iconRight && <span className="ml-2">{iconRight}</span>}
      </button>
    );
  }
);

Strike.displayName = 'Strike';
