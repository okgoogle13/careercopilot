import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  variant?: 'outlined' | 'filled';
  hoverable?: boolean;
  className?: string;
}

/**
 * MetricCard - M3 Compliant Metric Display Component
 * 
 * Displays key metrics with icon, label, and value in a compact card format.
 * Enhanced with M3 elevation and motion for visual hierarchy.
 * 
 * **M3 Design Token Usage:**
 * - Shape: `rounded-tech` (24px 4px 24px 20px) - Precision aesthetic
 * - Elevation: `shadow-elevation-1` → `shadow-elevation-2` on hover
 * - Motion: M3 spring easing for smooth transitions
 * - Colors: Semantic surface tokens
 * - Typography: M3 display scale for values, mono font for data
 */
export function MetricCard({
  icon: Icon,
  label,
  value,
  iconColor = 'text-primary',
  variant = 'outlined',
  hoverable = true,
  className = '',
}: MetricCardProps) {
  const elevationClasses = hoverable
    ? 'shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-1'
    : '';

  return (
    <div
      className={`
      rounded-stone p-6
      ${variant === 'outlined'
          ? 'bg-transparent border border-concrete-grey/10'
          : 'bg-[var(--color-asphalt-black)]'
        }
      ${elevationClasses}
      transition-all duration-300 ease-viscous-breeze
      ${className}
    `}
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          className="w-10 h-10 bg-[var(--color-asphalt-black)]-light rounded-seed flex items-center justify-center text-ink-gold"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 500, damping: 27 }}
        >
          <Icon className={`w-5 h-5`} />
        </motion.div>
        <span className="text-concrete-grey/60 uppercase tracking-[0.04em] text-[0.7rem] font-annotation">
          {label}
        </span>
      </div>
      <p className="text-3xl text-paper-white font-annotation tabular-nums">{value}</p>
    </div>
  );
}
