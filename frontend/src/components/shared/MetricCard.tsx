import { LucideIcon } from 'lucide-react';
import React from 'react';

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
 */
export function MetricCard({
  icon: Icon,
  label,
  value,
  iconColor = 'text-[var(--color-wattle-gold)]',
  variant = 'outlined',
  hoverable = true,
  className = '',
}: MetricCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-stone)',
    padding: 'var(--spacing-lg)',
    backgroundColor: variant === 'filled' ? 'var(--color-specimen-night)' : 'transparent',
    border: '1px solid rgba(240, 234, 214, 0.1)',
    transition: 'all var(--duration-standard) var(--ease-viscous-breeze)',
    boxShadow: isHovered && hoverable ? 'var(--shadow-standard)' : 'var(--shadow-subtle)',
    transform: isHovered && hoverable ? 'translateY(-4px)' : 'none',
  };

  return (
    <div
      style={cardStyle}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(var(--color-parchment) 1px, transparent 1px)', backgroundSize: '12px 12px' }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <span className="text-[var(--on-surface-parchment-dim)] text-[0.7rem] font-annotation font-medium tracking-widest uppercase">
            {label}
          </span>
        </div>
        <p className="text-3xl font-mono text-[var(--color-parchment)] tabular-nums tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
