import React from 'react';
import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * SolidarityCardProps
 * 
 * @property variant - The elevation/state of the card (standard, ghost, or active).
 * @property tone - [Hi-Fi Hook] The emotional color tone of the card.
 * @property density - [Hi-Fi Hook] The vertical rhythm/padding scale.
 * @property children - The content to be rendered within the card.
 */
export interface SolidarityCardProps extends HTMLMotionProps<'div'> {
  variant?: 'standard' | 'ghost' | 'active';
  tone?: 'neutral' | 'success' | 'danger';
  density?: 'cozy' | 'comfortable' | 'spacious';
  children: React.ReactNode;
}

/**
 * SolidarityCard (Stone)
 * 
 * Foundational container for the Kerala Rage design system. 
 * Implements the "Stone" primitive with organic radii and viscous shadows.
 * 
 * Pattern Principles:
 * 1. Reduced-motion compliance (opacity-only fallback).
 * 2. Accessible focus-within treatment for keyboard navigation.
 * 3. TODO[asset] blocks for human/vision-agent image integration.
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

  const variantStyles = {
    standard: 'bg-asphalt-black border-white/5 shadow-viscous',
    ghost: 'bg-transparent border-wattle-gold shadow-none',
    active: 'bg-asphalt-black border-wattle-gold shadow-wattle-glow scale-[1.02]',
  };

  // Tone & Density Hooks (Ready for Hi-Fi mapping in Stage 2)
  const toneStyles = {
    neutral: '',
    success: '', // TODO[hifi]: Map to gumLeafGreen variants
    danger: '',  // TODO[hifi]: Map to waratahRed variants
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
      className={cn(
        'rounded-stone border relative overflow-hidden',
        'focus-within:ring-2 focus-within:ring-wattle-gold focus-within:ring-offset-2 focus-within:ring-offset-asphalt-black',
        variantStyles[variant],
        toneStyles[tone],
        densityStyles[density],
        className
      )}
      {...motionProps}
      {...props}
    >
      {/* TODO[asset]: Human will replace with screenprint-grit texture asset. */}
      {/* <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-texture-grit" /> */}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
