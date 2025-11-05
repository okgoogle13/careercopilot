import React, { useState, forwardRef } from 'react';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { CalendarIcon } from 'lucide-react';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ value, onChange, placeholder = 'Select date', disabled, className = '' }, ref) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            disabled={disabled}
            className={`
              w-full px-4 py-3 flex items-center justify-between gap-3
              bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
              border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)]
              text-[var(--on-surface)] text-left
              transition-all duration-300
              hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-glow-aurora)]
              focus:outline-none focus:border-transparent focus:shadow-[var(--shadow-glow-aurora)]
              ${disabled && 'opacity-50 cursor-not-allowed'}
              ${className}
            `}
            style={
              open
                ? {
                    boxShadow:
                      '0 0 24px rgba(167, 139, 250, 0.3), 0 0 48px rgba(244, 114, 182, 0.2)',
                    borderImage: 'linear-gradient(135deg, var(--primary), var(--tertiary)) 1',
                  }
                : {}
            }
          >
            <span
              className={value ? 'text-[var(--on-surface)]' : 'text-[var(--on-surface-variant)]'}
            >
              {value ? value.toLocaleDateString() : placeholder}
            </span>
            <CalendarIcon className="w-5 h-5 text-[var(--primary)]" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-[var(--surface-container)] border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-glow-aurora)]"
          align="start"
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export interface DateRangePickerProps {
  value?: { from?: Date; to?: Date };
  onChange?: (range: { from?: Date; to?: Date } | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  ({ value, onChange, placeholder = 'Select date range', disabled, className = '' }, ref) => {
    const [open, setOpen] = useState(false);

    const formatDateRange = () => {
      if (!value?.from) return placeholder;
      if (!value?.to) return value.from.toLocaleDateString();
      return `${value.from.toLocaleDateString()} - ${value.to.toLocaleDateString()}`;
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            disabled={disabled}
            className={`
              w-full px-4 py-3 flex items-center justify-between gap-3
              bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
              border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)]
              text-[var(--on-surface)] text-left
              transition-all duration-300
              hover:border-[var(--glass-border-hover)] hover:shadow-[var(--shadow-glow-aurora)]
              focus:outline-none focus:border-transparent focus:shadow-[var(--shadow-glow-aurora)]
              ${disabled && 'opacity-50 cursor-not-allowed'}
              ${className}
            `}
            style={
              open
                ? {
                    boxShadow:
                      '0 0 24px rgba(167, 139, 250, 0.3), 0 0 48px rgba(244, 114, 182, 0.2)',
                    borderImage: 'linear-gradient(135deg, var(--primary), var(--tertiary)) 1',
                  }
                : {}
            }
          >
            <span
              className={
                value?.from ? 'text-[var(--on-surface)]' : 'text-[var(--on-surface-variant)]'
              }
            >
              {formatDateRange()}
            </span>
            <CalendarIcon className="w-5 h-5 text-[var(--primary)]" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-[var(--surface-container)] border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-glow-aurora)]"
          align="start"
        >
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
