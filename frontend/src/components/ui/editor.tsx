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
    <div className={cn("border rounded-lg", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="p-1 rounded hover:bg-gray-200 text-sm font-bold"
          disabled={disabled}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className="p-1 rounded hover:bg-gray-200 text-sm italic"
          disabled={disabled}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className="p-1 rounded hover:bg-gray-200 text-sm underline"
          disabled={disabled}
        >
          U
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          className="p-1 rounded hover:bg-gray-200 text-sm"
          disabled={disabled}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          className="p-1 rounded hover:bg-gray-200 text-sm"
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
          "p-4 min-h-[200px] focus:outline-none",
          "text-semantic-typography-body-md text-semantic-color-text-primary",
          disabled && "cursor-not-allowed opacity-50",
          isFocused && "ring-2 ring-blue-500/20"
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
          <div className="p-4 pt-16 text-gray-400 text-semantic-typography-body-md">
            {placeholder}
          </div>
        </div>
      )}
    </div>
  );
};
