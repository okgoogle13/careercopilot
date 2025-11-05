import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  filterFunction?: (option: AutocompleteOption, query: string) => boolean;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Search...',
      disabled,
      className = '',
      filterFunction,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const defaultFilter = (option: AutocompleteOption, query: string) => {
      return option.label.toLowerCase().includes(query.toLowerCase());
    };

    const filter = filterFunction || defaultFilter;

    const filteredOptions = options.filter((option) =>
      inputValue ? filter(option, inputValue) : true
    );

    useEffect(() => {
      const selectedOption = options.find((opt) => opt.value === value);
      if (selectedOption && !inputValue) {
        setInputValue(selectedOption.label);
      }
    }, [value, options, inputValue]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: AutocompleteOption) => {
      setInputValue(option.label);
      onChange?.(option.value);
      setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    return (
      <div ref={containerRef} className={`relative w-full ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
              setHighlightedIndex(0);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              w-full px-4 py-3 pr-10
              bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
              border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)]
              text-[var(--on-surface)]
              transition-all duration-300
              hover:border-[var(--glass-border-hover)]
              focus:outline-none focus:border-transparent focus:shadow-[var(--shadow-glow-aurora)]
              ${disabled && 'opacity-50 cursor-not-allowed'}
            `}
            style={
              isOpen
                ? {
                    boxShadow:
                      '0 0 24px rgba(167, 139, 250, 0.3), 0 0 48px rgba(244, 114, 182, 0.2)',
                    borderImage: 'linear-gradient(135deg, var(--primary), var(--tertiary)) 1',
                  }
                : {}
            }
          />
          <ChevronDown
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--primary)]
              transition-transform duration-300
              ${isOpen && 'rotate-180'}
            `}
          />
        </div>

        {isOpen && filteredOptions.length > 0 && (
          <div
            className={`
            absolute z-50 w-full mt-2 max-h-64 overflow-y-auto
            bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
            border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)]
            shadow-[var(--shadow-glow-aurora)]
            scrollbar-thin scrollbar-thumb-[var(--primary)] scrollbar-track-transparent
          `}
          >
            {filteredOptions.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    w-full px-4 py-3 text-left flex items-center justify-between gap-2
                    transition-all duration-200
                    ${
                      isHighlighted
                        ? 'bg-gradient-to-r from-[var(--primary)]/20 to-[var(--tertiary)]/20'
                        : 'hover:bg-[var(--glass-bg)]'
                    }
                    ${index === 0 && 'rounded-t-[var(--radius-lg)]'}
                    ${index === filteredOptions.length - 1 && 'rounded-b-[var(--radius-lg)]'}
                  `}
                >
                  <span className="text-[var(--on-surface)]">{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[var(--primary)]" />}
                </button>
              );
            })}
          </div>
        )}

        {isOpen && filteredOptions.length === 0 && inputValue && (
          <div
            className={`
            absolute z-50 w-full mt-2 p-4
            bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
            border-2 border-[var(--glass-border)] rounded-[var(--radius-lg)]
            text-center text-[var(--on-surface-variant)]
          `}
          >
            No results found
          </div>
        )}
      </div>
    );
  }
);

Autocomplete.displayName = 'Autocomplete';
