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
<<<<<<< HEAD
 * Jar - Northcote Curio Select Dropdown
 *
 * A custom select component using Northcote Curio design tokens with enhanced UX.
 * Features organic shapes, proper elevation, and smooth animations.
 *
 * **Northcote Design Token Usage:**
 * - Shape: `--radius-stone` for select button, `--radius-pebble` for dropdown
 * - Elevation: `--shadow-maximum` for dropdown menu
 * - Motion: Viscous-breeze easing for smooth open/close
 * - Colors: Northcote botanical palette (Wattle Gold, Waratah Crimson)
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
    borderRadius: 'var(--radius-stone)',
    backgroundColor: 'rgba(44, 39, 35, 0.4)',
    border: '2px solid',
    borderColor: error
      ? 'var(--color-waratah-crimson)'
      : isOpen
        ? 'var(--color-wattle-gold)'
        : 'var(--color-eucalypt-smoke-base)',
    color: 'var(--color-parchment)',
    transition: 'all var(--duration-standard) var(--ease-viscous-breeze)',
=======
    borderRadius: '32px 8px 28px 12px', // Jar archetype asymmetric radius
    backgroundColor: 'var(--sys-color-charcoalBackground-steps-3)',
    border: '2px solid',
    borderColor: error
      ? 'var(--sys-color-solidarityRed-base)'
      : isOpen
        ? 'var(--sys-color-inkGold-base)'
        : 'var(--sys-color-worker-ash-base)',
    color: 'var(--sys-color-worker-ash-base)',
    transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
          mb-2 text-sm font-medium transition-colors duration-200
          ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower)]'}
          ${isOpen && !error ? 'text-[var(--color-wattle-gold)]' : ''}
        `}
        >
          {label}
          {required && <span className="text-[var(--color-waratah-crimson)] ml-1">*</span>}
=======
          mb-2 text-sm font-medium transition-colors duration-[var(--duration-standard)]
          ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-worker-ash-base)]'}
          ${isOpen && !error ? 'text-[var(--sys-color-inkGold-base)]' : ''}
        `}
        >
          {label}
          {required && <span className="text-[var(--color-solidarity-red)] ml-1">*</span>}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
          ${isOpen && !error ? 'shadow-[0_0_15px_rgba(212,168,75,0.2)]' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-flannel-flower-dark)]'}
=======
          ${isOpen && !error ? 'shadow-[0_0_15px_var(--sys-color-inkGold-steps-0)]' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-concrete-grey-dark)]'}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
              ? 'text-[var(--color-parchment)]'
              : 'text-[var(--color-flannel-flower-dark)]'
=======
              ? 'text-[var(--sys-color-worker-ash-base)]'
              : 'text-[var(--sys-color-worker-ash-steps-2)]'
>>>>>>> restoration-KR-Rage-Figma-v2.0
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`
<<<<<<< HEAD
            w-5 h-5 text-[var(--color-flannel-flower-dark)]
            transition-transform duration-300
=======
            w-5 h-5 text-[var(--color-concrete-grey-dark)]
            transition-transform duration-[var(--duration-standard)]
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
            backgroundColor: 'var(--color-specimen-night)',
            border: '1px solid var(--color-eucalypt-smoke-base)',
            boxShadow: 'var(--shadow-maximum)',
            animation: 'fadeIn 0.2s ease-out',
=======
            backgroundColor: 'var(--sys-color-charcoalBackground-base)',
            border: '1px solid var(--sys-color-worker-ash-base)',
            boxShadow: 'var(--sys-shadow-elevation4Float)',
            animation: 'fadeIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
                    ${isSelected ? 'bg-white/10 text-[var(--color-wattle-gold)]' : 'text-[var(--color-parchment)]'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}
                    transition-colors duration-150
=======
                    ${isSelected ? 'bg-white/10 text-[var(--sys-color-inkGold-base)]' : 'text-[var(--sys-color-worker-ash-base)]'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}
                    transition-colors duration-[var(--duration-fast)]
>>>>>>> restoration-KR-Rage-Figma-v2.0
                  `}
                  onClick={() => !isDisabled && handleSelect(option.value)}
                  onKeyDown={(e) => !isDisabled && handleKeyDown(e, option.value)}
                >
                  <span className="font-field-note">{option.label}</span>
                  {isSelected && (
<<<<<<< HEAD
                    <Check className="w-5 h-5 flex-shrink-0 text-[var(--color-wattle-gold)]" />
=======
                    <Check className="w-5 h-5 flex-shrink-0 text-[var(--color-ink-gold)]" />
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
          ${error ? 'text-[var(--color-waratah-crimson)]' : 'text-[var(--color-flannel-flower-dark)]'}
=======
          ${error ? 'text-[var(--sys-color-solidarityRed-base)]' : 'text-[var(--sys-color-worker-ash-base)]'}
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
export type { JarOption as M3SelectOption, JarProps as M3SelectProps };
=======
export type { JarOption as M3SelectOption, JarProps as M3SelectProps };
>>>>>>> restoration-KR-Rage-Figma-v2.0
