/**
 * M3 Expressive DatePicker Component
 * Implements Material Design 3 calendar-based date picker
 *
 * Uses CSS variables from m3-design-tokens.css:
 * - Color: --md-sys-color-*
 * - Shape: --md-sys-shape-corner-*
 * - Motion: --md-sys-motion-*
 * - Typography: --md-sys-typescale-*
 * - Elevation: --md-sys-elevation-*
 * - Spacing: --md-sys-spacing-*
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './M3DatePicker.css';

export interface M3DatePickerProps {
  /**
   * Selected date
   */
  value?: Date | null;

  /**
   * Default date (uncontrolled)
   */
  defaultValue?: Date | null;

  /**
   * Change handler
   */
  onChange?: (date: Date | null) => void;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * If true, picker is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, shows error state
   * @default false
   */
  error?: boolean;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Date format for display
   * @default 'MM/DD/YYYY'
   */
  dateFormat?: string;

  /**
   * Custom className
   */
  className?: string;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * M3 Expressive DatePicker component using design tokens.
 *
 * Example usage:
 * ```tsx
 * <M3DatePicker
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   label="Select Date"
 *   minDate={new Date()}
 * />
 * ```
 */
export const M3DatePicker: React.FC<M3DatePickerProps> = ({
  value: controlledValue,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date...',
  disabled = false,
  error = false,
  label,
  helperText,
  dateFormat = 'MM/DD/YYYY',
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(defaultValue || new Date());
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  const pickerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const formatDate = useCallback((date: Date | null): string => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }, []);

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(new Date(year, month, -i));
    }

    // Add all days in month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add empty cells to complete the grid
    while (days.length % 7 !== 0) {
      days.push(new Date(year, month + 1, days.length - lastDay.getDate() - firstDay.getDay() + 1));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;

    const newValue = new Date(date);
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    setOpen(false);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (!open && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        setOpen(true);
        return;
      }

      if (!open) return;

      const currentFocused = focusedDate || currentValue || new Date();

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedDate) {
            handleDateSelect(focusedDate);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedDate(new Date(currentFocused.getFullYear(), currentFocused.getMonth(), currentFocused.getDate() - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusedDate(new Date(currentFocused.getFullYear(), currentFocused.getMonth(), currentFocused.getDate() + 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedDate(new Date(currentFocused.getFullYear(), currentFocused.getMonth(), currentFocused.getDate() - 7));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedDate(new Date(currentFocused.getFullYear(), currentFocused.getMonth(), currentFocused.getDate() + 7));
          break;
      }
    },
    [disabled, open, focusedDate, currentValue, handleDateSelect]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const days = getDaysInMonth(viewDate);

  const classNames = [
    'm3-date-picker',
    open && 'm3-date-picker--open',
    disabled && 'm3-date-picker--disabled',
    error && 'm3-date-picker--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} data-testid="m3-date-picker">
      {label && <label className="m3-date-picker__label">{label}</label>}

      <div
        ref={pickerRef}
        className="m3-date-picker__input"
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-disabled={disabled}
      >
        <span className="m3-date-picker__value">
          {currentValue ? formatDate(currentValue) : placeholder}
        </span>
        <svg className="m3-date-picker__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
        </svg>
      </div>

      {open && (
        <div ref={calendarRef} className="m3-date-picker__calendar" role="dialog" aria-label="Choose date">
          <div className="m3-date-picker__header">
            <button
              type="button"
              className="m3-date-picker__nav-button"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            <div className="m3-date-picker__month-year">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>

            <button
              type="button"
              className="m3-date-picker__nav-button"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>

          <div className="m3-date-picker__grid" role="grid">
            <div className="m3-date-picker__weekdays" role="row">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="m3-date-picker__weekday" role="columnheader">
                  {day}
                </div>
              ))}
            </div>

            <div className="m3-date-picker__days">
              {days.map((date, index) => {
                const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                const isSelected = currentValue && isSameDay(date, currentValue);
                const isToday = isSameDay(date, new Date());
                const isFocused = focusedDate && isSameDay(date, focusedDate);
                const isDisabled = isDateDisabled(date);

                return (
                  <button
                    key={index}
                    type="button"
                    className={[
                      'm3-date-picker__day',
                      !isCurrentMonth && 'm3-date-picker__day--outside',
                      isSelected && 'm3-date-picker__day--selected',
                      isToday && 'm3-date-picker__day--today',
                      isFocused && 'm3-date-picker__day--focused',
                      isDisabled && 'm3-date-picker__day--disabled',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleDateSelect(date)}
                    disabled={isDisabled || !isCurrentMonth}
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-label={formatDate(date)}
                    tabIndex={isFocused ? 0 : -1}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {helperText && (
        <span className="m3-date-picker__helper-text">{helperText}</span>
      )}
    </div>
  );
};

M3DatePicker.displayName = 'M3DatePicker';

export default M3DatePicker;
