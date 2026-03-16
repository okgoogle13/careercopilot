import React from 'react';
import { Compass } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

/**
 * **THE KR SOLIDARITY EMBLEM**
 *
 * Canonical logo for CareerCopilot.
 * Replaces the Zero-Flora 🦄 with the Sentry Compass.
 */
export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
  };

  const iconSizeMap = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className={cn('flex flex-col items-start', className)}>
      <div
        className={cn(
          'rounded-march flex items-center justify-center bg-[var(--sys-color-primary-container)] text-[var(--sys-color-on-primary-container)] shadow-lg mb-4',
          sizeMap[size]
        )}
      >
        <Compass className={cn('animate-in spin-in-12 duration-1000', iconSizeMap[size])} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h4 className="text-[var(--sys-color-primary)] text-xl font-black uppercase tracking-tight leading-none">
            CareerCopilot
          </h4>
          <p className="text-[var(--sys-color-on-surface-variant)] mt-1 uppercase tracking-widest font-mono text-[10px]">
            YOUR AI JOB PARTNER
          </p>
        </div>
      )}
    </div>
  );
}
