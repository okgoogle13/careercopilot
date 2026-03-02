import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMode } from '@/hooks/use-mode';

/**
 * ManifestoSlabProps
 * 
 * @property title - High-impact declaration title (uses energetic/restrained Fraunces preset).
 * @property subtitle - Optional supporting declaration (uses curator's hand accent).
 */
export interface ManifestoSlabProps extends HTMLMotionProps<'div'> {
  title: string;
  subtitle?: string;
}

/**
 * ManifestoSlab (Slab)
 * 
 * Structural primitive for high-impact headlines and hero sections.
 * Implements the "Slab" primitive with sharp but softened radii.
 * 
 * @mission Technically solid, accessible, and correctly wired to the Fraunces presets.
 */
export const ManifestoSlab: React.FC<ManifestoSlabProps> = ({
  title,
  subtitle,
  className,
  ...props
}) => {
  const { mode } = useMode();
  const shouldReduceMotion = useReducedMotion();

  // Fraunces Preset: Energetic for hero typography, Restrained for supporting copy.
  const frauncesPreset = mode === 'KrDark' ? 'var(--type-energetic)' : 'var(--type-restrained)';

  const motionProps = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
      };

  return (
    <motion.div
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 30,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      className={cn(
        'bg-asphalt-black border-solidarity-red/20 border-l-[6px] p-10 md:p-16',
        'rounded-sm relative overflow-hidden z-20',
        'shadow-elevated',
        className
      )}
      {...motionProps}
      {...props}
    >
      {/* TODO[asset]: Human will replace with a motif background overlay. */}
      {/* <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none z-0 bg-motif-signal" /> */}

      <div className="relative z-10 flex flex-col gap-4">
        {subtitle && (
          <span 
            className="font-curator text-solidarity-red text-2xl rotate-quirky-ccw"
            aria-hidden="true"
          >
            {subtitle}
          </span>
        )}
        <h1 
          className="font-proclamation text-paper-white text-display-hero leading-none uppercase break-words"
          style={{
            fontFamily: 'Fraunces, serif',
            fontVariationSettings: frauncesPreset,
          }}
        >
          {title}
        </h1>
      </div>
    </motion.div>
  );
};
