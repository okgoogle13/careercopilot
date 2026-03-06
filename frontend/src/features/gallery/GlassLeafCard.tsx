import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMode } from '@/hooks/use-mode';

interface GlassLeafCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'heavy';
}

const GlassLeafCard = React.forwardRef<HTMLDivElement, GlassLeafCardProps>(
  ({ className, children, intensity = 'medium', ...props }, ref) => {
    const { mode } = useMode();

    // Glassmorphism intensity mapping
    const blurIntensity = {
      light: 'backdrop-blur-sm',
      medium: 'backdrop-blur-md',
      heavy: 'backdrop-blur-xl',
    };

    const bgOpacity = {
      light:
        mode === 'KrDark'
          ? 'bg-surface-gallery-glass-medium/60'
          : 'bg-surface-laboratory-glass-medium/60',
      medium:
        mode === 'KrDark'
          ? 'bg-surface-gallery-glass-medium/75'
          : 'bg-surface-laboratory-glass-medium/80',
      heavy:
        mode === 'KrDark'
          ? 'bg-surface-gallery-glass-medium/90'
          : 'bg-surface-laboratory-glass-medium/90',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative overflow-hidden border',
          blurIntensity[intensity],
          bgOpacity[intensity],
          mode === 'KrDark' ? 'border-white/10' : 'border-white/5',
          className
        )}
        style={{
          borderRadius: mode === 'KrDark' ? 'var(--radius-leaf)' : '12px',
          boxShadow:
            mode === 'KrDark'
              ? '0 8px 32px rgba(20, 18, 16, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 4px 24px rgba(20, 18, 16, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
        whileHover={{
          y: -6,
          scale: 1.02,
          transition: { type: 'spring', stiffness: 300, damping: 20 },
        }}
        {...props}
      >
        {/* Refraction layer - simulates light passing through glass */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              mode === 'KrDark'
                ? 'linear-gradient(135deg, rgba(212, 168, 75, 0.1) 0%, transparent 50%, rgba(196, 92, 75, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(107, 158, 122, 0.08) 0%, transparent 50%, rgba(138, 136, 149, 0.05) 100%)',
          }}
        />

        {/* Leaf-shaped highlight (top-left corner) */}
        {mode === 'KrDark' && (
          <motion.div
            className="absolute -top-12 -left-12 w-32 h-32 rounded-sentry opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(212, 168, 75, 0.4), transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 p-6">{children}</div>

        {/* Bottom edge glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              mode === 'KrDark'
                ? 'linear-gradient(90deg, transparent, rgba(212, 168, 75, 0.5), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(138, 136, 149, 0.3), transparent)',
          }}
        />
      </motion.div>
    );
  }
);
GlassLeafCard.displayName = 'GlassLeafCard';

export { GlassLeafCard };
