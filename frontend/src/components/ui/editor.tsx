import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface EditorHandle {
  focus: () => void;
  blur: () => void;
  paste: (e: React.ClipboardEvent) => void;
  getContent: () => string;
}

export interface EditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Editor = React.forwardRef<EditorHandle, EditorProps>(({
  value,
  onChange,
  placeholder = 'Type something...',
  className,
  disabled = false,
  ...props
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
  };
  
  // Expose handlers for testing
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    },
    blur: () => {
      if (editorRef.current) {
        editorRef.current.blur();
      }
    },
    paste: handlePaste,
    getContent: () => editorRef.current?.innerHTML || '',
  }));

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  return (
    <div className={cn('rounded-md border border-input bg-background', className)} {...props}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/50">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className={cn(
            'p-2 rounded-md text-sm font-bold transition-colors',
            'text-foreground hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-50 disabled:pointer-events-none'
          )}
          disabled={disabled}
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className={cn(
            'p-2 rounded-md text-sm italic transition-colors',
            'text-foreground hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-50 disabled:pointer-events-none'
          )}
          disabled={disabled}
          aria-label="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className={cn(
            'p-2 rounded-md text-sm underline transition-colors',
            'text-foreground hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-50 disabled:pointer-events-none'
          )}
          disabled={disabled}
          aria-label="Underline"
        >
          U
        </button>
        <div className="w-px h-4 bg-border mx-2" />
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          className={cn(
            'p-2 rounded-md text-sm transition-colors',
            'text-foreground hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-50 disabled:pointer-events-none'
          )}
          disabled={disabled}
          aria-label="Unordered List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          className={cn(
            'p-2 rounded-md text-sm transition-colors',
            'text-foreground hover:bg-accent hover:text-accent-foreground',
            'disabled:opacity-50 disabled:pointer-events-none'
          )}
          disabled={disabled}
          aria-label="Ordered List"
        >
          1.
        </button>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        role="textbox"
        aria-label="Editor"
        aria-multiline="true"
        className={cn(
          'min-h-[200px] w-full p-4 focus-visible:outline-none',
          isFocused && 'ring-2 ring-ring ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
        style={{
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      />

      {/* Placeholder when empty */}
      {!value && !isFocused && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="p-4 pt-16 text-muted-foreground text-sm">{placeholder}</div>
        </div>
      )}
    </div>
  );
});

Editor.displayName = 'Editor';

export { Editor };
