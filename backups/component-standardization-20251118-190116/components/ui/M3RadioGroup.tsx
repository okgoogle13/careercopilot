/**
 * M3 Expressive RadioGroup Component
 * Implements Material Design 3 radio button group with context
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 */
import React, { createContext, useContext, useCallback } from 'react';
import './M3RadioGroup.css';

// Context for sharing selected value
interface RadioGroupContextValue {
  value?: string | number;
  onChange: (value: string | number) => void;
  name: string;
  disabled?: boolean;
  color: 'primary' | 'secondary' | 'tertiary' | 'error';
  size: 'small' | 'medium' | 'large';
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

export interface M3RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * The color role from M3 palette
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * The size of the component
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Currently selected value
   */
  value?: string | number;

  /**
   * Callback when selection changes
   */
  onChange?: (value: string | number) => void;

  /**
   * Name attribute for radio inputs
   */
  name: string;

  /**
   * If true, all radios are disabled
   */
  disabled?: boolean;

  /**
   * Children (M3Radio components)
   */
  children?: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

export interface M3RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Value identifier for this radio
   */
  value: string | number;

  /**
   * Label text
   */
  label?: string;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive RadioGroup component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3RadioGroup value={selected} onChange={setSelected} name="option">
 *   <M3Radio value="option1" label="Option 1" />
 *   <M3Radio value="option2" label="Option 2" />
 *   <M3Radio value="option3" label="Option 3" />
 * </M3RadioGroup>
 * ```
 */
export const M3RadioGroup = React.forwardRef<HTMLDivElement, M3RadioGroupProps>(
  (
    {
      color = 'primary',
      size = 'medium',
      value,
      onChange,
      name,
      disabled = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const handleChange = useCallback(
      (newValue: string | number) => {
        onChange?.(newValue);
      },
      [onChange]
    );

    const classNames = [
      'm3-radio-group',
      `m3-radio-group--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <RadioGroupContext.Provider
        value={{ value, onChange: handleChange, name, disabled, color, size }}
      >
        <div
          ref={ref}
          role="radiogroup"
          className={classNames}
          data-testid="m3-radio-group"
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

M3RadioGroup.displayName = 'M3RadioGroup';

/**
 * Individual radio button component
 */
export const M3Radio = React.forwardRef<HTMLInputElement, M3RadioProps>(
  (
    {
      value,
      label,
      disabled: radioDisabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const context = useContext(RadioGroupContext);
    if (!context) {
      throw new Error('M3Radio must be used within M3RadioGroup');
    }

    const { value: groupValue, onChange, name, disabled: groupDisabled, color, size } = context;
    const isChecked = groupValue === value;
    const isDisabled = groupDisabled || radioDisabled;

    const handleChange = useCallback(() => {
      if (!isDisabled) {
        onChange(value);
      }
    }, [isDisabled, onChange, value]);

    const wrapperClassNames = [
      'm3-radio-wrapper',
      `m3-radio-wrapper--${color}`,
      `m3-radio-wrapper--${size}`,
      isChecked && 'm3-radio-wrapper--checked',
      isDisabled && 'm3-radio-wrapper--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={wrapperClassNames} data-testid="m3-radio-wrapper">
        <input
          ref={ref}
          type="radio"
          name={name}
          value={String(value)}
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleChange}
          className="m3-radio__input"
          data-testid="m3-radio"
          {...props}
        />

        {/* Custom radio visual */}
        <span className="m3-radio__circle">
          {/* Inner dot when selected */}
          <span className="m3-radio__dot" />
        </span>

        {/* Label */}
        {label && <span className="m3-radio__label">{label}</span>}
      </label>
    );
  }
);

M3Radio.displayName = 'M3Radio';

export default M3RadioGroup;
