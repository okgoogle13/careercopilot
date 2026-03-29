import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock the ingestion service — component uses uploadAndTagFile (axios-based), not fetch directly
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUploadAndTagFile: jest.MockedFunction<(...args: any[]) => any> = jest.fn();
(jest as any).unstable_mockModule('@/api/ingestion.service', () => ({
  uploadAndTagFile: mockUploadAndTagFile,
}));

// Mock file validation — bypass JSDOM File.size=0 for valid files
(jest as any).unstable_mockModule('@/utils/fileValidation', () => ({
  validateFile: jest.fn((file: File) => {
    if (file.size === 0 && file.name !== 'evidence.pdf') {
      return { valid: false, error: `"${file.name}" is empty` };
    }
    // For empty.pdf test (explicit empty file), return invalid
    if (file.name === 'empty.pdf' && file.size === 0) {
      return { valid: false, error: `"${file.name}" is empty` };
    }
    return { valid: true };
  }),
  validateFiles: jest.fn(() => ({ valid: true })),
}));

// Mock UI barrel — component imports March, Placard, Strike from @/components/ui
(jest as any).unstable_mockModule('@/components/ui', () => ({
  Placard: ({ children, className }: any) => (
    <div
      className={className}
      data-testid="placard-container-mock"
    >
      {children}
    </div>
  ),
  Strike: ({ children, onClick, disabled, isLoading, variant, iconLeft }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
    >
      {iconLeft}
      {isLoading ? 'Synthesizing...' : children}
    </button>
  ),
  March: ({ value, onChange, options, label }: any) => (
    <div>
      <label htmlFor="march-select">{label}</label>
      <select
        id="march-select"
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

const mockToast = { success: jest.fn(), error: jest.fn() };
(jest as any).unstable_mockModule('@/utils/toast', () => ({
  m3Toast: mockToast,
}));

const { EvidenceUploader } = await import('../EvidenceUploader');
// Re-import the mocked modules to get typed references
const toastModule = (await import('@/utils/toast' as string)) as any;
const serviceModule = (await import('@/api/ingestion.service' as string)) as any;
const { m3Toast } = toastModule;
const { uploadAndTagFile } = serviceModule;

describe('EvidenceUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<EvidenceUploader />);
    expect(screen.getByText('Strategic Evidence Uploader')).toBeInTheDocument();
  });

  it('handles successful file upload', async () => {
    mockUploadAndTagFile.mockResolvedValue({});

    render(<EvidenceUploader />);
    const file = new File(['valid content'], 'evidence.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 100 });
    const input = document.getElementById('file-upload') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(uploadAndTagFile).toHaveBeenCalledWith(file, expect.any(Function), 'ksc_response');
    });

    expect((m3Toast as any).success).toHaveBeenCalledWith('Success', 'Ingested evidence.pdf');
  });

  it('handles failed file upload', async () => {
    mockUploadAndTagFile.mockRejectedValue(new Error('Server Error'));

    render(<EvidenceUploader />);
    const file = new File(['valid content'], 'evidence.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 100 });
    const input = document.getElementById('file-upload') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect((m3Toast as any).error).toHaveBeenCalledWith('Upload Failed', 'Server Error');
    });
  });

  it('blocks upload on validation failure (empty file)', async () => {
    render(<EvidenceUploader />);
    const file = new File([], 'empty.pdf', { type: 'application/pdf' });
    const input = document.getElementById('file-upload') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect((m3Toast as any).error).toHaveBeenCalledWith(
        'Invalid File',
        expect.stringContaining('is empty')
      );
    });
    expect(uploadAndTagFile).not.toHaveBeenCalled();
  });

  it('changes source type when March value changes', async () => {
    (uploadAndTagFile as jest.Mock).mockResolvedValue({});

    render(<EvidenceUploader />);
    const select = screen.getByLabelText('Knowledge Domain');
    fireEvent.change(select, { target: { value: 'resume' } });

    const file = new File(['valid content'], 'resume.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 100 });
    const input = document.getElementById('file-upload') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(uploadAndTagFile).toHaveBeenCalledWith(file, expect.any(Function), 'resume');
    });
  });
});
