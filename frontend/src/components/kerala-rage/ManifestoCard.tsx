import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ActionButton } from './ActionButton';

export interface ManifestoCardProps {
  title: string;
  content: string;
  actionLabel?: string;
  onAction?: () => void;
  showMotif?: boolean;
  className?: string;
  tone?: 'neutral' | 'success' | 'danger';
}

/**
 * ManifestoCard (Slab/Stone Hybrid)
 *
 * High-impact component for bold declarations.
 * Pattern Principles:
 * 1. Unified spring motion with the Stone primitive.
 * 2. Visual anchoring via the "Red Flag" accent.
 */
export const ManifestoCard: React.FC<ManifestoCardProps> = ({
  title,
  content,
  actionLabel = 'STRENGTH RISING',
  onAction,
  showMotif = true,
  className,
  tone = 'neutral',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: {
          type: 'spring' as const,
          stiffness: 320,
          damping: 26,
        },
      };

  const toneStyles = {
    neutral: 'border-white/10',
    success: 'border-solidarity-green/20',
    danger: 'border-solidarity-red/20',
  };

  return (
    <motion.article
      layout
      {...motionProps}
      className={cn(
        'relative p-8 md:p-12 max-w-2xl overflow-hidden',
        'bg-asphalt-black rounded-stone border shadow-viscous',
        toneStyles[tone],
        className
      )}
    >
      {/* Red Flag Accent */}
      <div className="absolute top-8 right-8 w-1 h-12 bg-solidarity-red" />

      {/* Hero Title */}
      <h2 className="mb-8 text-display-hero font-solidarity text-solidarity-red leading-tight uppercase tracking-tighter">
        {title}
      </h2>

      {/* Body Content */}
      <p className="mb-12 text-lg font-direct-action text-paper-white/80 leading-relaxed max-w-lg">
        {content}
      </p>

      {/* Action CTA */}
      {actionLabel && (
        <ActionButton
          variant="primary"
          label={actionLabel}
          onClick={onAction}
          className="px-10 py-4 text-base"
        />
      )}

      {/* Background Motif: Placeholder SVG for Elephant */}
      {showMotif && (
        <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 opacity-5 pointer-events-none z-0">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full fill-ink-gold"
          >
            <path d="M70,30 C70,15 55,10 45,10 C30,10 20,25 20,40 C20,55 30,60 30,80 L40,85 C40,65 35,60 35,40 C35,30 40,25 50,25 C60,25 60,35 60,40 L60,80 L70,80 L70,30 Z" />
          </svg>
        </div>
      )}
    </motion.article>
  );
};
