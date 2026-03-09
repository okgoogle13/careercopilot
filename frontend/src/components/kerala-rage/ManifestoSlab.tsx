import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * ManifestoSlabProps
 *
 * @property title - High-impact declaration title (uses Fraunces display font).
 * @property subtitle - Optional supporting declaration.
 */
export interface ManifestoSlabProps extends HTMLMotionProps<'div'> {
  title: string;
  subtitle?: string;
}

/**
 * ManifestoSlab (Cabinet Archetype)
 *
 * Kerala Rage kr-solidarity hero section component implementing the Cabinet archetype.
 * Structural primitive for high-impact headlines and manifestos.
 *
 * Design Principles:
 * 1. Uses --sys-color-* semantic tokens (never hardcoded colors)
 * 2. Fraunces display typography with variable font axes
 * 3. Minimal border radius (Cabinet archetype is structural)
 * 4. Spring physics with viscous-breeze easing
 * 5. Extreme contrast typography (M3 Expressive standard)
 */
export const ManifestoSlab: React.FC<ManifestoSlabProps> = ({
  title,
  subtitle,
  className,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 30,
        },
      };

  return (
    <motion.div
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-base)',
        borderLeft: '6px solid var(--sys-color-solidarityRed-steps-2)',
        borderRadius: 'var(--shape-scaffoldSlab01)', // Cabinet archetype minimal structural radius
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
      }}
      className={cn('p-10 md:p-16 relative overflow-hidden z-20', className)}
      {...(motionProps as any)}
      {...(props as any)}
    >
      {/* TODO[asset]: Replace with Kerala Rage motif background overlay from manifest */}
      {/* <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none z-0 bg-motif-signal" /> */}

      <div className="relative z-10 flex flex-col gap-4">
        {subtitle && (
          <span
            style={{
              fontFamily: 'var(--sys-type-font-work-sans, "Work Sans", sans-serif)',
              color: 'var(--sys-color-solidarityRed-base)',
            }}
            className="text-2xl font-semibold"
            aria-label={subtitle}
          >
            {subtitle}
          </span>
        )}
        <h1
          style={{
            fontFamily: 'var(--sys-type-font-fraunces, "Fraunces", serif)',
            color: 'var(--sys-color-worker-ash-base)',
            fontWeight: 700,
            fontVariationSettings: '"wght" 700, "SOFT" 0, "WONK" 1',
          }}
          className="text-6xl md:text-8xl leading-none uppercase break-words"
        >
          {title}
        </h1>
      </div>
    </motion.div>
  );
};
