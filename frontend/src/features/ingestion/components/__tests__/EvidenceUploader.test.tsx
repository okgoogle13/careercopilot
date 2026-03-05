import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';

// For ESM Jest, use unstable_mockModule for dependencies of the module we await import
(jest as any).unstable_mockModule('@/components/ui', () => ({
  Stone: ({ children, className }: any) => <div className={className}>{children}</div>,
  Pebble: ({ children, onClick, disabled, isLoading, variant, iconLeft }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
    >
      {iconLeft}
      {isLoading ? 'Synthesizing...' : children}
    </button>
  ),
  Jar: ({ value, onChange, options, label }: any) => (
    <div>
      <label htmlFor="jar-select">{label}</label>
      <select
        id="jar-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt: any) => (
          <option
            key={opt.value}
            value={opt.value}
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

(jest as any).unstable_mockModule('lucide-react', () => ({
  UploadCloud: () => <div data-testid="upload-icon" />,
  FileText: () => <div data-testid="file-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
}));

const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};
(jest as any).unstable_mockModule('@/utils/toast', () => ({
  m3Toast: mockToast,
}));

// Dynamic imports after all mocks are registered
const { EvidenceUploader } = await import('../EvidenceUploader');
const { m3Toast } = await import('@/utils/toast');

describe('EvidenceUploader', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('renders correctly', () => {
    render(<EvidenceUploader />);
    expect(screen.getByText('Strategic Evidence Uploader')).toBeInTheDocument();
  });

  it('handles successful file upload', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    render(<EvidenceUploader />);
    const file = new File(['valid content'], 'evidence.pdf', { type: 'application/pdf' });
    const input = document.getElementById('file-upload') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/ingest/artifacts/upload',
        expect.objectContaining({ method: 'POST' })
      );
    });

    expect(m3Toast.success).toHaveBeenCalledWith('Success', 'Ingested evidence.pdf');
  });

  it('handles failed file upload', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ detail: 'Server Error' }),
    } as Response);

    render(<EvidenceUploader />);
    const file = new File(['valid content'], 'evidence.pdf', { type: 'application/pdf' });
    const input = document.getElementById('file-upload') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(m3Toast.error).toHaveBeenCalledWith('Upload Failed', 'Server Error');
    });
  });

  it('blocks upload on validation failure (empty file)', () => {
    render(<EvidenceUploader />);
    const file = new File([], 'empty.pdf', { type: 'application/pdf' });
    const input = document.getElementById('file-upload') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(m3Toast.error).toHaveBeenCalledWith('Invalid File', expect.stringContaining('is empty'));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('changes source type when Jar value changes', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    } as Response);

    render(<EvidenceUploader />);
    // screen.getByLabelText should work now with my updated Jar mock
    const select = screen.getByLabelText('Knowledge Domain');
    fireEvent.change(select, { target: { value: 'resume' } });

    const file = new File(['valid content'], 'resume.pdf', { type: 'application/pdf' });
    const input = document.getElementById('file-upload') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      const call = (global.fetch as jest.Mock).mock.calls[0];
      const formData = call[1]!.body as FormData;
      expect(formData.get('source_type')).toBe('resume');
    });
  });
});
