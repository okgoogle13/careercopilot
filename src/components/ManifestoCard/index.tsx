import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ManifestoCardProps {
  /** The bold declaration title */
  title: string;
  /** The manifesto content text */
  content: string;
  /** Label for the primary action button */
  actionLabel?: string;
  /** Callback triggered on action click */
  onAction?: () => void;
  /** Optional background motif visibility */
  showMotif?: boolean;
  /** Optional additional classes for the container */
  className?: string;
}

/**
 * ManifestoCard
 *
 * A high-impact Solidarity mode component enforcing M3 Expressive principles.
 * Features Kerala Rage morphology (torn edges, viscous shadows).
 */
export const ManifestoCard: React.FC<ManifestoCardProps> = ({
  title,
  content,
  actionLabel = "STRENGTH RISING",
  onAction,
  showMotif = true,
  className
}) => {
  return (
    <motion.article
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 12 }}
      className={cn(
        "relative p-8 md:p-12 max-w-lg overflow-hidden",
        "bg-charcoal-100 shadow-viscous clip-path-tear",
        className
      )}
      aria-label={`Manifesto: ${title}`}
      role="article"
    >
      {/* Red Flag Accent */}
      <div className="absolute top-8 right-8 w-1 h-12 bg-[DEPRECATED_STYLE]-red" />

      {/* Hero Title */}
      <h2 className={cn(
        "mb-8",
        "text-display-lg font-solidarity-800 text-[DEPRECATED_STYLE]-red"
      )}>
        {title}
      </h2>

      {/* Body Content */}
      <p className={cn(
        "mb-12",
        "text-body-lg font-direct-action-450 text-paper-white/80"
      )}>
        {content}
      </p>

      {/* Action CTA */}
      {actionLabel && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "inline-block px-8 py-3",
            "bg-baru-gold text-charcoal shadow-hover-rise rounded-pebble",
            "font-bold uppercase tracking-widest text-sm"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onAction?.();
          }}
          aria-label={`Commit to ${actionLabel}`}
        >
          {actionLabel}
        </motion.button>
      )}

      {/* Background Motif: Kerala Elephant */}
      {showMotif && (
        <div className="absolute bottom-[-20%] right-[-10%] w-48 h-48 opacity-10 pointer-events-none z-0">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-baru-gold">
            {/* Abstract Elephant Head & Trunk */}
            <path d="M70,30 C70,15 55,10 45,10 C30,10 20,25 20,40 C20,55 30,60 30,80 L40,85 C40,65 35,60 35,40 C35,30 40,25 50,25 C60,25 60,35 60,40 L60,80 L70,80 L70,30 Z" />
          </svg>
        </div>
      )}
    </motion.article>
  );
};
