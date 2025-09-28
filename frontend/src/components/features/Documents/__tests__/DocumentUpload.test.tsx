import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentUpload } from '../DocumentUpload';
import { NotificationProvider } from '../../../contexts/NotificationContext';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock the file upload service
jest.mock('../../../services/documentService', () => ({
  uploadDocument: jest.fn().mockImplementation((file, onProgress) => {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      onProgress && onProgress(50);
    }, 100);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(progressInterval);
        resolve({ id: 'doc123', name: file.name, type: file.type });
      }, 300);
    });
  }),
}));

// Mock the auth context
const mockAuthContext = {
  currentUser: { uid: 'user123' },
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider value={mockAuthContext}>
      <NotificationProvider>
        {ui}
      </NotificationProvider>
    </AuthProvider>
  );
};

describe('DocumentUpload', () => {
  const originalCreateObjectURL = window.URL.createObjectURL;
  const originalRevokeObjectURL = window.URL.revokeObjectURL;
  
  beforeAll(() => {
    // Mock createObjectURL and revokeObjectURL
    window.URL.createObjectURL = jest.fn();
    window.URL.revokeObjectURL = jest.fn();
    
    // Mock FileReader
    global.FileReader = class MockFileReader {
      result: string | ArrayBuffer | null = null;
      onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
      onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
      
      readAsDataURL() {
        this.result = 'data:image/png;base64,mock';
        if (this.onload) {
          this.onload(new ProgressEvent('load'));
        }
      }
      
      readAsText() {
        this.result = 'mock file content';
        if (this.onload) {
          this.onload(new ProgressEvent('load'));
        }
      }
    } as any;
  });
  
  afterAll(() => {
    // Restore original implementations
    window.URL.createObjectURL = originalCreateObjectURL;
    window.URL.revokeObjectURL = originalRevokeObjectURL;
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the upload area', () => {
    renderWithProviders(<DocumentUpload onUploadComplete={jest.fn()} />);
    
    expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /browse files/i })).toBeInTheDocument();
  });
  
  it('accepts file via drag and drop', async () => {
    const onUploadComplete = jest.fn();
    renderWithProviders(<DocumentUpload onUploadComplete={onUploadComplete} />);
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const dropZone = screen.getByTestId('drop-zone');
    
    fireEvent.dragEnter(dropZone);
    fireEvent.dragOver(dropZone, { 
      dataTransfer: { 
        files: [file],
        types: ['Files']
      } 
    });
    
    // Should show drop indicator
    expect(dropZone).toHaveClass('drag-active');
    
    fireEvent.drop(dropZone, { 
      dataTransfer: { 
        files: [file],
        types: ['Files']
      } 
    });
    
    // Should show upload progress
    expect(await screen.findByText(/uploading/i)).toBeInTheDocument();
    expect(await screen.findByText(/50%/i)).toBeInTheDocument();
    
    // Wait for upload to complete
    await waitFor(() => {
      expect(onUploadComplete).toHaveBeenCalledWith(expect.objectContaining({
        id: 'doc123',
        name: 'test.pdf',
        type: 'application/pdf'
      }));
    });
  });
  
  it('validates file types', async () => {
    renderWithProviders(<DocumentUpload onUploadComplete={jest.fn()} />);
    
    const invalidFile = new File(['test'], 'test.exe', { type: 'application/octet-stream' });
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(input, invalidFile);
    });
    
    // Should show error message
    expect(await screen.findByText(/invalid file type/i)).toBeInTheDocument();
  });
  
  it('validates file size', async () => {
    // Create a large file (11MB)
    const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.pdf', { 
      type: 'application/pdf' 
    });
    
    renderWithProviders(<DocumentUpload 
      onUploadComplete={jest.fn()} 
      maxSize={10 * 1024 * 1024} // 10MB limit
    />);
    
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(input, largeFile);
    });
    
    // Should show error message
    expect(await screen.findByText(/file is too large/i)).toBeInTheDocument();
  });
  
  it('shows preview for images', async () => {
    const imageFile = new File(['test'], 'test.png', { type: 'image/png' });
    renderWithProviders(<DocumentUpload onUploadComplete={jest.fn()} />);
    
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(input, imageFile);
    });
    
    // Should show image preview
    expect(await screen.findByAltText(/preview/i)).toBeInTheDocument();
  });
  
  it('handles upload errors', async () => {
    // Mock a failed upload
    const errorMessage = 'Upload failed';
    require('../../../services/documentService').uploadDocument.mockRejectedValueOnce(
      new Error(errorMessage)
    );
    
    renderWithProviders(<DocumentUpload onUploadComplete={jest.fn()} />);
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(input, file);
    });
    
    // Should show error message
    expect(await screen.findByText(/upload failed/i)).toBeInTheDocument();
    
    // Should show retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    
    // Test retry functionality
    require('../../../services/documentService').uploadDocument.mockResolvedValueOnce({
      id: 'doc123',
      name: 'test.pdf',
      type: 'application/pdf'
    });
    
    await act(async () => {
      await userEvent.click(retryButton);
    });
    
    // Should start uploading again
    expect(await screen.findByText(/uploading/i)).toBeInTheDocument();
  });
  
  it('supports keyboard navigation', async () => {
    renderWithProviders(<DocumentUpload onUploadComplete={jest.fn()} />);
    
    const dropZone = screen.getByTestId('drop-zone');
    
    // Test tab navigation
    await userEvent.tab();
    expect(dropZone).toHaveFocus();
    
    // Test keyboard interaction
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    
    fireEvent.keyDown(dropZone, { key: 'Enter', code: 'Enter' });
    fireEvent.keyUp(dropZone, { key: 'Enter', code: 'Enter' });
    
    // Should trigger file input click
    const input = screen.getByTestId('file-input');
    expect(input).toHaveFocus();
    
    // Test file selection
    await act(async () => {
      await userEvent.upload(input, file);
    });
    
    // Should show upload progress
    expect(await screen.findByText(/uploading/i)).toBeInTheDocument();
  });
  
  it('cancels upload when component unmounts', async () => {
    const onUploadComplete = jest.fn();
    const { unmount } = renderWithProviders(
      <DocumentUpload onUploadComplete={onUploadComplete} />
    );
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(input, file);
    });
    
    // Unmount before upload completes
    unmount();
    
    // Should not call onUploadComplete after unmount
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(onUploadComplete).not.toHaveBeenCalled();
  });
});
