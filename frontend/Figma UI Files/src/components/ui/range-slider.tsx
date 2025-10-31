import React, { useState, useRef, useEffect, forwardRef } from 'react';

export interface RangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  disabled?: boolean;
  className?: string;
  showLabels?: boolean;
  formatLabel?: (value: number) => string;
}

export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value = [min, max],
      onChange,
      disabled,
      className = '',
      showLabels = true,
      formatLabel = (v) => v.toString(),
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState<[number, number]>(value);
    const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const getPercentage = (val: number) => {
      return ((val - min) / (max - min)) * 100;
    };

    const getValueFromPosition = (clientX: number) => {
      if (!trackRef.current) return min;

      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const rawValue = min + (percentage / 100) * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;

      return Math.max(min, Math.min(max, steppedValue));
    };

    const handleMouseDown = (thumb: 'min' | 'max') => (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setActiveThumb(thumb);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!activeThumb || disabled) return;

      const newValue = getValueFromPosition(e.clientX);

      if (activeThumb === 'min') {
        const newMin = Math.min(newValue, localValue[1]);
        const newLocalValue: [number, number] = [newMin, localValue[1]];
        setLocalValue(newLocalValue);
        onChange?.(newLocalValue);
      } else {
        const newMax = Math.max(newValue, localValue[0]);
        const newLocalValue: [number, number] = [localValue[0], newMax];
        setLocalValue(newLocalValue);
        onChange?.(newLocalValue);
      }
    };

    const handleMouseUp = () => {
      setActiveThumb(null);
    };

    useEffect(() => {
      if (activeThumb) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [activeThumb, localValue]);

    const minPercent = getPercentage(localValue[0]);
    const maxPercent = getPercentage(localValue[1]);

    return (
      <div ref={ref} className={`w-full ${className}`}>
        <div className="relative pt-6 pb-4">
          {/* Track */}
          <div
            ref={trackRef}
            className="relative h-2 rounded-full bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border border-[var(--glass-border)]"
          >
            {/* Active Range */}
            <div
              className="absolute h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] shadow-[var(--shadow-glow-aurora)]"
              style={{
                left: `${minPercent}%`,
                right: `${100 - maxPercent}%`,
              }}
            />

            {/* Min Thumb */}
            <div
              onMouseDown={handleMouseDown('min')}
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                w-5 h-5 rounded-full cursor-pointer
                bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)]
                border-2 border-white
                shadow-lg transition-all duration-200
                ${activeThumb === 'min' ? 'scale-125 shadow-[var(--shadow-glow-aurora)]' : 'hover:scale-110'}
                ${disabled && 'opacity-50 cursor-not-allowed'}
              `}
              style={{ left: `${minPercent}%` }}
            >
              {showLabels && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className="px-2 py-1 rounded-[var(--radius-md)] bg-[var(--surface-container)] border border-[var(--glass-border)] text-xs text-[var(--on-surface)]">
                    {formatLabel(localValue[0])}
                  </div>
                </div>
              )}
            </div>

            {/* Max Thumb */}
            <div
              onMouseDown={handleMouseDown('max')}
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                w-5 h-5 rounded-full cursor-pointer
                bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)]
                border-2 border-white
                shadow-lg transition-all duration-200
                ${activeThumb === 'max' ? 'scale-125 shadow-[var(--shadow-glow-aurora)]' : 'hover:scale-110'}
                ${disabled && 'opacity-50 cursor-not-allowed'}
              `}
              style={{ left: `${maxPercent}%` }}
            >
              {showLabels && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className="px-2 py-1 rounded-[var(--radius-md)] bg-[var(--surface-container)] border border-[var(--glass-border)] text-xs text-[var(--on-surface)]">
                    {formatLabel(localValue[1])}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Min/Max Labels */}
          {showLabels && (
            <div className="flex justify-between mt-2 text-sm text-[var(--on-surface-variant)]">
              <span>{formatLabel(min)}</span>
              <span>{formatLabel(max)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

RangeSlider.displayName = 'RangeSlider';
