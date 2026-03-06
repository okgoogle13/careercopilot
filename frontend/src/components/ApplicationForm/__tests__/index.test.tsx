import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({
      children,
      onDragOver,
      onDragLeave,
      onDrop,
      className,
      animate: _animate,
      ...props
    }: any) => (
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={className}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const { ApplicationForm } = await import('../index');

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
    const dropzone = screen.getAllByTestId('motion-div')[0];

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
    const dropzone = screen.getAllByTestId('motion-div')[0];

    fireEvent.dragOver(dropzone);
    // Visual check handled by framer-motion props in real UI,
    // here we just ensure events don't crash and are bound.
    fireEvent.dragLeave(dropzone);
  });
});
