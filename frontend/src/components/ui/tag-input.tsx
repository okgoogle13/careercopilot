import React, { useState, useRef, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './input';
import { Button } from './Button';
import { Badge } from './badge';

export interface Tag {
  id: string;
  label: string;
  value?: string;
}

export interface TagInputProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  suggestions?: string[];
  onCreateTag?: (value: string) => Tag | null;
  validateTag?: (tag: Tag) => boolean;
  renderTag?: (tag: Tag, onRemove: () => void) => React.ReactNode;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  tagClassName?: string;
}

export function TagInput({
  tags = [],
  onTagsChange,
  placeholder = 'Add tags...',
  maxTags,
  allowDuplicates = false,
  suggestions = [],
  onCreateTag,
  validateTag,
  renderTag,
  disabled = false,
  className,
  inputClassName,
  tagClassName,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = React.useMemo(() => {
    if (!inputValue || !suggestions.length) return [];

    const query = inputValue.toLowerCase().trim();
    if (!query) return [];

    return suggestions
      .filter(suggestion =>
        suggestion.toLowerCase().includes(query) &&
        (allowDuplicates || !tags.some(tag =>
          tag.label.toLowerCase() === suggestion.toLowerCase()
        ))
      )
      .slice(0, 10); // Limit suggestions
  }, [inputValue, suggestions, tags, allowDuplicates]);

  const canAddMoreTags = !maxTags || tags.length < maxTags;

  const createTag = (value: string): Tag | null => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return null;

    if (onCreateTag) {
      return onCreateTag(trimmedValue);
    }

    return {
      id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: trimmedValue,
      value: trimmedValue,
    };
  };

  const addTag = (value: string) => {
    if (!canAddMoreTags || !value.trim()) return;

    const newTag = createTag(value);
    if (!newTag) return;

    // Check for duplicates
    if (!allowDuplicates && tags.some(tag => tag.label.toLowerCase() === newTag.label.toLowerCase())) {
      return;
    }

    // Validate tag
    if (validateTag && !validateTag(newTag)) {
      return;
    }

    onTagsChange([...tags, newTag]);
    setInputValue('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const removeTag = (tagId: string) => {
    onTagsChange(tags.filter(tag => tag.id !== tagId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.trim().length > 0);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          addTag(filteredSuggestions[selectedSuggestionIndex]);
        } else if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
        break;

      case 'Tab':
        if (showSuggestions && selectedSuggestionIndex >= 0) {
          e.preventDefault();
          addTag(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;

      case ',':
      case ';':
        e.preventDefault();
        if (inputValue.trim()) {
          addTag(inputValue.trim());
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (showSuggestions) {
          setSelectedSuggestionIndex(prev =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (showSuggestions) {
          setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        }
        break;

      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;

      case 'Backspace':
        if (!inputValue && tags.length > 0) {
          removeTag(tags[tags.length - 1].id);
        }
        break;
    }
  };

  const handleInputBlur = () => {
    // Delay to allow suggestion clicks to register
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 150);
  };

  const handleInputFocus = () => {
    if (inputValue.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  const defaultRenderTag = (tag: Tag, onRemove: () => void) => (
    <Badge
      key={tag.id}
      variant="secondary"
      className={cn(
        'flex items-center gap-1 pr-1',
        tagClassName
      )}
    >
      <span>{tag.label}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive"
        onClick={onRemove}
        disabled={disabled}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
        'ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        disabled && 'cursor-not-allowed opacity-50'
      )}>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map(tag =>
            renderTag ? renderTag(tag, () => removeTag(tag.id)) :
            defaultRenderTag(tag, () => removeTag(tag.id))
          )}

          {canAddMoreTags && (
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              placeholder={tags.length === 0 ? placeholder : ''}
              disabled={disabled}
              className={cn(
                'border-0 p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0',
                'placeholder:text-muted-foreground min-w-[120px] flex-1',
                inputClassName
              )}
            />
          )}
        </div>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                'w-full px-3 py-2 text-sm text-left rounded-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                selectedSuggestionIndex === index && 'bg-accent text-accent-foreground'
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {maxTags && (
        <div className="mt-1 text-xs text-muted-foreground">
          {tags.length}/{maxTags} tags
        </div>
      )}
    </div>
  );
}

// Specialized TagInput for skills
interface SkillTag extends Tag {
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

interface SkillsTagInputProps extends Omit<TagInputProps, 'tags' | 'onTagsChange' | 'onCreateTag' | 'renderTag'> {
  skills: SkillTag[];
  onSkillsChange: (skills: SkillTag[]) => void;
  showLevels?: boolean;
  skillCategories?: Record<string, string[]>;
}

export function SkillsTagInput({
  skills = [],
  onSkillsChange,
  showLevels = false,
  skillCategories,
  suggestions = [],
  ...props
}: SkillsTagInputProps) {
  const allSuggestions = React.useMemo(() => {
    const categorySuggestions = skillCategories
      ? Object.values(skillCategories).flat()
      : [];
    return [...new Set([...suggestions, ...categorySuggestions])];
  }, [suggestions, skillCategories]);

  const createSkillTag = (value: string): SkillTag | null => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return null;

    // Find category for the skill
    let category: string | undefined;
    if (skillCategories) {
      for (const [cat, skillList] of Object.entries(skillCategories)) {
        if (skillList.some(skill =>
          skill.toLowerCase() === trimmedValue.toLowerCase()
        )) {
          category = cat;
          break;
        }
      }
    }

    return {
      id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: trimmedValue,
      value: trimmedValue,
      level: 'intermediate', // Default level
      category,
    };
  };

  const renderSkillTag = (skill: SkillTag, onRemove: () => void) => (
    <Badge
      key={skill.id}
      variant="secondary"
      className="flex items-center gap-2 pr-1"
    >
      <div className="flex flex-col">
        <span className="text-xs">{skill.label}</span>
        {showLevels && skill.level && (
          <span className="text-xs text-muted-foreground capitalize">
            {skill.level}
          </span>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );

  return (
    <TagInput
      {...props}
      tags={skills}
      onTagsChange={onSkillsChange}
      suggestions={allSuggestions}
      onCreateTag={createSkillTag}
      renderTag={renderSkillTag}
      placeholder="Add skills..."
    />
  );
}