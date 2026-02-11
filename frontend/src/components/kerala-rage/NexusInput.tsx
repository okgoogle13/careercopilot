import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMode } from '@/hooks/use-mode';
import { Search, Loader2 } from 'lucide-react';

export interface NexusInputProps extends Omit<HTMLMotionProps<'input'>, 'ref'> {
  icon?: 'search' | 'none';
  loading?: boolean;
  label?: string; // Accessible label
  error?: boolean;
}

/**
 * NexusInput (Pebble)
 * 
 * Unified input pattern for the Kerala Rage tactical interface.
 * Implements "Pebble" rounding with interactive focus states.
 * 
 * @mission Technical precision, accessible labeling, and fluid interaction.
 */
export const NexusInput = React.forwardRef<HTMLInputElement, NexusInputProps>(
  ({ className, icon = 'none', loading = false, label, error, ...props }, ref) => {
    const { mode } = useMode();
    const shouldReduceMotion = useReducedMotion();

    const motionProps = shouldReduceMotion
      ? {}
      : {
          whileFocus: { scale: 1.01, transition: { duration: 0.2 } },
        };

    return (
      <div className="relative w-full group">
        {/* Input Container */}
        <motion.div
           className={cn(
            "relative flex items-center w-full",
            "transition-all duration-300 ease-viscous-breeze"
          )}
          {...motionProps}
        >
          {icon === 'search' && (
            <div className="absolute left-4 text-ink-gold/70 pointer-events-none">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>
          )}

          <input
            ref={ref}
            aria-label={label}
            className={cn(
              // Base Styles
              "w-full bg-asphalt-black text-paper-white font-field-note",
              "border-2 border-white/10 rounded-pebble",
              "placeholder:text-white/30",
              
              // Spacing
              "py-3",
              icon === 'search' ? "pl-12 pr-4" : "px-6",
              
              // Focus State (Gold Glow)
              "focus:outline-none focus:border-ink-gold focus:shadow-[0_0_15px_rgba(218,246,116,0.15)]",
              
              // Error State
              error && "border-solidarity-red focus:border-solidarity-red focus:shadow-[0_0_15px_rgba(241,71,20,0.15)]",
              
              className
            )}
            style={{
              // Ensure we don't accidentally inherit display fonts
              fontFamily: 'var(--font-field-note)',
            }}
            {...props}
          />

          {/* TODO[asset]: Human to verify if specific 'search' icon motif replacement is needed. */}
        </motion.div>
      </div>
    );
  }
);

NexusInput.displayName = 'NexusInput';
