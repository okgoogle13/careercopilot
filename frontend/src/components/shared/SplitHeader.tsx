import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMode } from '@/hooks/use-mode';

interface SplitHeaderProps {
  trunkText: string;
  vineText: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
}

const SplitHeader: React.FC<SplitHeaderProps> = ({
  trunkText,
  vineText,
  subtitle,
  alignment = 'left',
}) => {
  const { mode } = useMode();

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={cn('flex flex-col gap-2', alignmentClasses[alignment])}>
      {/* Solidarity Composition - Proclamation + Bloom */}
      <div className="relative inline-block">
        {/* Bottom Layer: Proclamation (Libre Bodoni) */}
        <motion.h1
          className={cn(
            'font-proclamation font-black uppercase tracking-tighter leading-none',
            mode === 'KrDark' ? 'text-6xl md:text-7xl' : 'text-5xl md:text-6xl'
          )}
          style={{
            color: 'var(--kr-color-paper-white-base)',
          }} /* V-004 FIX: nocturnal canopy dark-mode text token; replaces banned Gallery parchment */
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.55, 1.4] }}
        >
          {trunkText}
        </motion.h1>

        {/* Top Layer: Bloom (Fraunces with WONK) */}
        <motion.span
          className={cn(
            'font-display absolute text-ink-gold',
            mode === 'KrDark' ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl'
          )}
          style={{
            fontVariationSettings:
              mode === 'KrDark'
                ? "'SOFT' 50, 'WONK' 1, 'wght' 600"
                : "'SOFT' 20, 'WONK' 0, 'wght' 500",
            transform: mode === 'KrDark' ? 'rotate(-2deg)' : 'rotate(0deg)',
            top: mode === 'KrDark' ? '-0.5rem' : '0',
            left: mode === 'KrDark' ? '1rem' : '0.5rem',
          }}
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: mode === 'KrDark' ? -2 : 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
        >
          {vineText}
        </motion.span>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className={cn(
            'font-primary text-secondary-worker-ash max-w-2xl',
            mode === 'KrDark' ? 'text-lg' : 'text-base'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export { SplitHeader };
