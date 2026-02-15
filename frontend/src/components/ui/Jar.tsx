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
 * Jar - KeralaRage KrSolidarity Select Dropdown
 *
 * A custom select component using KeralaRage KrSolidarity design tokens with enhanced UX.
 * Features [DEPRECATED_STYLE] shapes, proper elevation, and smooth animations.
 *
 * **KeralaRage Design Token Usage:**
 * - Shape: `--radius-stone` for select button, `--radius-pebble` for dropdown
 * - Elevation: `--shadow-maximum` for dropdown menu
 * - Motion: Viscous-breeze easing for smooth open/close
 * - Colors: KeralaRage [DEPRECATED_STYLE] palette (Ink Gold, Solidarity Red)
 * - Typography: Field-note font family
 *
 * @example
 * ```tsx
 * <Jar
 *   label="Country"
 *   options={[
 *     { value: 'au', label: 'Australia' },
 *     { value: 'us', label: 'United States' },
 *   ]}
 *   value={country}
 *   onChange={setCountry}
 * />
 * ```
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
    borderRadius: 'var(--radius-stone)',
    backgroundColor: 'rgba(44, 39, 35, 0.4)',
    border: '2px solid',
    borderColor: error
      ? 'var(--sys-color-solidarityRed-base)'
      : isOpen
        ? 'var(--sys-color-inkGold-base)'
        : 'var(--sys-color-worker-ash-base)',
    color: 'var(--sys-color-worker-ash-steps-6)',
    transition: 'all var(--duration-standard) var(--ease-viscous-breeze)',
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
          mb-2 text-sm font-medium transition-colors duration-200
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
          ${isOpen && !error ? 'shadow-[0_0_15px_rgba(212,168,75,0.2)]' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--sys-color-worker-ash-steps-2)]'}
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
              ? 'text-[var(--sys-color-worker-ash-steps-6)]'
              : 'text-[var(--sys-color-worker-ash-steps-2)]'
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`
            w-5 h-5 text-[var(--sys-color-worker-ash-steps-2)]
            transition-transform duration-300
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
            borderRadius: 'var(--radius-pebble)',
            backgroundColor: 'var(--sys-color-charcoalBackground-base)',
            border: '1px solid var(--sys-color-worker-ash-base)',
            boxShadow: 'var(--shadow-maximum)',
            animation: 'fadeIn 0.2s ease-out',
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
                    ${isSelected ? 'bg-white/10 text-[var(--sys-color-inkGold-base)]' : 'text-[var(--sys-color-worker-ash-steps-6)]'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}
                    transition-colors duration-150
                  `}
                  onClick={() => !isDisabled && handleSelect(option.value)}
                  onKeyDown={(e) => !isDisabled && handleKeyDown(e, option.value)}
                >
                  <span className="font-field-note">{option.label}</span>
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
          ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-worker-ash-steps-2)]'}
        `}
        >
          {displayHelperText}
        </p>
      )}
    </div>
  );
}

// Legacy M3 exports for backward compatibility
export { Jar as M3Select };
export type { JarOption as M3SelectOption, JarProps as M3SelectProps };