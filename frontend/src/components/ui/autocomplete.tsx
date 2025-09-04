import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Search, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './input';
import { Button } from './Button';
import { useId } from '@radix-ui/react-id';

export interface AutoCompleteOption {
  value: string;
  label: string;
  description?: string;
  metadata?: any;
  disabled?: boolean;
}

export interface AutoCompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: AutoCompleteOption) => void;
  options?: AutoCompleteOption[];
  onSearch?: (query: string) => AutoCompleteOption[] | Promise<AutoCompleteOption[]>;
  placeholder?: string;
  emptyText?: string;
  loadingText?: string;
  debounceMs?: number;
  minSearchLength?: number;
  maxResults?: number;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  optionClassName?: string;
  allowCustomValue?: boolean;
  filterOptions?: (options: AutoCompleteOption[], query: string) => AutoCompleteOption[];
}

function defaultFilterOptions(options: AutoCompleteOption[], query: string): AutoCompleteOption[] {
  const lowerQuery = query.toLowerCase();
  return options.filter(
    option =>
      option.label.toLowerCase().includes(lowerQuery) ||
      option.value.toLowerCase().includes(lowerQuery) ||
      option.description?.toLowerCase().includes(lowerQuery)
  );
}

export function AutoComplete({
  value = '',
  onChange,
  onSelect,
  options = [],
  onSearch,
  placeholder = 'Type to search...',
  emptyText = 'No results found',
  loadingText = 'Searching...',
  debounceMs = 300,
  minSearchLength = 1,
  maxResults = 50,
  clearable = true,
  disabled = false,
  className,
  inputClassName,
  optionClassName,
  allowCustomValue = true,
  filterOptions = defaultFilterOptions,
}: AutoCompleteProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<AutoCompleteOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeDescendant, setActiveDescendant] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const listboxId = useId('listbox');
  const errorId = useId('error');
  const descriptionId = useId('description');

  // Memoized filtered options for static data
  const filteredOptions = useMemo(() => {
    if (onSearch) return searchResults; // Use search results for async
    if (!query || query.length < minSearchLength) return [];

    const filtered = filterOptions(options, query);
    return filtered.slice(0, maxResults);
  }, [options, query, minSearchLength, maxResults, filterOptions, onSearch, searchResults]);

  // Debounced search function
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!onSearch || searchQuery.length < minSearchLength) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await onSearch(searchQuery);
        setSearchResults(Array.isArray(results) ? results.slice(0, maxResults) : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch, minSearchLength, maxResults]
  );

  // Handle input changes with debouncing
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      setSelectedIndex(-1);
      setIsOpen(true);

      onChange?.(newQuery);

      // Debounce search
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        performSearch(newQuery);
      }, debounceMs);
    },
    [onChange, performSearch, debounceMs]
  );

  // Handle option selection
  const handleOptionSelect = useCallback(
    (option: AutoCompleteOption) => {
      setQuery(option.label);
      setIsOpen(false);
      setSelectedIndex(-1);

      onChange?.(option.label);
      onSelect?.(option);

      inputRef.current?.blur();
    },
    [onChange, onSelect]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          setIsOpen(true);
          performSearch(query);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;

        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleOptionSelect(filteredOptions[selectedIndex]);
          } else if (allowCustomValue && query.trim()) {
            // Handle custom value
            const customOption: AutoCompleteOption = {
              value: query.trim(),
              label: query.trim(),
            };
            handleOptionSelect(customOption);
          }
          break;

        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [
      isOpen,
      filteredOptions,
      selectedIndex,
      handleOptionSelect,
      allowCustomValue,
      query,
      performSearch,
    ]
  );

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
    if (query.length >= minSearchLength) {
      performSearch(query);
    }
  }, [query, minSearchLength, performSearch]);

  // Handle input blur
  const handleInputBlur = useCallback((e: React.FocusEvent) => {
    // Check if the blur is due to clicking on an option
    const relatedTarget = e.relatedTarget as HTMLElement;
    const clickedOnOption = relatedTarget?.getAttribute('role') === 'option';

    if (!clickedOnOption) {
      // Delay to allow option clicks to register
      setTimeout(() => {
        setIsOpen(false);
        setSelectedIndex(-1);
        setActiveDescendant(null);
      }, 150);
    }
  }, []);

  // Handle clear
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setQuery('');
      setSearchResults([]);
      setSelectedIndex(-1);
      setIsOpen(false);

      onChange?.('');
      inputRef.current?.focus();
    },
    [onChange]
  );

  // Scroll selected item into view and update active descendant
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
        });
        setActiveDescendant(selectedElement.id);
      }
    } else {
      setActiveDescendant(null);
    }
  }, [selectedIndex]);

  // Set mounted state to handle SSR
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Generate unique IDs for options
  const getOptionId = useCallback(
    (index: number) => {
      return `${listboxId}-option-${index}`;
    },
    [listboxId]
  );

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Cleanup debounce on unmount
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const shouldShowDropdown =
    isOpen &&
    (filteredOptions.length > 0 ||
      isLoading ||
      error ||
      (query.length >= minSearchLength && !isLoading && filteredOptions.length === 0));

  // Accessibility attributes
  const inputProps = {
    'aria-autocomplete': 'list' as const,
    'aria-expanded': isOpen,
    'aria-haspopup': 'listbox' as const,
    'aria-owns': listboxId,
    'aria-activedescendant': activeDescendant || undefined,
    'aria-describedby': error ? errorId : undefined,
    'aria-invalid': error ? 'true' : 'false',
    role: 'combobox',
  };

  return (
    <div className={cn('relative', className)}>
      <div className='relative'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none'>
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
          ) : (
            <Search className='h-4 w-4 text-muted-foreground' />
          )}
        </div>

        <Input
          ref={inputRef}
          type='text'
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'pl-10',
            clearable && query && 'pr-10',
            error && 'border-destructive focus-visible:ring-destructive/50',
            inputClassName
          )}
          autoComplete='off'
          {...inputProps}
        />

        {clearable && query && !disabled && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handleClear}
            className='absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive'
            tabIndex={-1}
          >
            <X className='h-3 w-3' />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {isMounted && shouldShowDropdown && (
        <div
          id={listboxId}
          role='listbox'
          ref={listRef}
          className='absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95'
          aria-labelledby={inputProps['aria-labelledby']}
          aria-multiselectable='false'
        >
          {error && (
            <div
              id={errorId}
              className='p-3 text-sm text-destructive flex items-start gap-2'
              role='alert'
              aria-live='assertive'
            >
              <AlertCircle className='h-4 w-4 mt-0.5 flex-shrink-0' />
              <span>{error}</span>
            </div>
          )}

          {isLoading && (
            <div className='p-3 text-sm text-muted-foreground flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              {loadingText}
            </div>
          )}

          {!isLoading && !error && filteredOptions.length === 0 && (
            <div className='p-3 text-sm text-muted-foreground text-center'>{emptyText}</div>
          )}

          {!isLoading && !error && filteredOptions.length > 0 && (
            <>
              <div id={descriptionId} className='sr-only' aria-live='polite' aria-atomic='true'>
                {`${filteredOptions.length} ${filteredOptions.length === 1 ? 'option' : 'options'} available`}
              </div>
              {filteredOptions.map((option, index) => (
                <button
                  key={`${option.value}-${index}`}
                  id={getOptionId(index)}
                  type='button'
                  onClick={() => !option.disabled && handleOptionSelect(option)}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:outline-none focus:bg-accent focus:text-accent-foreground',
                    'disabled:pointer-events-none disabled:opacity-50',
                    selectedIndex === index && 'bg-accent text-accent-foreground',
                    option.disabled && 'pointer-events-none opacity-50',
                    optionClassName
                  )}
                  disabled={option.disabled}
                  role='option'
                  aria-selected={selectedIndex === index}
                  aria-disabled={option.disabled}
                  aria-setsize={filteredOptions.length}
                  aria-posinset={index + 1}
                  tabIndex={-1}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium'>{option.label}</div>
                      {option.description && (
                        <div className='text-xs text-muted-foreground truncate'>
                          {option.description}
                        </div>
                      )}
                    </div>

                    {value === option.value && <Check className='ml-2 h-4 w-4 shrink-0' />}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Specialized AutoComplete for async search
interface AsyncAutoCompleteProps extends Omit<AutoCompleteProps, 'options' | 'onSearch'> {
  searchFunction: (query: string, signal?: AbortSignal) => Promise<AutoCompleteOption[]>;
  cacheResults?: boolean;
}

export function AsyncAutoComplete({
  searchFunction,
  cacheResults = true,
  ...props
}: AsyncAutoCompleteProps) {
  const [cache, setCache] = useState<Map<string, AutoCompleteOption[]>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = useCallback(
    async (query: string): Promise<AutoCompleteOption[]> => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Check cache
      if (cacheResults && cache.has(query)) {
        return cache.get(query)!;
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        const results = await searchFunction(query, abortControllerRef.current.signal);

        // Cache results
        if (cacheResults) {
          setCache(prev => new Map(prev).set(query, results));
        }

        return results;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Request was aborted, return empty array
          return [];
        }
        throw error;
      }
    },
    [searchFunction, cacheResults, cache]
  );

  return <AutoComplete {...props} onSearch={handleSearch} />;
}
