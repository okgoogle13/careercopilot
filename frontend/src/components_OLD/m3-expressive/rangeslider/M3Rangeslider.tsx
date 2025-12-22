/**
 * M3 Expressive RangeSlider Component
 * Implements Material Design 3 RangeSlider for CareerCopilot
 *
 * Dual handle slider. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Rangeslider.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useCallback } from 'react';
import './M3Rangeslider.css';

export interface M3RangesliderProps {
  /**
   * Current range values [min, max]
   */
  value?: [number, number];

  /**
   * Default values (uncontrolled)
   */
  defaultValue?: [number, number];

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
   * Step value
   * @default 1
   */
  step?: number;

  /**
   * Change handler
   */
  onChange?: (value: [number, number]) => void;

  /**
   * If true, slider is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, shows value labels
   * @default false
   */
  showValues?: boolean;

  /**
   * Label text
   */
  label?: string;

  /**
   * Color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive RangeSlider component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3RangeSlider value={[20, 80]} onChange={(val) => console.log(val)} />
 * ```
 */
export const M3Rangeslider: React.FC<M3RangesliderProps> = ({
  value: controlledValue,
  defaultValue = [0, 100],
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  showValues = false,
  label,
  color = 'primary',
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState<[number, number]>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const [minValue, maxValue] = isControlled ? controlledValue : internalValue;

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value);
      const newValue: [number, number] = [Math.min(newMin, maxValue), maxValue];
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [maxValue, isControlled, onChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value);
      const newValue: [number, number] = [minValue, Math.max(newMax, minValue)];
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [minValue, isControlled, onChange]
  );

  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  const classNames = [
    'm3-rangeslider',
    `m3-rangeslider--${color}`,
    disabled && 'm3-rangeslider--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      {label && <label className="m3-rangeslider__label">{label}</label>}
      <div className="m3-rangeslider__container">
        <div className="m3-rangeslider__track">
          <div
            className="m3-rangeslider__fill"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          disabled={disabled}
          className="m3-rangeslider__input m3-rangeslider__input--min"
          aria-label={`${label || 'Range'} minimum`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          disabled={disabled}
          className="m3-rangeslider__input m3-rangeslider__input--max"
          aria-label={`${label || 'Range'} maximum`}
        />
        {showValues && (
          <div className="m3-rangeslider__values">
            <span className="m3-rangeslider__value">{Math.round(minValue)}</span>
            <span className="m3-rangeslider__value">{Math.round(maxValue)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

M3Rangeslider.displayName = 'M3Rangeslider';

export default M3Rangeslider;
