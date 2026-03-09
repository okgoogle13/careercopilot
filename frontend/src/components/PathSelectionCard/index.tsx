import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PathSelectionCardProps {
  /** Path name (Display Large) */
  title: string;
  /** Purpose description */
  description: string;
  /** Selection callback */
  onSelect: () => void;
  /** Selection status for active styling */
  isSelected?: boolean;
  /** Optional class overrides for layout composition */
  className?: string;
}

/**
 * PathSelectionCard
 *
 * The "Collective Choice" unit for onboarding.
 * Features stencil-inspired typography and optimistic "Bloom" effects.
 */
export const PathSelectionCard: React.FC<PathSelectionCardProps> = ({
  title,
  description,
  onSelect,
  isSelected = false,
  className,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={cn(
        'relative w-full p-8 bg-charcoal-100 border-2 transition-all flex flex-col min-h-[400px]',
        'rounded-megaphone shadow-viscous cursor-pointer overflow-hidden',
        isSelected ? 'border-ink-gold ring-4 ring-ink-gold/20' : 'border-blueprint-grey/20',
        className
      )}
      role="button"
      aria-pressed={isSelected}
    >
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-018--v1.svg')] z-0" />

      <div className="relative z-10 flex flex-col gap-8 h-full">
        <h2
          className={cn(
            'text-[1.9rem] md:text-3xl xl:text-[2rem] leading-[1.08] font-solidarity-900 tracking-tight [overflow-wrap:anywhere]',
            isSelected ? 'text-ink-gold' : 'text-signal-green transition-colors'
          )}
        >
          {title}
        </h2>

        <p className="text-paper-white/80 font-medium text-lg leading-snug">{description}</p>

        <div className="mt-auto">
          <div
            className={cn(
              'w-full py-4 text-center font-bold uppercase tracking-widest text-xs rounded-pebble transition-all',
              isSelected
                ? 'bg-ink-gold text-charcoal shadow-glow-ink'
                : 'bg-charcoal-200 text-paper-white/40 hover:bg-charcoal-300'
            )}
          >
            {isSelected ? 'SELECTED' : 'CHOOSE THIS PATH'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
