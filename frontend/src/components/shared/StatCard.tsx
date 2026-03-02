import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  iconColor = 'text-tertiary',
  className = '',
}: StatCardProps) {
  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`;

  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.01,
        boxShadow: 'var(--sys-elevation-level3)',
      }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20,
      }}
      className={`
        bg-surface-container rounded-tech p-8 
        flex flex-col items-center justify-center 
        relative overflow-hidden
        shadow-elevation-1 border border-outline-variant
        ${className}
      `}
      style={{
        backgroundImage: noiseOverlay,
        backgroundSize: '150px 150px',
      }}
    >
      <div className="relative z-10 flex flex-col items-center">
        <Icon className={`w-12 h-12 ${iconColor} mb-4`} />
        <p className="text-display-large mb-6 text-on-surface font-black tabular-nums">{value}</p>
        <p className="text-on-surface-variant text-label-large uppercase tracking-widest font-mono">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
