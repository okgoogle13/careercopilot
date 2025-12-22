import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  variant?: 'outlined' | 'filled';
  className?: string;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  iconColor = 'text-[#D0BCFF]',
  variant = 'outlined',
  className = ''
}: MetricCardProps) {
  return (
    <div className={`
      rounded-tech p-6
      ${variant === 'outlined'
        ? 'bg-transparent border border-[var(--color-border)]'
        : 'bg-[var(--color-surface-container)]'
      }
      ${className}
    `}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center">
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-on-surface-variant uppercase tracking-[0.04em] text-[0.7rem] font-mono">
          {label}
        </span>
      </div>
      <p className="text-5xl text-foreground font-mono tabular-nums">{value}</p>
    </div>
  );
}
