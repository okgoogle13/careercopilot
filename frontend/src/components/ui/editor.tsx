import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  className,
  disabled = false
}) => {
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
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  return (
    <div className={cn("border border-border rounded-lg bg-card", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/50">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className={cn(
            "p-2 rounded-md text-sm font-bold transition-colors",
            "text-foreground hover:bg-accent hover:text-accent-foreground",
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
          disabled={disabled}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className={cn(
            "p-2 rounded-md text-sm italic transition-colors",
            "text-foreground hover:bg-accent hover:text-accent-foreground",
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
          disabled={disabled}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className={cn(
            "p-2 rounded-md text-sm underline transition-colors",
            "text-foreground hover:bg-accent hover:text-accent-foreground",
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
          disabled={disabled}
        >
          U
        </button>
        <div className="w-px h-4 bg-border mx-2" />
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          className={cn(
            "p-2 rounded-md text-sm transition-colors",
            "text-foreground hover:bg-accent hover:text-accent-foreground",
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
          disabled={disabled}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          className={cn(
            "p-2 rounded-md text-sm transition-colors",
            "text-foreground hover:bg-accent hover:text-accent-foreground",
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
          disabled={disabled}
        >
          1.
        </button>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "p-4 min-h-[200px] focus:outline-none relative",
          "text-sm text-foreground bg-card",
          "transition-colors duration-200",
          disabled && "cursor-not-allowed opacity-50",
          isFocused && "ring-2 ring-ring/50"
        )}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
        style={{
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      />

      {/* Placeholder when empty */}
      {!value && !isFocused && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="p-4 pt-16 text-muted-foreground text-sm">
            {placeholder}
          </div>
        </div>
      )}
    </div>
  );
};
