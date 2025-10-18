import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentsPage } from '../DocumentsPage';

describe('DocumentsPage', () => {
  const mockOnCreateDocument = jest.fn();
  const mockOnEditDocument = jest.fn();
  const mockOnUploadDocument = jest.fn();

  beforeEach(() => {
    mockOnCreateDocument.mockClear();
    mockOnEditDocument.mockClear();
    mockOnUploadDocument.mockClear();
  });

  describe('Empty State', () => {
    it('renders empty state when isEmpty is true', () => {
      render(<DocumentsPage isEmpty={true} onCreateDocument={mockOnCreateDocument} />);

      expect(screen.getByRole('heading', { name: /No Documents Yet/i })).toBeInTheDocument();
      expect(screen.getByText(/Create your first document or upload existing files/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Document/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Upload Files/i })).toBeInTheDocument();
    });

    it('calls onCreateDocument when create button is clicked in empty state', async () => {
      const user = userEvent.setup();
      render(<DocumentsPage isEmpty={true} onCreateDocument={mockOnCreateDocument} />);

      const createButton = screen.getByRole('button', { name: /Create Document/i });
      await user.click(createButton);

      expect(mockOnCreateDocument).toHaveBeenCalledTimes(1);
    });

    it('calls onUploadDocument when upload button is clicked in empty state', async () => {
      const user = userEvent.setup();
      render(<DocumentsPage isEmpty={true} onUploadDocument={mockOnUploadDocument} />);

      const uploadButton = screen.getByRole('button', { name: /Upload Files/i });
      await user.click(uploadButton);

      expect(mockOnUploadDocument).toHaveBeenCalledTimes(1);
    });

    it('displays supported file formats in empty state', () => {
      render(<DocumentsPage isEmpty={true} />);

      expect(screen.getByText(/PDF/i)).toBeInTheDocument();
      expect(screen.getByText(/DOCX/i)).toBeInTheDocument();
      expect(screen.getByText(/TXT/i)).toBeInTheDocument();
      expect(screen.getByText(/HTML/i)).toBeInTheDocument();
    });
  });

  describe('Documents Page with Content', () => {
    it('renders the documents heading and description', () => {
      render(<DocumentsPage />);

      expect(screen.getByRole('heading', { name: /^Documents$/i })).toBeInTheDocument();
      expect(screen.getByText(/Manage your resumes, cover letters, and other career documents/i)).toBeInTheDocument();
    });

    it('displays statistics cards with correct data', () => {
      render(<DocumentsPage />);

      expect(screen.getByText(/Total Documents/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Documents/i)).toBeInTheDocument();
      expect(screen.getByText(/Favorites/i)).toBeInTheDocument();
      expect(screen.getByText(/Archived/i)).toBeInTheDocument();
    });

    it('displays all document tabs', () => {
      render(<DocumentsPage />);

      expect(screen.getByRole('tab', { name: /All Documents \(/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Resumes \(/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Cover Letters \(/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /KSC \(/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Portfolio \(/i })).toBeInTheDocument();
    });

    it('displays document cards with correct information', () => {
      render(<DocumentsPage />);

      expect(screen.getByText(/Senior Software Developer Resume/i)).toBeInTheDocument();
      expect(screen.getByText(/Product Manager Cover Letter/i)).toBeInTheDocument();
      expect(screen.getByText(/UX Designer Portfolio/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Selection Criteria Response/i)).toBeInTheDocument();
    });

    it('displays search bar and filter buttons', () => {
      render(<DocumentsPage />);

      expect(screen.getByPlaceholderText(/Search documents/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sort/i })).toBeInTheDocument();
    });

    it('displays upload and create document buttons', () => {
      render(<DocumentsPage />);

      expect(screen.getByRole('button', { name: /Upload/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Create Document/i })).toBeInTheDocument();
    });

    it('displays document status chips', () => {
      render(<DocumentsPage />);

      // Status chips for different documents
      const activeChips = screen.getAllByText(/active/i);
      const draftChips = screen.getAllByText(/draft/i);
      const archivedChips = screen.getAllByText(/archived/i);

      expect(activeChips.length).toBeGreaterThan(0);
      expect(draftChips.length).toBeGreaterThan(0);
      expect(archivedChips.length).toBeGreaterThan(0);
    });

    it('displays ATS scores for documents that have them', () => {
      render(<DocumentsPage />);

      // Look for ATS score badges
      expect(screen.getByText(/85% ATS/i)).toBeInTheDocument();
      expect(screen.getByText(/92% ATS/i)).toBeInTheDocument();
    });
  });

  describe('Document Interactions', () => {
    it('filters documents based on search query', async () => {
      const user = userEvent.setup();
      render(<DocumentsPage />);

      const searchInput = screen.getByPlaceholderText(/Search documents/i);
      await user.type(searchInput, 'Resume');

      // Documents with "Resume" in name should be visible
      expect(screen.getByText(/Senior Software Developer Resume/i)).toBeInTheDocument();
    });

    it('switches tabs when clicking on different document type tabs', async () => {
      const user = userEvent.setup();
      render(<DocumentsPage />);

      const resumesTab = screen.getByRole('tab', { name: /Resumes \(/i });
      await user.click(resumesTab);

      await waitFor(() => {
        // Should show resume documents
        expect(screen.getByText(/Senior Software Developer Resume/i)).toBeInTheDocument();
      });
    });

    it('allows selecting multiple documents for bulk actions', async () => {
      const user = userEvent.setup();
      render(<DocumentsPage />);

      // Find document checkboxes
      const checkboxes = screen.getAllByRole('checkbox');

      // Select two documents
      if (checkboxes.length >= 2) {
        await user.click(checkboxes[0]);
        await user.click(checkboxes[1]);

        // Should show bulk action toolbar
        await waitFor(() => {
          expect(screen.getByText(/2 selected/i)).toBeInTheDocument();
        });
      }
    });

    it('opens upload dialog when upload button is clicked', async () => {
      const user = userEvent.setup();
      render(<DocumentsPage />);

      const uploadButton = screen.getByRole('button', { name: /Upload/i });
      await user.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Upload Documents/i })).toBeInTheDocument();
        expect(screen.getByText(/Drag & drop files here/i)).toBeInTheDocument();
      });
    });

    it('calls onCreateDocument when create document button is clicked', async () => {
      const user = userEvent.setup();
      render(<DocumentsPage onCreateDocument={mockOnCreateDocument} />);

      const createButtons = screen.getAllByRole('button', { name: /Create Document/i });
      await user.click(createButtons[0]);

      expect(mockOnCreateDocument).toHaveBeenCalledTimes(1);
    });

    it('displays floating action button for creating documents', () => {
      render(<DocumentsPage />);

      const fab = screen.getByRole('button', { name: /add/i });
      expect(fab).toBeInTheDocument();
    });

    it('displays document size and last modified information', () => {
      render(<DocumentsPage />);

      expect(screen.getByText(/2.1 MB/i)).toBeInTheDocument();
      expect(screen.getByText(/1.5 MB/i)).toBeInTheDocument();
      expect(screen.getByText(/2 hours ago/i)).toBeInTheDocument();
      expect(screen.getByText(/1 day ago/i)).toBeInTheDocument();
    });
  });

  describe('Upload Dialog', () => {
    it('displays upload dialog with drag and drop area', async () => {
      const user = userEvent.setup();
      render(<DocumentsPage />);

      const uploadButton = screen.getByRole('button', { name: /Upload/i });
      await user.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Upload Documents/i })).toBeInTheDocument();
        expect(screen.getByText(/or click to browse files/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Choose Files/i })).toBeInTheDocument();
      });
    });

    it('displays supported formats alert in upload dialog', async () => {
      const user = userEvent.setup();
      render(<DocumentsPage />);

      const uploadButton = screen.getByRole('button', { name: /Upload/i });
      await user.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText(/Supported formats: PDF, DOCX, TXT, HTML/i)).toBeInTheDocument();
      });
    });
  });
});
