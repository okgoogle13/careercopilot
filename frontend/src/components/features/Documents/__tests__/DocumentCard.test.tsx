import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocumentCard } from '../DocumentCard';
import { formatRelativeTime, formatDate } from '../DocumentCard';

// Mock the MUI icons
vi.mock('@mui/icons-material', async () => {
  const actual = await vi.importActual('@mui/icons-material');
  return {
    ...actual,
    Description: () => <div data-testid="description-icon" />,
    Edit: () => <div data-testid="edit-icon" />,
    MoreHoriz: () => <div data-testid="more-icon" />,
    Visibility: () => <div data-testid="visibility-icon" />,
    Download: () => <div data-testid="download-icon" />,
    Share: () => <div data-testid="share-icon" />,
    ContentCopy: () => <div data-testid="copy-icon" />,
    Delete: () => <div data-testid="delete-icon" />,
    AccessTime: () => <div data-testid="time-icon" />,
    CheckCircle: () => <div data-testid="check-icon" />,
    Error: () => <div data-testid="error-icon" />,
  };
});

describe('DocumentCard', () => {
  const mockDocument = {
    id: 'doc-123',
    title: 'Senior Developer Resume',
    type: 'resume',
    status: 'completed',
    version: '2.1',
    lastModified: '2023-10-01T10:30:00Z',
    createdDate: '2023-09-15T14:20:00Z',
    fileSize: '2.4 MB',
    pageCount: 2,
    thumbnail: 'https://example.com/thumbnail.jpg',
    tags: ['React', 'TypeScript', 'Node.js'],
    atsScore: 85,
    metrics: {
      views: 24,
      downloads: 5,
      applications: 3,
    },
    template: 'Professional',
    aiGenerated: true,
  };

  const mockCallbacks = {
    onSelect: vi.fn(),
    onEdit: vi.fn(),
    onView: vi.fn(),
    onDownload: vi.fn(),
    onShare: vi.fn(),
    onDuplicate: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the default variant correctly', () => {
    render(<DocumentCard document={mockDocument} {...mockCallbacks} />);
    
    // Check if the document title is rendered
    expect(screen.getByText('Senior Developer Resume')).toBeInTheDocument();
    
    // Check if the status chip is rendered
    expect(screen.getByText('completed')).toBeInTheDocument();
    
    // Check if the version is displayed
    expect(screen.getByText('v2.1')).toBeInTheDocument();
    
    // Check if the document type and creation date are shown
    expect(screen.getByText(/RESUME • Created/)).toBeInTheDocument();
    
    // Check if the ATS score is displayed
    expect(screen.getByText('85%')).toBeInTheDocument();
    
    // Check if the tags are displayed
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    
    // Check if the metrics are displayed
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders the compact variant correctly', () => {
    render(<DocumentCard document={mockDocument} variant="compact" {...mockCallbacks} />);
    
    // In compact mode, we should see the document title and status
    expect(screen.getByText('Senior Developer Resume')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
    
    // Check if the ATS score is displayed in compact mode
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('calls onView when the view button is clicked', () => {
    render(<DocumentCard document={mockDocument} {...mockCallbacks} />);
    
    const viewButton = screen.getByRole('button', { name: /view/i });
    fireEvent.click(viewButton);
    
    expect(mockCallbacks.onView).toHaveBeenCalledWith('doc-123');
  });

  it('calls onEdit when the edit button is clicked', () => {
    render(<DocumentCard document={mockDocument} {...mockCallbacks} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    expect(mockCallbacks.onEdit).toHaveBeenCalledWith('doc-123');
  });

  it('shows the actions menu when the more button is clicked', () => {
    render(<DocumentCard document={mockDocument} {...mockCallbacks} />);
    
    // The menu button should be present
    const moreButton = screen.getByTestId('more-icon').closest('button');
    expect(moreButton).toBeInTheDocument();
    
    // Click the more button to open the menu
    fireEvent.click(moreButton!);
    
    // Check if menu items are present
    expect(screen.getByText(/view/i)).toBeInTheDocument();
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/download/i)).toBeInTheDocument();
    expect(screen.getByText(/share/i)).toBeInTheDocument();
    expect(screen.getByText(/duplicate/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  it('calls the correct callback when a menu item is clicked', () => {
    render(<DocumentCard document={mockDocument} {...mockCallbacks} />);
    
    // Open the menu
    const moreButton = screen.getByTestId('more-icon').closest('button');
    fireEvent.click(moreButton!);
    
    // Test download action
    fireEvent.click(screen.getByText(/download/i));
    expect(mockCallbacks.onDownload).toHaveBeenCalledWith('doc-123');
    
    // Test share action
    fireEvent.click(screen.getByText(/share/i));
    expect(mockCallbacks.onShare).toHaveBeenCalledWith('doc-123');
    
    // Test duplicate action
    fireEvent.click(screen.getByText(/duplicate/i));
    expect(mockCallbacks.onDuplicate).toHaveBeenCalledWith('doc-123');
    
    // Test delete action
    fireEvent.click(screen.getByText(/delete/i));
    expect(mockCallbacks.onDelete).toHaveBeenCalledWith('doc-123');
  });

  it('applies the correct status colors', () => {
    const { rerender } = render(
      <DocumentCard document={{ ...mockDocument, status: 'draft' }} />
    );
    
    // Check draft status
    const draftChip = screen.getByText('draft');
    expect(draftChip).toHaveStyle('background-color: rgba(146, 143, 153, 0.1)');
    
    // Test in-review status
    rerender(<DocumentCard document={{ ...mockDocument, status: 'in-review' }} />);
    const inReviewChip = screen.getByText('in review');
    expect(inReviewChip).toHaveStyle('background-color: rgba(253, 224, 71, 0.1)');
    
    // Test published status
    rerender(<DocumentCard document={{ ...mockDocument, status: 'published' }} />);
    const publishedChip = screen.getByText('published');
    expect(publishedChip).toHaveStyle('background-color: rgba(96, 165, 250, 0.1)');
  });

  it('formats dates correctly', () => {
    // Test formatRelativeTime
    const relativeTime = formatRelativeTime('2023-10-01T10:30:00Z');
    expect(relativeTime).toMatch(/\d+ days? ago|today/);
    
    // Test formatDate
    const formattedDate = formatDate('2023-09-15T14:20:00Z');
    expect(formattedDate).toMatch(/[A-Za-z]{3} \d{1,2}, \d{4}/);
  });

  it('handles missing optional fields gracefully', () => {
    const minimalDoc = {
      id: 'min-123',
      title: 'Minimal Document',
      type: 'cover-letter',
      status: 'draft',
      version: '1.0',
      lastModified: '2023-10-01T10:30:00Z',
      createdDate: '2023-10-01T10:30:00Z',
    };
    
    render(<DocumentCard document={minimalDoc} />);
    
    // Should still render without errors
    expect(screen.getByText('Minimal Document')).toBeInTheDocument();
    expect(screen.getByText('v1.0')).toBeInTheDocument();
  });

  it('shows AI generated badge when aiGenerated is true', () => {
    render(<DocumentCard document={{ ...mockDocument, aiGenerated: true }} />);
    expect(screen.getByText('AI Generated')).toBeInTheDocument();
  });

  it('does not show AI generated badge when aiGenerated is false', () => {
    render(<DocumentCard document={{ ...mockDocument, aiGenerated: false }} />);
    expect(screen.queryByText('AI Generated')).not.toBeInTheDocument();
  });
});
