import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';

// Mock framer-motion
(jest as any).unstable_mockModule('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock UI components - ResumeUploader uses Button from @careercopilot/ui
(jest as any).unstable_mockModule('@careercopilot/ui', () => ({
  Button: ({ children, onClick, disabled, variant }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

// Mock icons
(jest as any).unstable_mockModule('lucide-react', () => ({
  Upload: ({ className }: any) => (
    <div
      className={className}
      data-testid="upload-icon"
    />
  ),
  FileText: ({ className }: any) => (
    <div
      className={className}
      data-testid="file-icon"
    />
  ),
  CheckCircle2: ({ className }: any) => (
    <div
      className={className}
      data-testid="check-icon"
    />
  ),
  AlertCircle: ({ className }: any) => (
    <div
      className={className}
      data-testid="alert-icon"
    />
  ),
  Loader2: ({ className }: any) => (
    <div
      className={className}
      data-testid="loader-icon"
    />
  ),
}));

const mockUseAuth = jest.fn();
(jest as any).unstable_mockModule('@/context/AuthContext', () => ({
  useAuth: mockUseAuth,
  AuthProvider: ({ children }: any) => children,
}));

// Dynamic imports for ESM compatibility
const { default: ResumeUploader } = await import('../ResumeUploader');

describe('ResumeUploader', () => {
  const onUploadSuccess = jest.fn();
  const mockSession = { access_token: 'mock-token' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ session: mockSession });
    global.fetch = jest.fn();
  });

  it('renders idle state correctly', () => {
    render(<ResumeUploader onUploadSuccess={onUploadSuccess} />);
    expect(screen.getByText('Upload Your Resume')).toBeInTheDocument();
    expect(screen.getByText('Drag & Drop or Click to Upload')).toBeInTheDocument();
  });

  it('handles file selection from input', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);

    render(<ResumeUploader onUploadSuccess={onUploadSuccess} />);
    const file = new File(['%PDF-1.4'], 'resume.pdf', { type: 'application/pdf' });
    const input = document.getElementById('resume-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Analyzing Career DNA...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Analysis Complete!')).toBeInTheDocument();
    });

    expect(onUploadSuccess).toHaveBeenCalled();
  });

  it('handles validation error', async () => {
    render(<ResumeUploader onUploadSuccess={onUploadSuccess} />);
    const file = new File(['bad'], 'virus.exe', { type: 'application/x-msdownload' });
    const input = document.getElementById('resume-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText('Upload Failed')).toBeInTheDocument();
    expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument();
  });

  it('handles network error during upload', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<ResumeUploader onUploadSuccess={onUploadSuccess} />);
    const file = new File(['%PDF-1.4'], 'resume.pdf', { type: 'application/pdf' });
    const input = document.getElementById('resume-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Upload Failed')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('can reset to idle from success state', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response);

    render(<ResumeUploader onUploadSuccess={onUploadSuccess} />);
    const file = new File(['%PDF-1.4'], 'resume.pdf', { type: 'application/pdf' });
    const input = document.getElementById('resume-input') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Analysis Complete!')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Upload Another'));

    expect(screen.getByText('Upload Your Resume')).toBeInTheDocument();
  });
});
