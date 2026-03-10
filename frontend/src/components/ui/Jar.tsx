/**
 * @deprecated Jar is deprecated as of KR Solidarity v6.0.
 * Use {@link March} from './March' instead. See docs/design/01_CANON.md §2.C
 * Will be removed in v7.0.
 */
import { Check, ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface JarOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface JarProps {
  /** Select label */
  label?: string;

  /** Helper text below select */
  helperText?: string;

  /** Error state */
  error?: boolean;

  /** Error message */
  errorMessage?: string;

  /** Available options */
  options: JarOption[];

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
 * @deprecated Use March instead.
 *
 * Jar - Kerala Rage kr-solidarity Select Dropdown (legacy name)
 *
 * Replaced by March in KR Solidarity v6.0.
 * Archetype was: Jar (simple frame container). Now: March (sequential selection).
 * Shape: shape.block01 (base) → shape.marchOpen01 (open/active morph)
 */
export function Jar({
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
}: JarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const showError = error && errorMessage;
  const displayHelperText = showError ? errorMessage : helperText;

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, optionValue: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(optionValue);
    }
  };

  const buttonStyle: React.CSSProperties = {
    borderRadius: 'var(--shape-blockRiot01)', // shape.blockRiot01 — March archetype
    backgroundColor: 'var(--sys-color-charcoalBackground-steps-3)',
    border: '2px solid',
    borderColor: error
      ? 'var(--sys-color-solidarityRed-base)'
      : isOpen
        ? 'var(--sys-color-inkGold-base)'
        : 'var(--sys-color-worker-ash-base)',
    color: 'var(--sys-color-worker-ash-base)',
    transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}
    >
      {/* Label */}
      {label && (
        <label
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

      {/* Select Button */}
      <button
        type="button"
        style={buttonStyle}
        className={`
          ${fullWidth ? 'w-full' : 'w-auto min-w-[200px]'}
          px-4 py-3
          flex items-center justify-between gap-3
          ${isOpen && !error ? 'shadow-[0_0_15px_var(--sys-color-inkGold-steps-0)]' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--sys-color-concreteGrey-steps-4)]'}
          ${className}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-3 z-50 overflow-hidden"
          style={{
            borderRadius: 'var(--shape-blockRiot02)', // shape.blockRiot02 — March dropdown
            backgroundColor: 'var(--sys-color-charcoalBackground-base)',
            border: '1px solid var(--sys-color-worker-ash-base)',
            boxShadow: 'var(--sys-shadow-elevation4Float)',
            animation: 'fadeIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          role="listbox"
        >
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === value;
              const isDisabled = option.disabled || disabled;

              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isDisabled ? -1 : 0}
                  className={`
                    px-4 py-3
                    flex items-center justify-between gap-2
                    cursor-pointer
                    ${isSelected ? 'bg-white/10 text-[var(--sys-color-inkGold-base)]' : 'text-[var(--sys-color-worker-ash-base)]'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}
                    transition-colors duration-[var(--duration-fast)]
                  `}
                  onClick={() => !isDisabled && handleSelect(option.value)}
                  onKeyDown={(e) => !isDisabled && handleKeyDown(e, option.value)}
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

      {/* Helper Text / Error Message */}
      {displayHelperText && (
        <p
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
