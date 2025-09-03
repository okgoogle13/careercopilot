import React, { useState, useRef } from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Input } from './input';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  className?: string;
  popoverClassName?: string;
  optionClassName?: string;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search options...',
  emptyText = 'No options found.',
  disabled = false,
  clearable = false,
  searchable = true,
  className,
  popoverClassName,
  optionClassName,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchQuery) return options;

    const query = searchQuery.toLowerCase();
    return options.filter(option =>
      option.label.toLowerCase().includes(query) ||
      option.description?.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query)
    );
  }, [options, searchQuery, searchable]);

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === value) {
      if (clearable) {
        onValueChange?.('');
      }
    } else {
      onValueChange?.(selectedValue);
    }
    setOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      // Focus management would go here for keyboard navigation
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length > 0 && !filteredOptions[0].disabled) {
        handleSelect(filteredOptions[0].value);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            !selectedOption && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-2">
            {clearable && value && !disabled && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn('w-[--radix-popover-trigger-width] p-0', popoverClassName)}
        align="start"
      >
        <div className="max-h-80 overflow-hidden">
          {searchable && (
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          )}

          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground',
                    'disabled:pointer-events-none disabled:opacity-50',
                    option.disabled && 'pointer-events-none opacity-50',
                    value === option.value && 'bg-accent text-accent-foreground',
                    optionClassName
                  )}
                  disabled={option.disabled}
                >
                  <div className="flex-1 text-left">
                    <div className="font-medium">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    )}
                  </div>

                  {value === option.value && (
                    <Check className="ml-2 h-4 w-4 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Enhanced Combobox with grouping support
export interface ComboboxGroup {
  label: string;
  options: ComboboxOption[];
}

interface GroupedComboboxProps extends Omit<ComboboxProps, 'options'> {
  groups: ComboboxGroup[];
}

export function GroupedCombobox({
  groups,
  value,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search options...',
  emptyText = 'No options found.',
  disabled = false,
  clearable = false,
  searchable = true,
  className,
  popoverClassName,
  optionClassName,
}: GroupedComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);

  const allOptions = React.useMemo(() =>
    groups.flatMap(group => group.options),
    [groups]
  );

  const selectedOption = allOptions.find(option => option.value === value);

  const filteredGroups = React.useMemo(() => {
    if (!searchable || !searchQuery) return groups;

    const query = searchQuery.toLowerCase();
    return groups
      .map(group => ({
        ...group,
        options: group.options.filter(option =>
          option.label.toLowerCase().includes(query) ||
          option.description?.toLowerCase().includes(query) ||
          option.value.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.options.length > 0);
  }, [groups, searchQuery, searchable]);

  const handleSelect = (selectedValue: string) => {
    if (selectedValue === value) {
      if (clearable) {
        onValueChange?.('');
      }
    } else {
      onValueChange?.(selectedValue);
    }
    setOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery('');
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            !selectedOption && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="flex items-center gap-2">
            {clearable && value && !disabled && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100 transition-opacity"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn('w-[--radix-popover-trigger-width] p-0', popoverClassName)}
        align="start"
      >
        <div className="max-h-80 overflow-hidden">
          {searchable && (
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          )}

          <div className="max-h-60 overflow-auto p-1">
            {filteredGroups.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              filteredGroups.map((group, groupIndex) => (
                <div key={group.label}>
                  {groupIndex > 0 && <div className="h-px bg-border my-1" />}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {group.label}
                  </div>
                  {group.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      className={cn(
                        'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                        'hover:bg-accent hover:text-accent-foreground',
                        'focus:bg-accent focus:text-accent-foreground',
                        'disabled:pointer-events-none disabled:opacity-50',
                        option.disabled && 'pointer-events-none opacity-50',
                        value === option.value && 'bg-accent text-accent-foreground',
                        optionClassName
                      )}
                      disabled={option.disabled}
                    >
                      <div className="flex-1 text-left pl-4">
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        )}
                      </div>

                      {value === option.value && (
                        <Check className="ml-2 h-4 w-4 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}