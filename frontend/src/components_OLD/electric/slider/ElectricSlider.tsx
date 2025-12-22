/**
 * ELECTRIC ALCHEMIST: SLIDER COMPONENT
 * Range slider with Tactile Press thumb
 */

import * as React from 'react';
import { cn } from '../../../lib/cn';

export interface ElectricSliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
}

export const ElectricSlider = React.forwardRef<HTMLInputElement, ElectricSliderProps>(
  ({ className, label, showValue = false, id, min = 0, max = 100, value, ...props }, ref) => {
    const sliderId = id || React.useId();
    const percentage = value ? ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100 : 0;

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label htmlFor={sliderId} className="text-ai">
              {label}
            </label>
            {showValue && <span className="text-data">{value}</span>}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            id={sliderId}
            min={min}
            max={max}
            value={value}
            className={cn(
              'w-full h-2 rounded-badge appearance-none cursor-pointer',
              'bg-surface-container',
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:h-5',
              '[&::-webkit-slider-thumb]:w-5',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:bg-tertiary',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:transition-transform',
              '[&::-webkit-slider-thumb]:hover:scale-110',
              '[&::-webkit-slider-thumb]:active:scale-95',
              '[&::-moz-range-thumb]:h-5',
              '[&::-moz-range-thumb]:w-5',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:bg-tertiary',
              '[&::-moz-range-thumb]:border-0',
              '[&::-moz-range-thumb]:cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          <div
            className="absolute top-0 left-0 h-2 rounded-badge bg-tertiary pointer-events-none transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ElectricSlider.displayName = 'ElectricSlider';
