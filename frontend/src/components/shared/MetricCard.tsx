import { LucideIcon } from 'lucide-react';

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
      rounded-tech p-6
      ${variant === 'outlined'
          ? 'bg-transparent border border-outline'
          : 'bg-surface-container'
        }
      ${elevationClasses}
      transition-all duration-medium-1 ease-spring
      ${className}
    `}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center">
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-on-surface-variant uppercase tracking-[0.04em] text-[0.7rem] font-mono">
          {label}
        </span>
      </div>
      <p className="text-display-small text-on-surface font-mono tabular-nums">{value}</p>
    </div>
  );
}
