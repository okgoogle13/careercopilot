import { Check, ChevronDown } from 'lucide-react';
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

export interface MarchOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MarchProps {
  /** Optional id for ARIA linkage */
  id?: string;
  /** Select label */
  label?: string;
  /** Helper text below select */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Available options */
  options: MarchOption[];
  /** Selected value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Placeholder when no selection */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Required field */
  required?: boolean;
  /** Full width select */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * **THE MARCH**
 *
 * Archetype: March — Sequential selection, collective choice, flow elements.
 * Shape palette: `shape.block01` (base) → `shape.pebble01` (active/open)
 * Motion coupling: `dragSettle` (800ms, viscous-breeze)
 *
 * KR Shape Token: `--sys-shape-block01` (`8px 2px 8px 2px`) closed
 * → `--sys-shape-pebble01` (`20px 8px 12px 32px`) when open (shape morph on interaction)
 *
 * A march moves through orderly progression. Each option is a comrade in sequence.
 *
 * @example
 * <March
 *   label="Source Type"
 *   options={[{ value: 'resume', label: 'Resume' }]}
 *   value={source}
 *   onChange={setSource}
 * />
 */
export function March({
  id,
  label,
  helperText,
  error = false,
  errorMessage,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  fullWidth = false,
  className = '',
}: MarchProps) {
  const reactId = useId();
  const selectId = id ?? `march-${reactId}`;
  const labelId = `${selectId}-label`;
  const listboxId = `${selectId}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
      if (event.key === 'Escape') setActiveIndex(-1);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const showError = error && errorMessage;
  const displayHelperText = showError ? errorMessage : helperText;
  const helperId = displayHelperText ? `${selectId}-helper-text` : undefined;
  const enabledIndices = useMemo(
    () => options.map((opt, index) => ({ opt, index })).filter(({ opt }) => !opt.disabled),
    [options]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) {
      setActiveIndex(selectedIndex);
      return;
    }
    setActiveIndex(enabledIndices[0]?.index ?? -1);
  }, [enabledIndices, isOpen, options, selectedIndex]);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const getNextEnabledIndex = (start: number, direction: 1 | -1): number => {
    if (enabledIndices.length === 0) {
      return -1;
    }
    let cursor = start;
    for (let i = 0; i < options.length; i += 1) {
      cursor = (cursor + direction + options.length) % options.length;
      if (!options[cursor]?.disabled) {
        return cursor;
      }
    }
    return -1;
  };

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : (enabledIndices[0]?.index ?? -1));
      } else {
        setActiveIndex((prev) => getNextEnabledIndex(prev < 0 ? selectedIndex : prev, 1));
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(
          selectedIndex >= 0
            ? selectedIndex
            : (enabledIndices[enabledIndices.length - 1]?.index ?? -1)
        );
      } else {
        setActiveIndex((prev) => getNextEnabledIndex(prev < 0 ? selectedIndex : prev, -1));
      }
    } else if ((event.key === 'Enter' || event.key === ' ') && isOpen && activeIndex >= 0) {
      event.preventDefault();
      const activeOption = options[activeIndex];
      if (activeOption && !activeOption.disabled) {
        handleSelect(activeOption.value);
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent,
    optionValue: string,
    optionIndex: number
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(optionValue);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(getNextEnabledIndex(optionIndex, 1));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(getNextEnabledIndex(optionIndex, -1));
    }
  };

  // Shape morphs: block01 (closed) → pebble01 (open) — March archetype interaction morph
  const buttonStyle: React.CSSProperties = {
    borderRadius: isOpen ? 'var(--sys-shape-pebbleSurge01)' : 'var(--sys-shape-blockRiot01)',
    backgroundColor: 'var(--sys-color-charcoalBackground-steps-3)',
    border: '2px solid',
    borderColor: error
      ? 'var(--sys-color-solidarityRed-base)'
      : isOpen
        ? 'var(--sys-color-inkGold-base)'
        : 'var(--sys-color-worker-ash-base)',
    color: 'var(--sys-color-worker-ash-base)',
    transition: 'all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}
    >
      {label && (
        <label
          id={labelId}
          className={`
          mb-2 text-sm font-medium transition-colors duration-[var(--duration-standard)]
          ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-worker-ash-base)]'}
          ${isOpen && !error ? 'text-[var(--sys-color-inkGold-base)]' : ''}
        `}
        >
          {label}
          {required && <span className="text-[var(--sys-color-solidarityRed-base)] ml-1">*</span>}
        </label>
      )}

      <button
        type="button"
        id={selectId}
        style={buttonStyle}
        data-archetype="march"
        className={`
          ${fullWidth ? 'w-full' : 'w-auto min-w-[200px]'}
          px-4 py-3
          flex items-center justify-between gap-3
          ${isOpen && !error ? 'shadow-[0_0_15px_var(--sys-color-inkGold-steps-0)]' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--sys-color-concreteGrey-steps-4)]'}
          ${className}
        `}
        onClick={() => {
          if (disabled) {
            return;
          }
          setIsOpen((prev) => {
            const next = !prev;
            setActiveIndex(
              next ? (selectedIndex >= 0 ? selectedIndex : (enabledIndices[0]?.index ?? -1)) : -1
            );
            return next;
          });
        }}
        onKeyDown={handleButtonKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={label ? `${labelId} ${selectId}` : undefined}
        aria-describedby={helperId}
      >
        <span
          className={
            selectedOption
              ? 'text-[var(--sys-color-worker-ash-base)]'
              : 'text-[var(--sys-color-worker-ash-steps-2)]'
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`
            w-5 h-5 text-[var(--sys-color-concreteGrey-steps-4)]
            transition-transform duration-[var(--duration-standard)]
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-3 z-50 overflow-hidden"
          style={{
            borderRadius: 'var(--sys-shape-blockRiot02)', // shape.block02 for dropdown
            backgroundColor: 'var(--sys-color-charcoalBackground-base)',
            border: '1px solid var(--sys-color-worker-ash-base)',
            boxShadow: 'var(--sys-shadow-elevation4Float)',
            animation: 'fadeIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          aria-activedescendant={activeIndex >= 0 ? `${selectId}-option-${activeIndex}` : undefined}
        >
          <div className="max-h-64 overflow-y-auto">
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isDisabled = option.disabled || disabled;
              const isActive = activeIndex === index;
              return (
                <div
                  key={option.value}
                  id={`${selectId}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isDisabled ? -1 : 0}
                  className={`
                    px-4 py-3 flex items-center justify-between gap-2 cursor-pointer
                    ${isSelected ? 'bg-white/10 text-[var(--sys-color-inkGold-base)]' : 'text-[var(--sys-color-worker-ash-base)]'}
                    ${isActive ? 'outline-none ring-1 ring-[var(--sys-color-inkGold-base)]' : ''}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}
                    transition-colors duration-[var(--duration-fast)]
                  `}
                  onClick={() => !isDisabled && handleSelect(option.value)}
                  onMouseEnter={() => !isDisabled && setActiveIndex(index)}
                  onKeyDown={(e) => !isDisabled && handleOptionKeyDown(e, option.value, index)}
                >
                  <span className="font-primary">{option.label}</span>
                  {isSelected && (
                    <Check className="w-5 h-5 flex-shrink-0 text-[var(--sys-color-inkGold-base)]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {displayHelperText && (
        <p
          id={helperId}
          className={`
          mt-1 px-1 text-xs
          ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-worker-ash-base)]'}
        `}
        >
          {displayHelperText}
        </p>
      )}
    </div>
  );
}
