/**
 * M3 Expressive DatePicker Component
 * Implements Material Design 3 DatePicker for CareerCopilot
 *
 * Calendar widget + input. Uses CSS variables from m3-design-tokens.css.
 *
 * NOTE: CSS styles (M3Datepicker.css) must be imported in the application root
 * or in pages that use this component.
 */

import React, { useState, useCallback, useMemo } from 'react';
import './M3Datepicker.css';
import { M3Input } from '../input/M3Input';
import { M3Modal } from '../modal/M3Modal';

export interface M3DatepickerProps {
  /**
   * Selected date (YYYY-MM-DD format or Date object)
   */
  value?: string | Date;

  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string | Date;

  /**
   * Change handler
   */
  onChange?: (date: string) => void;

  /**
   * Minimum selectable date
   */
  minDate?: string | Date;

  /**
   * Maximum selectable date
   */
  maxDate?: string | Date;

  /**
   * Label text
   */
  label?: string;

  /**
   * If true, datepicker is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, shows error state
   * @default false
   */
  error?: boolean;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * M3 Expressive DatePicker component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3DatePicker value="2024-01-15" onChange={(date) => console.log(date)} />
 * ```
 */
export const M3Datepicker: React.FC<M3DatepickerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  label = 'Date',
  disabled = false,
  error = false,
  helperText,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ? (defaultValue instanceof Date ? defaultValue.toISOString().split('T')[0] : defaultValue) : ''
  );

  const isControlled = controlledValue !== undefined;
  const value = isControlled
    ? controlledValue instanceof Date
      ? controlledValue.toISOString().split('T')[0]
      : controlledValue
    : internalValue;

  const selectedDate = value ? new Date(value) : null;
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate || new Date()
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      const dateString = date.toISOString().split('T')[0];
      if (!isControlled) {
        setInternalValue(dateString);
      }
      onChange?.(dateString);
      setOpen(false);
    },
    [isControlled, onChange]
  );

  const handleInputClick = useCallback(() => {
    if (!disabled) {
      setOpen(true);
    }
  }, [disabled]);

  const formatDate = useCallback((date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return new Date(year, month, 1).getDay();
  }, [currentMonth]);

  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(date);
    }
    return days;
  }, [currentMonth, firstDayOfMonth, daysInMonth]);

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      // Compare dates without time component
      const normalizeDate = (d: Date): Date => {
        const normalized = new Date(d);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
      };

      if (minDate) {
        const min = minDate instanceof Date ? minDate : new Date(minDate);
        const normalizedMin = normalizeDate(min);
        const normalizedDate = normalizeDate(date);
        if (normalizedDate < normalizedMin) return true;
      }
      if (maxDate) {
        const max = maxDate instanceof Date ? maxDate : new Date(maxDate);
        const normalizedMax = normalizeDate(max);
        const normalizedDate = normalizeDate(date);
        if (normalizedDate > normalizedMax) return true;
      }
      return false;
    },
    [minDate, maxDate]
  );

  const isDateSelected = useCallback(
    (date: Date): boolean => {
      if (!value) return false;
      const selected = value instanceof Date ? value : new Date(value);
      return (
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
      );
    },
    [value]
  );

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  const classNames = [
    'm3-datepicker',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={classNames}>
      <M3Input
        type="text"
        value={formatDate(selectedDate)}
        onClick={handleInputClick}
        readOnly
        label={label}
        disabled={disabled}
        error={error}
        helperText={helperText}
        placeholder="Select date"
      />
      <M3Modal open={open} onClose={() => setOpen(false)} size="small">
        <div className="m3-datepicker__calendar">
          <div className="m3-datepicker__header">
            <button
              type="button"
              className="m3-datepicker__nav-button"
              onClick={() => navigateMonth('prev')}
              aria-label="Previous month"
            >
              ←
            </button>
            <div className="m3-datepicker__month-year">
              {currentMonth.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <button
              type="button"
              className="m3-datepicker__nav-button"
              onClick={() => navigateMonth('next')}
              aria-label="Next month"
            >
              →
            </button>
          </div>
          <div className="m3-datepicker__weekdays">
            {weekDays.map((day) => (
              <div key={day} className="m3-datepicker__weekday">
                {day}
              </div>
            ))}
          </div>
          <div className="m3-datepicker__days">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="m3-datepicker__day m3-datepicker__day--empty" />;
              }
              const disabled = isDateDisabled(date);
              const selected = isDateSelected(date);
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  className={[
                    'm3-datepicker__day',
                    selected && 'm3-datepicker__day--selected',
                    disabled && 'm3-datepicker__day--disabled',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => !disabled && handleDateSelect(date)}
                  disabled={disabled}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </M3Modal>
    </div>
  );
};

M3Datepicker.displayName = 'M3Datepicker';

export default M3Datepicker;
