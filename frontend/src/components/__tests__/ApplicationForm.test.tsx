import { render, screen, fireEvent } from '@testing-library/react';
import { ApplicationForm } from '../ApplicationForm';
import React from 'react';

describe('ApplicationForm', () => {
  it('renders correctly as a deposition station', () => {
    const onUpload = jest.fn();
    render(<ApplicationForm onUpload={onUpload} />);
    expect(screen.getByText(/DEPOSIT HISTORY/i)).toBeDefined();
    expect(screen.getByText(/DROP PDF HERE/i)).toBeDefined();
  });

  it('shows verifying state when isVerifying is true', () => {
    render(<ApplicationForm onUpload={jest.fn()} isVerifying={true} />);
    expect(screen.getByText(/Verifying Integrity/i)).toBeDefined();
  });

  it('calls onUpload when a file is chosen from the file picker', () => {
    const onUpload = jest.fn();
    const { container } = render(<ApplicationForm onUpload={onUpload} />);
    const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it('handles drag and drop uploads and shows the verified state', () => {
    const onUpload = jest.fn();
    const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });

    render(<ApplicationForm onUpload={onUpload} acceptedFormats={['.pdf']} />);

    const dropZone = screen.getByRole('region', { name: /Document Deposition/i });
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

    expect(onUpload).toHaveBeenCalledWith(file);
    expect(screen.getByText('VERIFIED')).toBeInTheDocument();
    expect(screen.queryByText(/Accepted: .pdf/i)).not.toBeInTheDocument();
  });
});
