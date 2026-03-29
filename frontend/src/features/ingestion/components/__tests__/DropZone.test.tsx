import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';

// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, onDragOver, onDragLeave, onDrop, ...props }: any) => (
      <div
        onClick={onClick}
        className={className}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

// Dynamic import
const { DropZone } = await import('../DropZone');

describe('DropZone', () => {
  const onFileDrop = jest.fn();
  const onValidationError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in initial state', () => {
    render(
      <DropZone
        onFileDrop={onFileDrop}
        onValidationError={onValidationError}
      />
    );

    expect(screen.getByText('DEPOSIT ARTIFACTS')).toBeInTheDocument();
    expect(screen.getByText('[ ARCHIVE INPUT ]')).toBeInTheDocument();
    expect(screen.getByText('Open Dossier')).toBeInTheDocument();
  });

  it('handles file input selection', () => {
    render(
      <DropZone
        onFileDrop={onFileDrop}
        onValidationError={onValidationError}
      />
    );

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = document.getElementById('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileDrop).toHaveBeenCalledWith([file]);
  });

  it('shows processing state', () => {
    render(
      <DropZone
        onFileDrop={onFileDrop}
        onValidationError={onValidationError}
        isProcessing={true}
      />
    );

    expect(screen.getByText('Synthesizing Artifacts...')).toBeInTheDocument();
    const input = document.getElementById('file-input') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('triggers validation error on invalid file', () => {
    render(
      <DropZone
        onFileDrop={onFileDrop}
        onValidationError={onValidationError}
      />
    );

    // .exe is invalid by default
    const file = new File(['bad'], 'virus.exe', { type: 'application/x-msdownload' });
    const input = document.getElementById('file-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(onValidationError).toHaveBeenCalledWith(
      expect.stringContaining('unsupported file type')
    );
    expect(onFileDrop).not.toHaveBeenCalled();
  });

  it('handles drag over and leave events', () => {
    render(
      <DropZone
        onFileDrop={onFileDrop}
        onValidationError={onValidationError}
      />
    );
    // The component uses stateStyles.border which is added to a motion.div
    const dropzone = screen.getByTestId('file-dropzone');

    fireEvent.dragOver(dropzone);
    // Drag-over state adds border-solid (CSS variable border color applied inline)
    expect(dropzone).toHaveClass('border-solid');
    expect(dropzone).not.toHaveClass('border-dashed');

    fireEvent.dragLeave(dropzone);
    // Returns to border-dashed default state
    expect(dropzone).toHaveClass('border-dashed');
  });
});
