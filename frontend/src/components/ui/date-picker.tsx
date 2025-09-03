import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromDate?: Date;
  toDate?: Date;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date',
  disabled = false,
  className,
  fromDate,
  toDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect: SelectSingleEventHandler = (selectedDate) => {
    onDateChange?.(selectedDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={disabled}
          fromDate={fromDate}
          toDate={toDate}
          className="p-3"
          classNames={{
            months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-sm font-medium',
            nav: 'space-x-1 flex items-center',
            nav_button: cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0 opacity-50 hover:opacity-100'
            ),
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
            row: 'flex w-full mt-2',
            cell: cn(
              'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-middle)]:rounded-none',
              '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            ),
            day: cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 font-normal aria-selected:opacity-100'
            ),
            day_range_start: 'day-range-start',
            day_range_end: 'day-range-end',
            day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
            day_today: 'bg-accent text-accent-foreground',
            day_outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible',
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

// Date Range Picker Component
interface DateRange {
  from: Date | undefined;
  to?: Date;
}

interface DateRangePickerProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromDate?: Date;
  toDate?: Date;
}

// Enhanced Date Range Picker with Presets
interface DateRangePreset {
  label: string;
  range: DateRange;
  shortcut?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = 'Pick a date range',
  disabled = false,
  className,
  fromDate,
  toDate,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const getDateRangePresets = (): DateRangePreset[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return [
      {
        label: 'Today',
        shortcut: 'T',
        range: { from: today, to: today }
      },
      {
        label: 'Yesterday',
        shortcut: 'Y',
        range: {
          from: new Date(today.getTime() - 24 * 60 * 60 * 1000),
          to: new Date(today.getTime() - 24 * 60 * 60 * 1000)
        }
      },
      {
        label: 'This Week',
        shortcut: 'W',
        range: {
          from: new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000)),
          to: today
        }
      },
      {
        label: 'Last Week',
        range: {
          from: new Date(today.getTime() - ((today.getDay() + 7) * 24 * 60 * 60 * 1000)),
          to: new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000) - 1)
        }
      },
      {
        label: 'This Month',
        shortcut: 'M',
        range: {
          from: new Date(today.getFullYear(), today.getMonth(), 1),
          to: today
        }
      },
      {
        label: 'Last Month',
        range: {
          from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          to: new Date(today.getFullYear(), today.getMonth(), 0)
        }
      },
      {
        label: 'This Quarter',
        shortcut: 'Q',
        range: {
          from: new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1),
          to: today
        }
      },
      {
        label: 'Last 30 Days',
        shortcut: '3',
        range: {
          from: new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)),
          to: today
        }
      },
      {
        label: 'Last 90 Days',
        shortcut: '9',
        range: {
          from: new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000)),
          to: today
        }
      }
    ];
  };

  const presets = getDateRangePresets();

  const handlePresetSelect = (preset: DateRangePreset) => {
    onDateRangeChange?.(preset.range);
    setOpen(false);
  };

  const handleSelect = (range: any) => {
    onDateRangeChange?.(range);
    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  const formatDateRange = (range?: DateRange) => {
    if (!range?.from) return placeholder;
    if (!range.to) return format(range.from, 'PPP');

    // Check if it matches a preset
    const matchedPreset = presets.find(preset =>
      preset.range.from?.getTime() === range.from?.getTime() &&
      preset.range.to?.getTime() === range.to?.getTime()
    );

    if (matchedPreset) {
      return matchedPreset.label;
    }

    return `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}`;
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open || e.ctrlKey || e.metaKey || e.altKey) return;

      const preset = presets.find(p => p.shortcut?.toLowerCase() === e.key.toLowerCase());
      if (preset) {
        e.preventDefault();
        handlePresetSelect(preset);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, presets]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !dateRange?.from && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{formatDateRange(dateRange)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Presets Sidebar */}
          <div className="border-r border-gray-200 p-3 w-40">
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Quick Select
            </div>
            <div className="space-y-1">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-sm rounded transition-colors',
                    'hover:bg-gray-100 focus:bg-gray-100',
                    // Check if current range matches this preset
                    dateRange?.from?.getTime() === preset.range.from?.getTime() &&
                    dateRange?.to?.getTime() === preset.range.to?.getTime()
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{preset.label}</span>
                    {preset.shortcut && (
                      <span className="text-xs opacity-50 font-mono">
                        {preset.shortcut}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Tip: Use keyboard shortcuts
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div>
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={handleSelect}
              disabled={disabled}
              fromDate={fromDate}
              toDate={toDate}
              className="p-3"
              numberOfMonths={2}
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button: cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0 opacity-50 hover:opacity-100'
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: cn(
                  'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-middle)]:rounded-none',
                  '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                ),
                day: cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 font-normal aria-selected:opacity-100'
                ),
                day_range_start: 'day-range-start',
                day_range_end: 'day-range-end',
                day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground',
                day_outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}