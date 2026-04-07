import React from 'react';
import { motion } from 'framer-motion';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

interface SolidarityProgressProps {
  progress: number;
  className?: string;
  color?: string;
}

/**
 * SolidarityProgress - A kinetic progress indicator that replaces the static linear bar.
 * Uses asymmetric morphing shapes to signal progression without literal flora or bureaucratic motifs.
 */
export const SolidarityProgress: React.FC<SolidarityProgressProps> = ({
  progress,
  className = '',
  color = 'var(--sys-color-solidarityRed-base)',
}) => {
  return (
    <div
      className={`relative h-2 w-full bg-[var(--sys-color-charcoalBackground-base)] rounded-march overflow-hidden border border-[var(--sys-color-concreteGrey-base)]/20 ${className}`}
    >
      <motion.div
        className="absolute inset-y-0 left-0"
        initial={{ width: 0 }}
        animate={{
          width: `${progress}%`,
          backgroundColor: color,
        }}
        transition={KrDarkSpring}
      >
        {/* Kinetic "Blob" overlay that morphs as it moves */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 -right-4"
          style={{ backgroundColor: color, filter: 'blur(4px)', opacity: 0.6 }}
          animate={{
            borderRadius: [
              'var(--sys-shape-marchOrganic01)',
              'var(--sys-shape-maskAsymmetric01)',
              'var(--sys-shape-marchOrganic01)',
            ],
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  );
};
