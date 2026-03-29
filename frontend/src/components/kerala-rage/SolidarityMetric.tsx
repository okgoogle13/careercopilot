import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Placard } from '../ui/Placard';
import { cn } from '../../lib/utils';

interface SolidarityMetricProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  annotation?: string;
  iconColor?: string;
  className?: string;
  elevation?: 'flat' | 'raised' | 'floating';
}

/**
 * SolidarityMetric - KeralaRage KrSolidarity V6.0 Metric Display
 * Archetype: Placard (Wrapped)
 */
export const SolidarityMetric: React.FC<SolidarityMetricProps> = ({
  icon: Icon,
  label,
  value,
  annotation,
  iconColor = 'text-[var(--sys-color-inkGold-base)]',
  className = '',
  elevation = 'raised',
}) => {
  return (
    <Placard
      elevation={elevation}
      style={{
        backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
      }}
      className={className}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            style={{
              borderRadius: 'var(--sys-shape-marchOrganic01)',
            }}
            className="w-10 h-10 bg-white/5 flex items-center justify-center border border-white/10"
          >
            <Icon className={cn('w-5 h-5', iconColor)} />
          </div>
          <span
            style={{
              fontFamily: 'var(--sys-type-fontFamilies-mono)',
              color: 'var(--sys-color-worker-ash-base)',
            }}
            className="text-[0.7rem] font-medium tracking-widest uppercase opacity-70"
          >
            {label}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <p
            style={{
              fontFamily: 'var(--sys-type-fontFamilies-mono)',
            }}
            className="text-3xl font-black text-paper-white-base shadow-layered-ink"
          >
            {value}
          </p>
          {annotation && (
            <span className="text-curator-annotation rotate-quirky-ccw text-xs transform -translate-y-2 translate-x-1 opacity-80">
              {annotation}
            </span>
          )}
        </div>
      </div>
    </Placard>
  );
};
