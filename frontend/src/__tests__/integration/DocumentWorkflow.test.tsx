import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DocumentUpload } from '../../components/features/documents/DocumentUpload';
import { DocumentList } from '../../components/features/documents/DocumentList';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the document service
const mockDocuments = [
  { id: 'doc1', name: 'Resume.pdf', type: 'application/pdf', size: 1024, uploadedAt: new Date().toISOString() },
  { id: 'doc2', name: 'Cover-Letter.pdf', type: 'application/pdf', size: 2048, uploadedAt: new Date().toISOString() },
];

jest.mock('../../services/documentService', () => ({
  getDocuments: jest.fn().mockResolvedValue(mockDocuments),
  uploadDocument: jest.fn().mockImplementation((file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDoc = {
          id: `doc${Date.now()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };
        mockDocuments.push(newDoc);
        resolve(newDoc);
      }, 100);
    });
  }),
  deleteDocument: jest.fn().mockImplementation((id) => {
    const index = mockDocuments.findIndex(doc => doc.id === id);
    if (index > -1) {
      mockDocuments.splice(index, 1);
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new Error('Document not found'));
  })
}));

// Mock the auth context
const mockAuthContext = {
  currentUser: { uid: 'user123', email: 'test@example.com' },
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
};

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  window.history.pushState({}, 'Test page', route);

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider value={mockAuthContext}>
          <NotificationProvider>
            <MemoryRouter initialEntries={[route]}>
              <Routes>
                <Route path="/documents" element={ui} />
                <Route path="/documents/upload" element={<div>Upload Page</div>} />
              </Routes>
            </MemoryRouter>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    ),
    queryClient,
  };
};

describe('Document Workflow Integration', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('should display a list of documents', async () => {
    renderWithProviders(<DocumentList />, { route: '/documents' });
    
    // Wait for documents to load
    expect(await screen.findByText('Resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('Cover-Letter.pdf')).toBeInTheDocument();
    
    // Verify document details
    expect(screen.getByText('1 KB')).toBeInTheDocument();
    expect(screen.getByText('2 KB')).toBeInTheDocument();
  });

  it('should upload a new document and update the list', async () => {
    const { queryClient } = renderWithProviders(
      <>
        <DocumentList />
        <DocumentUpload onUploadComplete={jest.fn()} />
      </>,
      { route: '/documents' }
    );

    // Wait for initial documents to load
    await screen.findByText('Resume.pdf');

    // Simulate file upload
    const file = new File(['test content'], 'New-Document.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(input, file);
    });

    // Wait for upload to complete
    await waitFor(() => {
      expect(screen.getByText('New-Document.pdf')).toBeInTheDocument();
    });

    // Verify the document was added to the list
    const documents = screen.getAllByRole('row');
    expect(documents).toHaveLength(4); // Header + 3 documents
  });

  it('should show a notification when upload fails', async () => {
    // Mock a failed upload
    const errorMessage = 'Network error';
    require('../../services/documentService').uploadDocument.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    renderWithProviders(
      <>
        <DocumentList />
        <DocumentUpload onUploadComplete={jest.fn()} />
      </>,
      { route: '/documents' }
    );

    // Wait for initial documents to load
    await screen.findByText('Resume.pdf');

    // Simulate file upload
    const file = new File(['test'], 'Error-Document.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(input, file);
    });

    // Verify error notification is shown
    expect(await screen.findByText(/upload failed/i)).toBeInTheDocument();
    expect(screen.queryByText('Error-Document.pdf')).not.toBeInTheDocument();
  });

  it('should delete a document and update the list', async () => {
    renderWithProviders(<DocumentList />, { route: '/documents' });
    
    // Wait for documents to load
    await screen.findByText('Resume.pdf');
    
    // Find and click the delete button for the first document
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await act(async () => {
      await userEvent.click(confirmButton);
    });
    
    // Verify document was removed
    await waitFor(() => {
      expect(screen.queryByText('Resume.pdf')).not.toBeInTheDocument();
    });
    
    // Verify success notification
    expect(await screen.findByText(/document deleted/i)).toBeInTheDocument();
  });

  it('should navigate to upload page and return to list', async () => {
    renderWithProviders(<DocumentList />, { route: '/documents' });
    
    // Click upload button
    const uploadButton = screen.getByRole('button', { name: /upload document/i });
    fireEvent.click(uploadButton);
    
    // Verify navigation to upload page
    expect(await screen.findByText('Upload Page')).toBeInTheDocument();
    
    // Simulate going back to document list
    window.history.back();
    
    // Verify document list is displayed
    expect(await screen.findByText('Resume.pdf')).toBeInTheDocument();
  });

  it('should handle concurrent uploads', async () => {
    // Mock slow uploads
    require('../../services/documentService').uploadDocument.mockImplementation(
      (file: File) => new Promise((resolve) => {
        setTimeout(() => {
          const newDoc = {
            id: `doc${Date.now()}`,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString()
          };
          mockDocuments.push(newDoc);
          resolve(newDoc);
        }, 500);
      })
    );

    renderWithProviders(
      <>
        <DocumentList />
        <DocumentUpload onUploadComplete={jest.fn()} />
      </>,
      { route: '/documents' }
    );

    // Wait for initial documents to load
    await screen.findByText('Resume.pdf');

    // Upload multiple files
    const file1 = new File(['doc1'], 'Document-1.pdf', { type: 'application/pdf' });
    const file2 = new File(['doc2'], 'Document-2.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      await userEvent.upload(input, [file1, file2]);
    });

    // Verify both uploads are in progress
    const uploads = await screen.findAllByText(/uploading/i);
    expect(uploads).toHaveLength(2);

    // Wait for uploads to complete
    await waitFor(() => {
      expect(screen.getByText('Document-1.pdf')).toBeInTheDocument();
      expect(screen.getByText('Document-2.pdf')).toBeInTheDocument();
    });
  });
});
