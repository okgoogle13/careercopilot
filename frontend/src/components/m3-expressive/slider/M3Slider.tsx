/**
 * M3 Expressive Slider Component
 * Implements Material Design 3 Slider for CareerCopilot
 *
 * Touch-enabled range input. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Slider.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useCallback } from 'react';
import './M3Slider.css';

export interface M3SliderProps {
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
   * Step value
   * @default 1
   */
  step?: number;

  /**
   * Change handler
   */
  onChange?: (value: number) => void;

  /**
   * If true, slider is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, shows value label
   * @default false
   */
  showValue?: boolean;

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
 * M3 Expressive Slider component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3Slider value={50} onChange={(val) => console.log(val)} />
 * ```
 */
export const M3Slider: React.FC<M3SliderProps> = ({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  showValue = false,
  label,
  color = 'primary',
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  const percentage = ((value - min) / (max - min)) * 100;

  const classNames = [
    'm3-slider',
    `m3-slider--${color}`,
    disabled && 'm3-slider--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      {label && <label className="m3-slider__label">{label}</label>}
      <div className="m3-slider__container">
        <div className="m3-slider__track">
          <div
            className="m3-slider__fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="m3-slider__input"
          aria-label={label || 'Slider'}
        />
        {showValue && (
          <div className="m3-slider__value">{Math.round(value)}</div>
        )}
      </div>
    </div>
  );
};

M3Slider.displayName = 'M3Slider';

export default M3Slider;
