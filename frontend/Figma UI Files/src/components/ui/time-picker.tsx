import React, { useState, forwardRef } from 'react';
import { Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface TimePickerProps {
  value?: string; // Format: "HH:MM" or "hh:MM AM/PM"
  onChange?: (time: string) => void;
  use24Hour?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    { value, onChange, use24Hour = false, placeholder = 'Select time', disabled, className = '' },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [hours, setHours] = useState(value ? parseInt(value.split(':')[0]) : 12);
    const [minutes, setMinutes] = useState(value ? parseInt(value.split(':')[1]) : 0);
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

    const formatTime = () => {
      if (!value) return placeholder;
      return value;
    };

    const handleHourChange = (newHour: number) => {
      setHours(newHour);
      updateTime(newHour, minutes, period);
    };

    const handleMinuteChange = (newMinute: number) => {
      setMinutes(newMinute);
      updateTime(hours, newMinute, period);
    };

    const handlePeriodToggle = () => {
      const newPeriod = period === 'AM' ? 'PM' : 'AM';
      setPeriod(newPeriod);
      updateTime(hours, minutes, newPeriod);
    };

    const updateTime = (h: number, m: number, p: 'AM' | 'PM') => {
      if (use24Hour) {
        onChange?.(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      } else {
        onChange?.(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${p}`);
      }
    };

    const hourRange = use24Hour ? 24 : 12;
    const hoursList = Array.from({ length: hourRange }, (_, i) => (use24Hour ? i : i + 1));
    const minutesList = Array.from({ length: 60 }, (_, i) => i);

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
              {formatTime()}
            </span>
            <Clock className="w-5 h-5 text-[var(--primary)]" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4 bg-[var(--surface-container)] border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-glow-aurora)]"
          align="start"
        >
          <div className="flex gap-2 items-center">
            {/* Hours */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--on-surface-variant)] text-center">Hours</span>
              <div className="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--primary)] scrollbar-track-[var(--glass-bg)]">
                {hoursList.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleHourChange(hour)}
                    className={`
                      w-16 px-3 py-2 text-center rounded-[var(--radius-md)]
                      transition-all duration-200
                      ${
                        hours === hour
                          ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] text-white'
                          : 'hover:bg-[var(--glass-bg)] text-[var(--on-surface)]'
                      }
                    `}
                  >
                    {hour.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xl text-[var(--on-surface)]">:</span>

            {/* Minutes */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--on-surface-variant)] text-center">Minutes</span>
              <div className="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--primary)] scrollbar-track-[var(--glass-bg)]">
                {minutesList.map((minute) => (
                  <button
                    key={minute}
                    onClick={() => handleMinuteChange(minute)}
                    className={`
                      w-16 px-3 py-2 text-center rounded-[var(--radius-md)]
                      transition-all duration-200
                      ${
                        minutes === minute
                          ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] text-white'
                          : 'hover:bg-[var(--glass-bg)] text-[var(--on-surface)]'
                      }
                    `}
                  >
                    {minute.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM Toggle */}
            {!use24Hour && (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-[var(--on-surface-variant)] text-center">Period</span>
                <div className="flex flex-col gap-2 mt-2">
                  {(['AM', 'PM'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPeriod(p);
                        updateTime(hours, minutes, p);
                      }}
                      className={`
                        w-16 px-3 py-2 text-center rounded-[var(--radius-md)]
                        transition-all duration-200
                        ${
                          period === p
                            ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] text-white'
                            : 'hover:bg-[var(--glass-bg)] text-[var(--on-surface)]'
                        }
                      `}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

TimePicker.displayName = 'TimePicker';
