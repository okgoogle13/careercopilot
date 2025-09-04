import React, { useState, useRef } from 'react';
import { Check, ChevronDown, X, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from './badge';
import { Button } from './Button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { ScrollArea } from './scroll-area';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxDisplay?: number;
  searchable?: boolean;
  creatable?: boolean;
  onCreateOption?: (label: string) => void;
  emptyMessage?: string;
  maxHeight?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select items...',
  disabled = false,
  className,
  maxDisplay = 3,
  searchable = true,
  creatable = false,
  onCreateOption,
  emptyMessage = 'No options found.',
  maxHeight = '200px',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [options, searchQuery]);

  // Check if a create option should be shown
  const shouldShowCreateOption = React.useMemo(() => {
    if (!creatable || !searchQuery.trim()) return false;
    const exists = options.some(option => option.label.toLowerCase() === searchQuery.toLowerCase());
    return !exists;
  }, [creatable, searchQuery, options]);

  const selectedOptions = React.useMemo(() => {
    return options.filter(option => value.includes(option.value));
  }, [options, value]);

  const handleSelect = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter(v => v !== selectedValue)
      : [...value, selectedValue];
    onChange?.(newValue);
  };

  const handleRemove = (valueToRemove: string) => {
    const newValue = value.filter(v => v !== valueToRemove);
    onChange?.(newValue);
  };

  const handleCreate = () => {
    if (onCreateOption && searchQuery.trim()) {
      onCreateOption(searchQuery.trim());
      setSearchQuery('');
      setInputValue('');
    }
  };

  const handleClearAll = () => {
    onChange?.([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemove(value[value.length - 1]);
    }
  };

  // Display logic for selected items
  const getDisplayText = () => { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (selectedOptions.length === 0) {
      return placeholder;
    }

    if (selectedOptions.length <= maxDisplay) {
      return selectedOptions.map(option => option.label).join(', ');
    }

    const displayedOptions = selectedOptions.slice(0, maxDisplay);
    const remainingCount = selectedOptions.length - maxDisplay;
    return `${displayedOptions.map(option => option.label).join(', ')} +${remainingCount} more`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-full justify-between text-left font-normal min-h-10 h-auto p-2',
            selectedOptions.length === 0 && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <div className='flex flex-wrap gap-1 flex-1 mr-2'>
            {selectedOptions.length > 0 ? (
              selectedOptions.length <= maxDisplay ? (
                selectedOptions.map(option => (
                  <Badge key={option.value} variant='secondary' className='text-xs h-6 px-2 gap-1'>
                    {option.label}
                    <button
                      type='button'
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(option.value);
                      }}
                      className='ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5'
                    >
                      <X className='h-2.5 w-2.5' />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className='text-sm'>
                  {selectedOptions
                    .slice(0, maxDisplay)
                    .map(option => option.label)
                    .join(', ')}
                  <Badge variant='secondary' className='ml-1 text-xs'>
                    +{selectedOptions.length - maxDisplay}
                  </Badge>
                </span>
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <div className='flex items-center gap-1'>
            {selectedOptions.length > 0 && (
              <button
                type='button'
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClearAll();
                }}
                className='hover:bg-secondary-foreground/20 rounded-full p-1'
              >
                <X className='h-3 w-3' />
              </button>
            )}
            <ChevronDown className='h-4 w-4 opacity-50' />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0' align='start'>
        <div className='flex flex-col'>
          {searchable && (
            <div className='flex items-center border-b px-3 py-2'>
              <Input
                ref={inputRef}
                placeholder='Search options...'
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-6'
              />
            </div>
          )}

          <ScrollArea style={{ maxHeight }}>
            <div className='p-1'>
              {filteredOptions.length === 0 && !shouldShowCreateOption ? (
                <div className='py-6 text-center text-sm text-muted-foreground'>{emptyMessage}</div>
              ) : (
                <>
                  {shouldShowCreateOption && (
                    <button
                      type='button'
                      onClick={handleCreate}
                      className='flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground gap-2'
                    >
                      <Plus className='h-4 w-4' />
                      Create "{searchQuery}"
                    </button>
                  )}

                  {filteredOptions.map(option => {
                    const isSelected = value.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type='button'
                        onClick={() => handleSelect(option.value)}
                        disabled={option.disabled}
                        className={cn(
                          'flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground gap-2',
                          isSelected && 'bg-accent text-accent-foreground',
                          option.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <Check className='h-3 w-3' />
                        </div>
                        <span className='flex-1 text-left'>{option.label}</span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </ScrollArea>

          {selectedOptions.length > 0 && (
            <div className='flex items-center justify-between border-t px-3 py-2 text-sm'>
              <span className='text-muted-foreground'>{selectedOptions.length} selected</span>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={handleClearAll}
                className='h-6 px-2'
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Specialized skills multi-select for Career Copilot
interface SkillsMultiSelectProps
  extends Omit<MultiSelectProps, 'options' | 'creatable' | 'onCreateOption'> {
  availableSkills: string[];
  onAddSkill?: (skill: string) => void;
  categories?: { [category: string]: string[] };
}

export function SkillsMultiSelect({
  availableSkills,
  onAddSkill,
  categories, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...props
}: SkillsMultiSelectProps) {
  const options: MultiSelectOption[] = availableSkills.map(skill => ({
    value: skill,
    label: skill,
  }));

  return (
    <MultiSelect
      options={options}
      creatable={!!onAddSkill}
      onCreateOption={onAddSkill}
      placeholder='Select skills...'
      emptyMessage='No skills found. Type to create a new skill.'
      {...props}
    />
  );
}
