import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface M3SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface M3SelectProps {
    /** Select label */
    label?: string;

    /** Helper text below select */
    helperText?: string;

    /** Error state */
    error?: boolean;

    /** Error message */
    errorMessage?: string;

    /** Available options */
    options: M3SelectOption[];

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
 * M3Select - Material Design 3 Compliant Select Dropdown
 * 
 * A custom select component using M3 design tokens with enhanced UX.
 * Features organic shapes, proper elevation, and smooth animations.
 * 
 * **M3 Design Token Usage:**
 * - Shape: `rounded-tech` for select button, `rounded-pebble` for dropdown
 * - Elevation: `shadow-elevation-3` for dropdown menu
 * - Motion: Spring easing for smooth open/close
 * - Colors: M3 semantic surface tokens
 * - Typography: M3 body scale
 * 
 * @example
 * ```tsx
 * <M3Select
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
export function M3Select({
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
}: M3SelectProps) {
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

    const selectedOption = options.find(opt => opt.value === value);
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

    return (
        <div
            ref={containerRef}
            className={`relative flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}
        >
            {/* Label */}
            {label && (
                <label className={`
          mb-2 text-label-large font-medium
          ${error ? 'text-error' : 'text-on-surface'}
        `}>
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}

            {/* Select Button */}
            <button
                type="button"
                className={`
          ${fullWidth ? 'w-full' : 'w-auto min-w-[200px]'}
          px-4 py-3
          flex items-center justify-between gap-3
          rounded-tech
          border-2
          ${error ? 'border-error' : 'border-outline-variant'}
          ${isOpen && !error ? 'border-primary ring-2 ring-primary/20' : ''}
          ${!disabled && !error && !isOpen ? 'hover:border-outline' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          bg-surface-container
          text-on-surface
          transition-all duration-medium-1 ease-spring
          ${className}
        `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={label ? `${label}-label` : undefined}
            >
                <span className={selectedOption ? 'text-on-surface' : 'text-on-surface-variant'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`
            w-5 h-5 text-on-surface-variant
            transition-transform duration-medium-1 ease-spring
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={`
            absolute top-full left-0 right-0 mt-2
            rounded-pebble
            bg-surface-container-high
            border border-outline-variant
            shadow-elevation-3
            overflow-hidden
            z-50
            animate-in fade-in slide-in-from-top-2 duration-200
          `}
                    role="listbox"
                >
                    <div className="max-h-60 overflow-y-auto">
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
                    ${isSelected ? 'bg-primary-container text-on-primary-container' : 'text-on-surface'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container-highest'}
                    transition-colors duration-short-2
                  `}
                                    onClick={() => !isDisabled && handleSelect(option.value)}
                                    onKeyDown={(e) => !isDisabled && handleKeyDown(e, option.value)}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && (
                                        <Check className="w-5 h-5 flex-shrink-0" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Helper Text / Error Message */}
            {displayHelperText && (
                <p className={`
          mt-1 px-1 text-label-small
          ${error ? 'text-error' : 'text-on-surface-variant'}
        `}>
                    {displayHelperText}
                </p>
            )}
        </div>
    );
}
