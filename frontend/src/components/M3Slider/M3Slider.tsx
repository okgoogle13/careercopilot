/**
 * M3 Expressive Slider Component
 * Implements Material Design 3 slider with drag functionality
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import './M3Slider.css';

export interface M3SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * The color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Current value
   */
  value?: number;

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: number;

  /**
   * Minimum value
   * @default 0
   */
  min?: number;

  /**
   * Maximum value
   * @default 100
   */
  max?: number;

  /**
   * Step increment
   * @default 1
   */
  step?: number;

  /**
   * Callback when value changes
   */
  onChange?: (value: number) => void;

  /**
   * Show value label
   * @default false
   */
  showLabel?: boolean;

  /**
   * Show tick marks
   * @default false
   */
  showTicks?: boolean;

  /**
   * If true, slider is disabled
   */
  disabled?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive Slider component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Slider
 *   value={volume}
 *   onChange={setVolume}
 *   min={0}
 *   max={100}
 *   showLabel
 * />
 * ```
 */
export const M3Slider = React.forwardRef<HTMLDivElement, M3SliderProps>(
  (
    {
      color = 'primary',
      value: controlledValue,
      defaultValue = 50,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      showLabel = false,
      showTicks = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<HTMLDivElement | null>(null);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Clamp value to valid range
    const clampedValue = Math.min(max, Math.max(min, value));
    const percentage = ((clampedValue - min) / (max - min)) * 100;

    const updateValue = useCallback(
      (clientX: number) => {
        if (!trackRef.current || disabled) return;

        const rect = trackRef.current.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const newPercentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));

        let newValue = min + (newPercentage / 100) * (max - min);

        // Snap to step
        newValue = Math.round(newValue / step) * step;
        newValue = Math.max(min, Math.min(max, newValue));

        if (newValue !== value) {
          if (!isControlled) {
            setInternalValue(newValue);
          }
          onChange?.(newValue);
        }
      },
      [disabled, min, max, step, value, isControlled, onChange]
    );

    const handleMouseDown = useCallback(
      (event: React.MouseEvent) => {
        if (disabled) return;
        setIsDragging(true);
        updateValue(event.clientX);
      },
      [disabled, updateValue]
    );

    const handleMouseMove = useCallback(
      (event: MouseEvent) => {
        if (isDragging && !disabled) {
          updateValue(event.clientX);
        }
      },
      [isDragging, disabled, updateValue]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Handle drag events
    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const wrapperClassNames = [
      'm3-slider',
      `m3-slider--${color}`,
      isDragging && 'm3-slider--dragging',
      disabled && 'm3-slider--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Generate tick marks
    const ticks = [];
    if (showTicks) {
      const tickCount = Math.floor((max - min) / step) + 1;
      for (let i = 0; i < tickCount; i++) {
        const tickPercentage = (i / (tickCount - 1)) * 100;
        ticks.push(
          <span
            key={i}
            className="m3-slider__tick"
            style={{ left: `${tickPercentage}%` }}
          />
        );
      }
    }

    return (
      <div
        ref={ref}
        className={wrapperClassNames}
        data-testid="m3-slider"
        {...props}
      >
        {/* Slider track */}
        <div
          ref={trackRef}
          className="m3-slider__track-wrapper"
          onMouseDown={handleMouseDown}
        >
          {/* Background track */}
          <div className="m3-slider__track" />

          {/* Active track (filled portion) */}
          <div
            className="m3-slider__track-active"
            style={{ width: `${percentage}%` }}
          />

          {/* Tick marks */}
          {showTicks && <div className="m3-slider__ticks">{ticks}</div>}

          {/* Thumb (handle) */}
          <div
            className="m3-slider__thumb"
            style={{ left: `${percentage}%` }}
            role="slider"
            aria-valuenow={clampedValue}
            aria-valuemin={min}
            aria-valuemax={max}
            tabIndex={disabled ? -1 : 0}
          />
        </div>

        {/* Value label */}
        {showLabel && (
          <div
            className="m3-slider__label"
            style={{ left: `${percentage}%` }}
          >
            {Math.round(clampedValue)}
          </div>
        )}
      </div>
    );
  }
);

M3Slider.displayName = 'M3Slider';

export default M3Slider;
