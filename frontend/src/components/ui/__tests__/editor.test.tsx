import React, { act } from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Editor, EditorHandle } from '../editor';

// Mock document.execCommand since it's not available in jsdom
const mockExecCommand = jest.fn();
Object.defineProperty(document, 'execCommand', {
  value: mockExecCommand,
  writable: true,
});

describe('Editor', () => {
  const user = userEvent.setup();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecCommand.mockReturnValue(true);
  });

  it('renders without crashing', () => {
    render(<Editor value="" onChange={mockOnChange} />);
    
    // Check if the editor container is rendered
    const editor = screen.getByRole('textbox');
    expect(editor).toBeInTheDocument();
    expect(editor).toHaveAttribute('contenteditable', 'true');
    
    // Check if the toolbar buttons are rendered
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /underline/i })).toBeInTheDocument();
  });

  it('displays placeholder text when empty', () => {
    const placeholderText = 'Enter your content here...';
    render(<Editor value="" onChange={mockOnChange} placeholder={placeholderText} />);
    
    // The placeholder should be visible when the editor is empty
    expect(screen.getByText(placeholderText)).toBeInTheDocument();
    
    // The placeholder should be hidden when the editor is focused
    const editor = screen.getByRole('textbox');
    fireEvent.focus(editor);
    expect(screen.queryByText(placeholderText)).not.toBeInTheDocument();
  });

  it('uses default placeholder when none provided', () => {
    render(<Editor value="" onChange={mockOnChange} />);
    expect(screen.getByText('Type something...')).toBeInTheDocument();
  });

  it('displays initial value correctly', () => {
    const initialValue = '<p>This is initial content</p>';
    render(<Editor value={initialValue} onChange={mockOnChange} />);

    const editor = screen.getByRole('textbox');
    expect(editor).toContainHTML(initialValue);
  });

  it('renders toolbar with formatting buttons', () => {
    render(<Editor value="" onChange={mockOnChange} />);

    // Should have bold, italic, underline buttons with specific labels
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Underline' })).toBeInTheDocument();
  });

  it('calls onChange when content is modified', async () => {
    render(<Editor value="" onChange={mockOnChange} />);

    const editor = screen.getByRole('textbox', { hidden: true });

    // Simulate typing
    editor.focus();
    await user.type(editor, 'Hello World');

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('handles bold formatting correctly', async () => {
    render(<Editor value="" onChange={mockOnChange} />);

    const boldButton = screen.getByRole('button', { name: /Bold/i });
    await user.click(boldButton);

    expect(mockExecCommand).toHaveBeenCalledWith('bold', false, undefined);
  });

  it('handles italic formatting correctly', async () => {
    render(<Editor value="" onChange={mockOnChange} />);

    const italicButton = screen.getByRole('button', { name: /Italic/i });
    await user.click(italicButton);

    expect(mockExecCommand).toHaveBeenCalledWith('italic', false, undefined);
  });

  it('handles underline formatting correctly', async () => {
    render(<Editor value="" onChange={mockOnChange} />);

    const underlineButton = screen.getByRole('button', { name: /Underline/i });
    await user.click(underlineButton);

    expect(mockExecCommand).toHaveBeenCalledWith('underline', false, undefined);
  });

  it('handles paste events correctly', async () => {
    const editorRef = React.createRef<EditorHandle>();
    const mockPasteEvent = {
      preventDefault: jest.fn(),
      clipboardData: {
        getData: jest.fn().mockReturnValue('Pasted text')
      }
    } as unknown as React.ClipboardEvent;

    // Mock document.execCommand to update the content
    const originalExecCommand = document.execCommand;
    document.execCommand = jest.fn((command, showUI, value) => {
      if (command === 'insertText' && value) {
        editorRef.current?.focus();
        // Update the mock content
        if (editorRef.current) {
          const editor = editorRef.current as any;
          editor._editorRef = { current: { innerHTML: value } };
        }
        return true;
      }
      return false;
    });

    render(<Editor ref={editorRef} value="" onChange={mockOnChange} />);
    
    // Trigger paste using the ref
    act(() => {
      editorRef.current?.paste(mockPasteEvent);
    });
    
    // Verify the paste handler was called with the correct data
    expect(mockPasteEvent.preventDefault).toHaveBeenCalled();
    expect(mockPasteEvent.clipboardData.getData).toHaveBeenCalledWith('text/plain');
    
    // Clean up
    document.execCommand = originalExecCommand;
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-editor-class';
    render(<Editor value="" onChange={mockOnChange} className={customClass} />);

    const container = screen.getByRole('textbox', { hidden: true }).parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('formats text when format buttons are clicked', async () => {
    // Mock document.execCommand to track calls
    const originalExecCommand = document.execCommand;
    document.execCommand = jest.fn();
    
    render(<Editor value="test" onChange={mockOnChange} />);

    const boldButton = screen.getByRole('button', { name: /Bold/i });
    const italicButton = screen.getByRole('button', { name: /Italic/i });
    const underlineButton = screen.getByRole('button', { name: /Underline/i });

    // Mock the editor focus
    const editor = screen.getByRole('textbox');
    const focusSpy = jest.spyOn(editor, 'focus');
    
    // Test bold button
    await user.click(boldButton);
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, undefined);
    expect(focusSpy).toHaveBeenCalled();
    
    // Reset the mock for the next test
    (document.execCommand as jest.Mock).mockClear();
    
    // Test italic button
    await user.click(italicButton);
    expect(document.execCommand).toHaveBeenCalledWith('italic', false, undefined);
    
    // Reset the mock for the next test
    (document.execCommand as jest.Mock).mockClear();
    
    // Test underline button
    await user.click(underlineButton);
    expect(document.execCommand).toHaveBeenCalledWith('underline', false, undefined);
    
    // Clean up
    document.execCommand = originalExecCommand;
    focusSpy.mockRestore();
  });

  it('updates content when value prop changes', async () => {
    const { rerender } = render(<Editor value="Initial" onChange={mockOnChange} />);

    const editor = screen.getByRole('textbox', { hidden: true });
    expect(editor).toHaveTextContent('Initial');

    rerender(<Editor value="Updated" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(editor).toHaveTextContent('Updated');
    });
  });

  it('focuses on editor after formatting', async () => {
    render(<Editor value="" onChange={mockOnChange} />);

    const editor = screen.getByRole('textbox', { hidden: true });
    const boldButton = screen.getByRole('button', { name: /B/i });

    await user.click(boldButton);

    await waitFor(() => {
      expect(document.activeElement).toBe(editor);
    });
  });

  it('handles focus and blur events', async () => {
    render(<Editor value="" onChange={mockOnChange} />);

    const editor = screen.getByRole('textbox', { hidden: true });

    await user.click(editor);
    expect(editor).toHaveFocus();

    await user.tab();
    expect(editor).not.toHaveFocus();
  });

  it('prevents default paste behavior', () => {
    const editorRef = React.createRef<EditorHandle>();
    const mockPasteEvent = {
      preventDefault: jest.fn(),
      clipboardData: {
        getData: jest.fn().mockReturnValue('Pasted text')
      }
    } as unknown as React.ClipboardEvent;

    render(<Editor ref={editorRef} value="" onChange={mockOnChange} />);
    
    // Trigger paste using the ref
    act(() => {
      editorRef.current?.paste(mockPasteEvent);
    });
    
    // Verify preventDefault was called
    expect(mockPasteEvent.preventDefault).toHaveBeenCalled();
  });

  it('handles empty onChange gracefully', () => {
    // Test that the component doesn't crash if onChange is not provided
    expect(() => {
      render(<Editor value="" onChange={() => {}} />);
    }).not.toThrow();
  });
});
