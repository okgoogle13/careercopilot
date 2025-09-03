import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './input';
import { Button } from './Button';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
  showSearchButton?: boolean;
  debounceMs?: number;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  className?: string;
}

export function SearchInput({
  value = '',
  onChange,
  onSearch,
  onClear,
  loading = false,
  showSearchButton = false,
  debounceMs = 300,
  suggestions = [],
  onSuggestionSelect,
  className,
  placeholder = 'Search...',
  ...props
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = React.useId?.() || Math.random().toString(36);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Sync external value with internal state
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (onChange) {
        onChange(internalValue);
      }
      if (onSearch && internalValue.trim()) {
        onSearch(internalValue.trim());
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [internalValue, onChange, onSearch, debounceMs]);

  // Show/hide suggestions based on input focus and suggestions availability
  useEffect(() => {
    setShowSuggestions(suggestions.length > 0 && internalValue.length > 0);
    setSelectedIndex(-1);
  }, [suggestions, internalValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setInternalValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onChange) {
      onChange('');
    }
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  const handleSearchClick = () => {
    if (onSearch && internalValue.trim()) {
      onSearch(internalValue.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInternalValue(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onChange) {
      onChange(suggestion);
    }
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (onSearch && internalValue.trim()) {
          onSearch(internalValue.trim());
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks to register
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 150);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 && internalValue.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <Input
          ref={inputRef}
          type="text"
          value={internalValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={cn(
            'pl-10',
            (internalValue || showSearchButton) && 'pr-20',
            !internalValue && !showSearchButton && 'pr-4'
          )}
          {...props}
        />

        <div className="absolute right-2 flex items-center gap-1">
          {internalValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              tabIndex={-1}
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          {showSearchButton && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSearchClick}
              className="h-6 w-6 p-0"
              disabled={loading || !internalValue.trim()}
            >
              <Search className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion}-${index}`}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                'w-full px-3 py-2 text-sm text-left rounded-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:bg-accent focus:text-accent-foreground',
                'focus:outline-none',
                selectedIndex === index && 'bg-accent text-accent-foreground'
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Specialized search input for filtering lists/tables
interface FilterSearchProps extends Omit<SearchInputProps, 'suggestions'> {
  filterText?: string;
  onFilterChange?: (filter: string) => void;
  resultCount?: number;
  showResultCount?: boolean;
}

export function FilterSearch({
  filterText = '',
  onFilterChange,
  resultCount,
  showResultCount = false,
  placeholder = 'Filter...',
  className,
  ...props
}: FilterSearchProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <SearchInput
        value={filterText}
        onChange={onFilterChange}
        placeholder={placeholder}
        className="flex-1"
        {...props}
      />
      {showResultCount && resultCount !== undefined && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
