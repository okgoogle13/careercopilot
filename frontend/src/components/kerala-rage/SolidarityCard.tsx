import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * SolidarityCardProps
 *
 * @property variant - The elevation/state of the card (standard, ghost, or active).
 * @property tone - The emotional color tone of the card.
 * @property density - The vertical rhythm/padding scale.
 * @property children - The content to be rendered within the card.
 */
export interface SolidarityCardProps extends HTMLMotionProps<'div'> {
  variant?: 'standard' | 'ghost' | 'active';
  tone?: 'neutral' | 'success' | 'danger';
  density?: 'cozy' | 'comfortable' | 'spacious';
  children: React.ReactNode;
}

/**
 * SolidarityCard (Slab Archetype)
 *
 * Kerala Rage kr-solidarity card component implementing the Slab archetype.
 * Provides semantic color token support and M3 Expressive motion physics.
 *
 * Design Principles:
 * 1. Uses --sys-color-* semantic tokens (never hardcoded colors)
 * 2. Reduced-motion compliance (opacity-only fallback)
 * 3. Accessible focus-within treatment for keyboard navigation
 * 4. Asymmetric border radius per Slab archetype (var(--sys-shape-radius-slab))
 * 5. Spring physics with viscous-breeze easing
 */
export const SolidarityCard: React.FC<SolidarityCardProps> = ({
  variant = 'standard',
  tone = 'neutral',
  density = 'comfortable',
  className,
  children,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Variant styles using semantic tokens
  const variantStyles = {
    standard: 'border-[var(--sys-color-concreteGrey-steps-2)]/20',
    ghost: 'bg-transparent border-[var(--sys-color-inkGold-base)]',
    active: 'border-[var(--sys-color-inkGold-base)] scale-[1.02]',
  };

  // Tone styles mapped to kerala-rage kr-solidarity tokens
  const toneStyles = {
    neutral: '',
    success: 'border-[var(--sys-color-kr-activistSmokeGreen-base)]/40',
    danger: 'border-[var(--sys-color-solidarityRed-base)]/40',
  };

  const densityStyles = {
    cozy: 'p-4',
    comfortable: 'p-6',
    spacious: 'p-8',
  };

  const motionProps = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        whileHover: variant !== 'active' ? { y: -4, scale: 1.01 } : undefined,
        transition: {
          type: 'spring' as const,
          stiffness: 320,
          damping: 26,
        },
      };

  return (
    <motion.div
      layout
      style={{
        backgroundColor:
          variant === 'ghost' ? 'transparent' : 'var(--sys-color-charcoalBackground-base)',
        borderRadius: 'var(--sys-shape-radius-slab)', // Slab archetype asymmetric radius
        boxShadow:
          variant === 'standard'
            ? '0 4px 16px rgba(0, 0, 0, 0.25)'
            : variant === 'active'
              ? '0 0 24px rgba(218, 246, 116, 0.2), 0 4px 16px rgba(0, 0, 0, 0.25)'
              : 'none',
      }}
      className={cn(
        'border relative overflow-hidden',
        'focus-within:ring-2 focus-within:ring-[var(--sys-color-inkGold-base)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--sys-color-charcoalBackground-base)]',
        variantStyles[variant],
        toneStyles[tone],
        densityStyles[density],
        className
      )}
      {...motionProps}
      {...props}
    >
      {/* TODO[asset]: Replace with screenprint-grit texture asset from kr-solidarity manifest */}
      {/* <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-texture-grit" /> */}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
