import React, { useState, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './input';
import { Button } from './Button';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value?: number;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  allowNegative?: boolean;
  showStepper?: boolean;
  format?: 'number' | 'currency' | 'percentage';
  currency?: string;
  locale?: string;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  precision = 0,
  allowNegative = true,
  showStepper = false,
  format = 'number',
  currency = 'USD',
  locale = 'en-US',
  className,
  disabled,
  placeholder,
  ...props
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState<string>(() => {
    if (value === undefined) return '';
    return formatDisplayValue(value, format, currency, locale, precision);
  });

  const [isFocused, setIsFocused] = useState(false);

  function formatDisplayValue(
    num: number,
    fmt: typeof format,
    cur: string,
    loc: string,
    prec: number
  ): string {
    if (fmt === 'currency') {
      return new Intl.NumberFormat(loc, {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: prec,
        maximumFractionDigits: prec,
      }).format(num);
    }

    if (fmt === 'percentage') {
      return new Intl.NumberFormat(loc, {
        style: 'percent',
        minimumFractionDigits: prec,
        maximumFractionDigits: prec,
      }).format(num / 100);
    }

    return new Intl.NumberFormat(loc, {
      minimumFractionDigits: prec,
      maximumFractionDigits: prec,
    }).format(num);
  }

  function parseInputValue(input: string): number | undefined {
    if (!input.trim()) return undefined;

    // Remove currency symbols, percentage signs, and locale-specific formatting
    const cleanValue = input
      .replace(/[$€£¥₹]/g, '') // Common currency symbols
      .replace(/%/g, '') // Percentage sign
      .replace(/,/g, '') // Thousands separators
      .trim();

    const parsed = parseFloat(cleanValue);
    if (isNaN(parsed)) return undefined;

    // Convert percentage back to decimal
    if (format === 'percentage' && input.includes('%')) {
      return parsed;
    }

    return parsed;
  }

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      const parsed = parseInputValue(newValue);

      // Validate range
      if (parsed !== undefined) {
        if (min !== undefined && parsed < min) return;
        if (max !== undefined && parsed > max) return;
        if (!allowNegative && parsed < 0) return;
      }

      onChange?.(parsed);
    },
    [onChange, min, max, allowNegative, format]
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (value !== undefined) {
      setInputValue(formatDisplayValue(value, format, currency, locale, precision));
    }
  }, [value, format, currency, locale, precision]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (value !== undefined) {
      // Show raw number when focused for easier editing
      setInputValue(value.toString());
    }
  }, [value]);

  const handleStep = useCallback(
    (direction: 'up' | 'down') => {
      const currentValue = value ?? 0;
      const stepValue = direction === 'up' ? step : -step;
      const newValue = currentValue + stepValue;

      // Validate range
      if (min !== undefined && newValue < min) return;
      if (max !== undefined && newValue > max) return;
      if (!allowNegative && newValue < 0) return;

      onChange?.(newValue);
    },
    [value, step, min, max, allowNegative, onChange]
  );

  React.useEffect(() => {
    if (!isFocused && value !== undefined) {
      setInputValue(formatDisplayValue(value, format, currency, locale, precision));
    }
  }, [value, format, currency, locale, precision, isFocused]);

  const displayValue = isFocused ? inputValue : inputValue;

  return (
    <div className={cn('relative', className)}>
      <Input
        {...props}
        type='text'
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(showStepper && 'pr-16', className)}
      />

      {showStepper && !disabled && (
        <div className='absolute right-1 top-1 bottom-1 flex flex-col'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-1/2 w-8 p-0 rounded-b-none border-b'
            onClick={() => handleStep('up')}
            disabled={max !== undefined && value !== undefined && value >= max}
          >
            <Plus className='h-3 w-3' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-1/2 w-8 p-0 rounded-t-none'
            onClick={() => handleStep('down')}
            disabled={min !== undefined && value !== undefined && value <= min}
          >
            <Minus className='h-3 w-3' />
          </Button>
        </div>
      )}
    </div>
  );
}

// Specialized components for common use cases
interface CurrencyInputProps extends Omit<NumberInputProps, 'format' | 'currency'> {
  currency?: string;
}

export function CurrencyInput({ currency = 'USD', precision = 2, ...props }: CurrencyInputProps) {
  return <NumberInput {...props} format='currency' currency={currency} precision={precision} />;
}

interface PercentageInputProps extends Omit<NumberInputProps, 'format' | 'min' | 'max'> {
  min?: number;
  max?: number;
}

export function PercentageInput({
  precision = 1,
  min = 0,
  max = 100,
  ...props
}: PercentageInputProps) {
  return <NumberInput {...props} format='percentage' precision={precision} min={min} max={max} />;
}
