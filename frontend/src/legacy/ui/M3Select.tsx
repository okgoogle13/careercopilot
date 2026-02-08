import React, { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface M3SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export type M3SelectMode = 'kr-dark' | 'kr-dark';

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
    /** Theme mode: kr-dark (warm, botanical) or kr-dark (clinical, precise) */
    mode?: M3SelectMode;
    /** Additional CSS classes */
    className?: string;
    /** ID for accessibility */
    id?: string;
}

/**
 * M3Select - kerala-rage kr-solidarity Select Dropdown
 *
 * Supports both kr-dark (warm, botanical) and kr-dark (clinical, precise) modes.
 *
 * **kerala-rage Token Usage:**
 * - Typography: `font-field-note` (Options), `font-annotation` (Label)
 * - Color: `primary-wattle-gold` (Focus), `tertiary-waratah-red` (Error)
 * - Shape: `radius-stone` (kr-dark), organic asymmetry (kr-dark)
 * - Motion: `ease-viscous` (kr-dark), `ease-precise` (kr-dark)
 *
 * **Accessibility:**
 * - WCAG 2.1 Level AA compliant
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - ARIA attributes for screen readers
 * - Visible focus indicators
 */
export const M3Select = forwardRef<HTMLButtonElement, M3SelectProps>(({
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
    mode = 'kr-dark',
    className = '',
    id,
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFloating, setIsFloating] = useState(!!value);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update floating state when value changes
    useEffect(() => {
        setIsFloating(!!value);
    }, [value]);

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

    const handleSelect = useCallback((optionValue: string) => {
        onChange?.(optionValue);
        setIsOpen(false);
        setIsFloating(true);
        setFocusedIndex(-1);
    }, [onChange]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            switch (event.key) {
                case 'Escape':
                    setIsOpen(false);
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setFocusedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (focusedIndex >= 0 && !options[focusedIndex].disabled) {
                        handleSelect(options[focusedIndex].value);
                    }
                    break;
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, focusedIndex, options, handleSelect]);

    const selectedOption = options.find(opt => opt.value === value);
    const displayHelperText = errorMessage || helperText;

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            setIsFloating(true);
        }
    };

    // Theme variants (kr-dark vs. kr-dark)
    const themeVariants = {
        kr-dark: {
            button: `
                border-2 
                ${error ? 'border-tertiary-waratah-red' : 'border-primary-wattle-gold/80'}
                ${isOpen && !error ? 'border-primary-wattle-gold ring-2 ring-primary-wattle-gold/30' : ''}
                bg-surface-kr-dark-concrete-grey
                shadow-sm
                rounded-[8px_12px_6px_10px]
            `,
            dropdown: `
                bg-surface-kr-dark-concrete-grey
                border border-primary-wattle-gold/40
                shadow-elevated
                rounded-[8px_12px_6px_10px]
            `,
            option: {
                selected: 'bg-wattle-gold/20 text-on-surface-paper-white',
                hover: 'hover:bg-wattle-gold/10',
            },
            label: {
                base: 'text-on-surface-paper-white',
                error: 'text-tertiary-waratah-red',
                floating: 'text-secondary-flannel-dim',
            },
        },
        kr-dark: {
            button: `
                border-2 
                ${error ? 'border-tertiary-waratah-red' : 'border-outline-variant'}
                ${isOpen && !error ? 'border-primary-wattle-gold ring-2 ring-primary-wattle-gold/20' : ''}
                ${!disabled && !error && !isOpen ? 'hover:border-outline' : ''}
                bg-surface-shared-asphalt-black/50 backdrop-blur-sm
                radius-stone
            `,
            dropdown: `
                bg-surface-shared-asphalt-black/95 backdrop-blur-sm
                border border-outline-variant
                shadow-elevated
                radius-stone
            `,
            option: {
                selected: 'bg-wattle-gold/15 text-on-surface-paper-white',
                hover: 'hover:bg-surface-shared-asphalt-black',
            },
            label: {
                base: 'text-on-surface-paper-white-dim',
                error: 'text-tertiary-waratah-red',
                floating: 'text-secondary-flannel-dim',
            },
        },
    };

    const currentTheme = themeVariants[mode];

    return (
        <div
            ref={containerRef}
            className={`relative flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}
        >
            {/* Select Button */}
            <div className="relative">
                {/* Floating Label */}
                {label && (
                    <label
                        htmlFor={id}
                        className={`
                            absolute left-4 z-10
                            font-annotation font-medium tracking-wide
                            transition-all duration-fast ease-viscous
                            pointer-events-none
                            ${isFloating
                                ? `text-xs -top-6 ${error ? currentTheme.label.error : currentTheme.label.floating}`
                                : `text-sm top-3 ${error ? currentTheme.label.error : currentTheme.label.base}`
                            }
                        `}
                    >
                        {label}
                        {required && <span className="text-tertiary-waratah-red ml-1">*</span>}
                    </label>
                )}

                <button
                    ref={ref}
                    id={id}
                    type="button"
                    className={`
                        ${fullWidth ? 'w-full' : 'w-auto min-w-[200px]'}
                        px-4 py-3
                        flex items-center justify-between gap-3
                        ${currentTheme.button}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        text-on-surface-paper-white font-field-note
                        transition-all duration-standard ease-viscous
                        focus:outline-2 focus:outline-offset-2 focus:outline-primary-wattle-gold
                        ${className}
                    `}
                    onClick={handleToggle}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-required={required}
                    aria-invalid={error}
                    aria-label={label}
                >
                    <span className={selectedOption ? 'text-on-surface-paper-white' : 'text-secondary-flannel-dim'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`
                            w-5 h-5 text-secondary-flannel-dim
                            transition-transform duration-standard ease-viscous
                            ${isOpen ? 'rotate-180' : 'rotate-0'}
                        `}
                    />
                </button>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={`
                        absolute top-full left-0 right-0 mt-2
                        ${currentTheme.dropdown}
                        overflow-hidden
                        z-50
                        animate-in fade-in slide-in-from-top-2
                        transition-all duration-moderate ease-viscous
                    `}
                    role="listbox"
                    aria-label={label}
                >
                    <div className="max-h-60 overflow-y-auto">
                        {options.map((option, index) => {
                            const isSelected = option.value === value;
                            const isFocused = index === focusedIndex;
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
                                        font-field-note
                                        ${isSelected ? currentTheme.option.selected : 'text-on-surface-paper-white'}
                                        ${isFocused && !isDisabled ? 'bg-wattle-gold/10' : ''}
                                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : `cursor-pointer ${currentTheme.option.hover}`}
                                        transition-colors duration-fast ease-viscous
                                    `}
                                    onClick={() => !isDisabled && handleSelect(option.value)}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                >
                                    <span>{option.label}</span>
                                    {isSelected && (
                                        <Check className="w-5 h-5 flex-shrink-0 text-wattle-gold" />
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
                        mt-2 px-1 text-xs font-annotation
                        ${error ? 'text-tertiary-waratah-red' : 'text-secondary-flannel-dim'}
                    `}
                >
                    {displayHelperText}
                </p>
            )}
        </div>
    );
});

M3Select.displayName = 'M3Select';
