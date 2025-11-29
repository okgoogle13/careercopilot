import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styles from './slider.module.css';

export interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({
    label,
    min = 0,
    max = 100,
    step = 1,
    showValue = false,
    className,
    disabled,
    ...props
  }, ref) => {
    const [value, setValue] = React.useState(props.defaultValue || min);

    React.useEffect(() => {
      if (props.defaultValue) {
        setValue(props.defaultValue);
      }
    }, [props.defaultValue]);

    const disabledClass = disabled ? 'slider--disabled' : '';

    const sliderClassNames = [
      styles.slider,
      styles[disabledClass],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles['slider-wrapper']}>
        {label && (
          <div className={styles['slider-header']}>
            <label className={styles.label}>{label}</label>
            {showValue && <span className={styles.value}>{value}</span>}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          className={sliderClassNames}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value);
            if (props.onChange) {
              props.onChange(e);
            }
          }}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';
