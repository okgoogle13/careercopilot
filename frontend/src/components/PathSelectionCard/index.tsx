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
  isSelected = false
}) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={cn(
        "relative w-[320px] p-8 bg-charcoal-100 border-2 transition-all",
        "rounded-stone shadow-viscous cursor-pointer overflow-hidden",
        isSelected ? "border-ink-gold ring-4 ring-ink-gold/20" : "border-blueprint-grey/20"
      )}
      role="button"
      aria-pressed={isSelected}
    >
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('/assets/blueprint-grid.svg')] z-0" />

      <div className="relative z-10 flex flex-col gap-12 h-full">
        <h2 className={cn(
          "text-[72px] leading-[0.85] font-solidarity-900 uppercase tracking-tighter",
          isSelected ? "text-ink-gold" : "text-signal-green transition-colors"
        )}>
          {title}
        </h2>

        <p className="text-paper-white/80 font-medium text-lg leading-snug">
          {description}
        </p>

        <div className="mt-auto">
          <div className={cn(
            "w-full py-4 text-center font-bold uppercase tracking-widest text-xs rounded-pebble transition-all",
            isSelected ? "bg-ink-gold text-charcoal shadow-glow-ink" : "bg-charcoal-200 text-paper-white/40 hover:bg-charcoal-300"
          )}>
            {isSelected ? "SELECTED" : "CHOOSE THIS PATH"}
          </div>
        </div>
      </div>

      {/* Kerala Palm Tree Motif in background */}
      <div className="absolute bottom-[-10%] right-[-10%] opacity-10 pointer-events-none grayscale z-0">
        <svg className="w-40 h-40 fill-paper-white" viewBox="0 0 100 100">
           <path d="M50,90 L50,40 M50,45 C70,45 80,30 80,20 M50,45 C30,45 20,30 20,20 M50,55 C75,55 85,45 85,35" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </motion.div>
  );
};
