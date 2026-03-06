import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HaloPulse {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  hasTrail?: boolean;
}

interface HaloPulsesProps {
  count?: number;
  className?: string;
}

export function HaloPulses({
  count = 16,
  className = 'fixed inset-0 pointer-events-none overflow-hidden z-10',
}: HaloPulsesProps) {
  const [pulses, setPulses] = useState<HaloPulse[]>([]);

  useEffect(() => {
    const newPulses = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100, // Use full height of container
      delay: Math.random() * 8,
      duration: 7 + Math.random() * 5,
      size: [8, 12, 16][Math.floor(Math.random() * 3)],
      hasTrail: i === 0,
    }));
    setPulses(newPulses);
  }, [count]);

  return (
    <div className={className}>
      {pulses.map((pulse) => (
        <div
          key={pulse.id}
          className="absolute"
          style={{ left: `${pulse.x}%`, top: `${pulse.y}%` }}
        >
          {pulse.hasTrail && (
            <motion.div
              className="absolute rounded-full opacity-30"
              style={{
                width: pulse.size * 2,
                height: 4,
                background: 'linear-gradient(90deg, transparent, var(--sys-color-inkGold-base))',
                filter: 'blur(4px)',
                transformOrigin: 'left center',
              }}
              animate={{
                opacity: [0, 0.4, 0],
                width: [0, 100, 0],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: pulse.duration,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: pulse.size,
              height: pulse.size,
              background:
                'radial-gradient(circle, var(--sys-color-inkGold-base) 0%, var(--sys-color-stencilYellow-base) 35%, var(--sys-color-solidaritySmokeOrange-base) 65%, transparent 100%)',
              filter: 'blur(2px)',
              boxShadow: '0 0 8px var(--sys-color-inkGold-base)',
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.4, 1],
              x: [0, Math.random() * 60 - 30, 0],
              y: [0, Math.random() * 60 - 30, 0],
            }}
            transition={{
              duration: pulse.duration,
              delay: pulse.delay,
              repeat: Infinity,
              ease: [0.45, 0.05, 0.55, 0.95], // cubic-bezier equivalence
            }}
          />
        </div>
      ))}
    </div>
  );
}
