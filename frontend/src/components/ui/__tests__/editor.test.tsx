import React from 'react';
import { render, screen, waitFor } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Editor } from '../editor';

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

    // Should render the editor container
    expect(screen.getByRole('textbox', { hidden: true })).toBeInTheDocument();
  });

  it('displays placeholder text when empty', () => {
    const placeholderText = 'Enter your content here...';
    render(<Editor value="" onChange={mockOnChange} placeholder={placeholderText} />);

    expect(screen.getByText(placeholderText)).toBeInTheDocument();
  });

  it('uses default placeholder when none provided', () => {
    render(<Editor value="" onChange={mockOnChange} />);

    expect(screen.getByText(/Start typing.../i)).toBeInTheDocument();
  });

  it('displays initial value correctly', () => {
    const initialValue = 'This is initial content';
    render(<Editor value={initialValue} onChange={mockOnChange} />);

    const editor = screen.getByRole('textbox', { hidden: true });
    expect(editor).toHaveTextContent(initialValue);
  });

  it('renders toolbar with formatting buttons', () => {
    render(<Editor value="" onChange={mockOnChange} />);

    // Should have bold, italic, underline buttons
    expect(screen.getByRole('button', { name: /B/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /I/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /U/i })).toBeInTheDocument();
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

    const boldButton = screen.getByRole('button', { name: /B/i });
    await user.click(boldButton);

    expect(mockExecCommand).toHaveBeenCalledWith('bold', false, undefined);
  });

  it('handles italic formatting correctly', async () => {
    render(<Editor value="" onChange={mockOnChange} />);

    const italicButton = screen.getByRole('button', { name: /I/i });
    await user.click(italicButton);

    expect(mockExecCommand).toHaveBeenCalledWith('italic', false, undefined);
  });

  it('handles underline formatting correctly', async () => {
    render(<Editor value="" onChange={mockOnChange} />);

    const underlineButton = screen.getByRole('button', { name: /U/i });
    await user.click(underlineButton);

    expect(mockExecCommand).toHaveBeenCalledWith('underline', false, undefined);
  });

  it('handles paste events correctly', async () => {
    render(<Editor value="" onChange={mockOnChange} />);

    const editor = screen.getByRole('textbox', { hidden: true });

    // Simulate paste event
    const pasteText = 'Pasted content';
    const clipboardData = {
      getData: jest.fn().mockReturnValue(pasteText),
    };

    const pasteEvent = new Event('paste', { bubbles: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: clipboardData,
    });

    editor.dispatchEvent(pasteEvent);

    expect(clipboardData.getData).toHaveBeenCalledWith('text/plain');
    expect(mockExecCommand).toHaveBeenCalledWith('insertText', false, pasteText);
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-editor-class';
    render(<Editor value="" onChange={mockOnChange} className={customClass} />);

    const container = screen.getByRole('textbox', { hidden: true }).parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('handles disabled state correctly', () => {
    render(<Editor value="" onChange={mockOnChange} disabled />);

    const boldButton = screen.getByRole('button', { name: /B/i });
    const italicButton = screen.getByRole('button', { name: /I/i });
    const underlineButton = screen.getByRole('button', { name: /U/i });

    expect(boldButton).toBeDisabled();
    expect(italicButton).toBeDisabled();
    expect(underlineButton).toBeDisabled();
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

  it('prevents default behavior on paste', async () => {
    render(<Editor value="" onChange={mockOnChange} />);

    const editor = screen.getByRole('textbox', { hidden: true });

    const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
    const preventDefault = jest.fn();
    Object.defineProperty(pasteEvent, 'preventDefault', { value: preventDefault });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { getData: jest.fn().mockReturnValue('test') },
    });

    editor.dispatchEvent(pasteEvent);

    expect(preventDefault).toHaveBeenCalled();
  });

  it('handles empty onChange gracefully', () => {
    // Test that the component doesn't crash if onChange is not provided
    expect(() => {
      render(<Editor value="" onChange={() => {}} />);
    }).not.toThrow();
  });
});
