import React, { useState, useRef, useCallback } from 'react';
import { Bold, Italic, Underline, Link, List, ListOrdered, Quote, Code, Undo, Redo, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Separator } from './separator';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Input } from './input';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  showToolbar?: boolean;
  toolbarClassName?: string;
  editorClassName?: string;
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  className,
  minHeight = 200,
  maxHeight = 600,
  showToolbar = true,
  toolbarClassName,
  editorClassName,
}: RichTextEditorProps) {
  const [content, setContent] = useState(value);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange?.(newContent);
    }
  }, [onChange]);

  const executeCommand = useCallback((command: string, value?: string) => {
    if (disabled) return;
    
    document.execCommand(command, false, value);
    handleContentChange();
    editorRef.current?.focus();
  }, [disabled, handleContentChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            executeCommand('redo');
          } else {
            executeCommand('undo');
          }
          break;
      }
    }
  }, [executeCommand]);

  const insertLink = useCallback(() => {
    if (linkUrl && linkText) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const link = document.createElement('a');
        link.href = linkUrl;
        link.textContent = linkText;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        range.deleteContents();
        range.insertNode(link);
        
        // Clear selection
        selection.removeAllRanges();
      }
      
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
      handleContentChange();
    }
  }, [linkUrl, linkText, handleContentChange]);

  const formatBlock = useCallback((tag: string) => {
    executeCommand('formatBlock', tag);
  }, [executeCommand]);

  React.useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  React.useEffect(() => {
    setContent(value);
  }, [value]);

  return (
    <div className={cn('border rounded-md overflow-hidden', className)}>
      {showToolbar && (
        <div className={cn('border-b bg-muted/50 p-2', toolbarClassName)}>
          <div className="flex items-center gap-1 flex-wrap">
            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('bold')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('italic')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('underline')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Underline (Ctrl+U)"
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Alignment */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('justifyLeft')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('justifyCenter')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('justifyRight')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Lists */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('insertUnorderedList')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('insertOrderedList')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Formatting */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatBlock('blockquote')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('formatBlock', 'pre')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Code Block"
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Links */}
            <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                  title="Insert Link"
                >
                  <Link className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Link Text</label>
                    <Input
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Enter link text"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <Input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={insertLink} size="sm">
                      Insert Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLinkDialog(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="h-6" />

            {/* History */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('undo')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => executeCommand('redo')}
                disabled={disabled}
                className="h-8 w-8 p-0"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Heading Dropdown */}
            <select
              className="text-sm border rounded px-2 py-1 bg-background"
              onChange={(e) => formatBlock(e.target.value)}
              disabled={disabled}
              defaultValue=""
            >
              <option value="">Format</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="p">Paragraph</option>
            </select>
          </div>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'prose prose-sm max-w-none focus:outline-none p-4',
          'min-h-[200px] max-h-[600px] overflow-y-auto',
          disabled && 'opacity-50 cursor-not-allowed',
          editorClassName
        )}
        style={{ 
          minHeight: `${minHeight}px`, 
          maxHeight: `${maxHeight}px` 
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
}

// Simplified RichTextEditor for basic formatting
interface SimpleRichTextEditorProps extends Omit<RichTextEditorProps, 'showToolbar'> {
  basicToolbar?: boolean;
}

export function SimpleRichTextEditor({
  basicToolbar = true,
  ...props
}: SimpleRichTextEditorProps) {
  return (
    <RichTextEditor
      {...props}
      showToolbar={basicToolbar}
      toolbarClassName="p-1"
    />
  );
}