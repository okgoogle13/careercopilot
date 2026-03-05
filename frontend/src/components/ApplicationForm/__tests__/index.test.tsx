import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ApplicationForm } from '../index';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onDragOver, onDragLeave, onDrop, className, animate }: any) => (
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={className}
        data-testid="motion-div"
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ApplicationForm', () => {
  const onUpload = jest.fn();

  beforeEach(() => {
    onUpload.mockClear();
  });

  it('renders correctly in initial state', () => {
    render(<ApplicationForm onUpload={onUpload} />);
    expect(screen.getByText('DEPOSIT HISTORY')).toBeInTheDocument();
    expect(screen.getByText('DROP PDF HERE FOR ANALYSIS')).toBeInTheDocument();
    expect(screen.getByText('CHOOSE FILE')).toBeInTheDocument();
  });

  it('calls onUpload when a file is selected via input', () => {
    render(<ApplicationForm onUpload={onUpload} />);
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const input = document.getElementById('file-upload') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it('calls onUpload and shows success when a file is dropped', () => {
    render(<ApplicationForm onUpload={onUpload} />);
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const dropzone = screen.getByRole('region', { name: 'Document Deposition' });

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(onUpload).toHaveBeenCalledWith(file);
    expect(screen.getByText('VERIFIED')).toBeInTheDocument();
  });

  it('shows verifying state when isVerifying is true', () => {
    render(
      <ApplicationForm
        onUpload={onUpload}
        isVerifying={true}
      />
    );
    expect(screen.getByText('Verifying Integrity...')).toBeInTheDocument();
  });

  it('displays custom accepted formats', () => {
    render(
      <ApplicationForm
        onUpload={onUpload}
        acceptedFormats={['.txt', '.md']}
      />
    );
    expect(screen.getByText('Accepted: .txt, .md')).toBeInTheDocument();
  });

  it('handles drag leave/over states', () => {
    render(<ApplicationForm onUpload={onUpload} />);
    const dropzone = screen.getByRole('region', { name: 'Document Deposition' });

    fireEvent.dragOver(dropzone);
    // Visual check handled by framer-motion props in real UI,
    // here we just ensure events don't crash and are bound.
    fireEvent.dragLeave(dropzone);
  });
});
