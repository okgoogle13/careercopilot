import { LucideIcon } from 'lucide-react';
import React from 'react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  annotation?: string;
  iconColor?: string;
  variant?: 'outlined' | 'filled';
  hoverable?: boolean;
  className?: string;
}

/**
<<<<<<< HEAD
 * MetricCard - Northcote Curio V3.1 Metric Display Component
=======
 * MetricCard - KeralaRage KrSolidarity V3.1 Metric Display Component
>>>>>>> restoration-KR-Rage-Figma-v2.0
 */
export function MetricCard({
  icon: Icon,
  label,
  value,
  annotation,
<<<<<<< HEAD
  iconColor = 'text-[var(--color-wattle-gold)]',
=======
  iconColor = 'text-[var(--color-ink-gold)]',
>>>>>>> restoration-KR-Rage-Figma-v2.0
  variant = 'outlined',
  hoverable = true,
  className = '',
}: MetricCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-stone)',
    padding: 'var(--spacing-lg)',
<<<<<<< HEAD
    backgroundColor: variant === 'filled' ? 'var(--color-specimen-night)' : 'transparent',
=======
    backgroundColor: variant === 'filled' ? 'var(--color-asphalt-black)' : 'transparent',
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
        style={{ backgroundImage: 'radial-gradient(var(--color-parchment) 1px, transparent 1px)', backgroundSize: '12px 12px' }}
=======
        style={{ backgroundImage: 'radial-gradient(var(--color-paper-white) 1px, transparent 1px)', backgroundSize: '12px 12px' }}
>>>>>>> restoration-KR-Rage-Figma-v2.0
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <span className="text-[0.7rem] font-annotation font-medium tracking-widest uppercase opacity-70">
            {label}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
<<<<<<< HEAD
          <p className="text-3xl font-annotation font-black text-on-surface shadow-layered-wattle">
=======
          <p className="text-3xl font-annotation font-black text-on-surface shadow-layered-ink">
>>>>>>> restoration-KR-Rage-Figma-v2.0
            {value}
          </p>
          {annotation && (
            <span className="text-curator-annotation rotate-quirky-ccw text-xs transform -translate-y-2 translate-x-1">
              {annotation}
            </span>
          )}
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> restoration-KR-Rage-Figma-v2.0
