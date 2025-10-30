import React, { useState, forwardRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

export interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
}

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  ({ 
    value = [], 
    onChange, 
    placeholder = 'Type and press Enter...', 
    disabled,
    className = '',
    maxTags,
    allowDuplicates = false
  }, ref) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault();
        addTag(inputValue.trim());
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        removeTag(value.length - 1);
      }
    };

    const addTag = (tag: string) => {
      if (maxTags && value.length >= maxTags) return;
      if (!allowDuplicates && value.includes(tag)) return;
      
      onChange?.([...value, tag]);
      setInputValue('');
    };

    const removeTag = (index: number) => {
      const newTags = value.filter((_, i) => i !== index);
      onChange?.(newTags);
    };

    return (
      <div 
        className={`
          w-full min-h-[3rem] px-3 py-2
          bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]
          border-2 rounded-[var(--radius-lg)]
          transition-all duration-300
          ${isFocused 
            ? 'border-transparent shadow-[var(--shadow-glow-aurora)]' 
            : 'border-[var(--glass-border)]'
          }
          ${disabled && 'opacity-50 cursor-not-allowed'}
          ${className}
        `}
        style={isFocused ? {
          boxShadow: '0 0 24px rgba(167, 139, 250, 0.3), 0 0 48px rgba(244, 114, 182, 0.2)',
          borderImage: 'linear-gradient(135deg, var(--primary), var(--tertiary)) 1',
        } : {}}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {value.map((tag, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-2 px-3 py-1
                bg-gradient-to-r from-[var(--primary)]/20 to-[var(--tertiary)]/20
                border border-[var(--primary)]/30
                rounded-[var(--radius-md)]
                text-[var(--on-surface)]
                transition-all duration-200
                hover:from-[var(--primary)]/30 hover:to-[var(--tertiary)]/30
              `}
            >
              <span className="text-sm">{tag}</span>
              <button
                onClick={() => removeTag(index)}
                disabled={disabled}
                className="text-[var(--primary)] hover:text-[var(--tertiary)] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled || (maxTags !== undefined && value.length >= maxTags)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="
              flex-1 min-w-[120px] bg-transparent border-none outline-none
              text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)]
            "
          />
        </div>
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';
