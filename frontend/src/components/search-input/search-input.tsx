import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styles from './search-input.module.css';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value = '',
      onChange,
      onClear,
      placeholder = 'Search...',
      disabled = false,
      onSearch,
      className,
      ...props
    },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value);
      }
    };

    const handleClear = () => {
      if (onChange) {
        onChange('');
      }
      if (onClear) {
        onClear();
      }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && onSearch) {
        onSearch(value);
      }
    };

    const searchInputClassNames = [
      styles['search-input'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles['search-wrapper']}>
        <div className={styles['search-input-wrapper']}>
          <Search className={styles['search-icon']} size={20} />
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={searchInputClassNames}
            {...props}
          />
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={styles['clear-button']}
              aria-label="Clear search"
            >
              <X className={styles['clear-icon']} size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
