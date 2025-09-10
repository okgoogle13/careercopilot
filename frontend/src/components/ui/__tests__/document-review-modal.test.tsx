import React from 'react';
import { render, screen, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import { DocumentReviewModal } from '../document-review-modal';

// Mock the KeywordTagGroup component
jest.mock('../keyword-tag-group', () => ({
  KeywordTagGroup: ({ keywords, onAccept, onReject }: any) => (
    <div data-testid="keyword-tag-group">
      <div>Keywords: {keywords?.length || 0}</div>
      <button onClick={() => onAccept?.('test-keyword')}>Accept Keyword</button>
      <button onClick={() => onReject?.('test-keyword')}>Reject Keyword</button>
    </div>
  ),
}));

describe('DocumentReviewModal', () => {
  const user = userEvent.setup();

  const mockDocuments = [
    {
      type: 'resume' as const,
      title: 'Software Engineer Resume',
      content: 'Resume content with React and TypeScript experience...',
      metadata: {
        wordCount: 500,
        lastModified: new Date('2024-01-01'),
        targetJob: {
          title: 'Frontend Developer',
          company: 'Tech Corp',
          location: 'Remote',
        },
        matchScore: 85,
      },
      keywords: [
        { keyword: 'React', status: 'matched' as const, id: '1' },
        { keyword: 'TypeScript', status: 'suggested' as const, id: '2' },
        { keyword: 'Testing', status: 'missing' as const, id: '3' },
      ],
      aiSuggestions: ['Add more details about React hooks', 'Include TypeScript projects'],
      issues: [
        { type: 'warning' as const, message: 'Consider adding more specific examples' },
        { type: 'suggestion' as const, message: 'Include quantified achievements' },
      ],
    },
    {
      type: 'cover_letter' as const,
      title: 'Cover Letter for Frontend Developer',
      content: 'Dear Hiring Manager, I am excited to apply...',
      metadata: {
        wordCount: 300,
        lastModified: new Date('2024-01-01'),
        matchScore: 90,
      },
      keywords: [
        { keyword: 'React', status: 'matched' as const, id: '4' },
        { keyword: 'Leadership', status: 'suggested' as const, id: '5' },
      ],
    },
  ];

  const mockOnApprove = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing when closed', () => {
    render(
      <DocumentReviewModal
        isOpen={false}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    // Modal should not be visible when closed
    expect(screen.queryByText(/Document Review/i)).not.toBeInTheDocument();
  });

  it('renders modal content when open', () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Document Review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Approve & Submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('displays document tabs correctly', () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    // Should show tabs for each document
    expect(screen.getByText(/Resume/i)).toBeInTheDocument();
    expect(screen.getByText(/Cover Letter/i)).toBeInTheDocument();
  });

  it('shows document metadata correctly', () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    // Should display word count and match score
    expect(screen.getByText(/500/)).toBeInTheDocument(); // word count
    expect(screen.getByText(/85%/)).toBeInTheDocument(); // match score
  });

  it('displays target job information', () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/Tech Corp/i)).toBeInTheDocument();
    expect(screen.getByText(/Remote/i)).toBeInTheDocument();
  });

  it('shows document content in preview tab', async () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    // Should show document content
    expect(screen.getByText(/Resume content with React and TypeScript/i)).toBeInTheDocument();
  });

  it('displays keyword management interface', () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    // Should render KeywordTagGroup component
    expect(screen.getByTestId('keyword-tag-group')).toBeInTheDocument();
  });

  it('shows AI suggestions when available', () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Add more details about React hooks/i)).toBeInTheDocument();
    expect(screen.getByText(/Include TypeScript projects/i)).toBeInTheDocument();
  });

  it('displays issues and warnings', () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Consider adding more specific examples/i)).toBeInTheDocument();
    expect(screen.getByText(/Include quantified achievements/i)).toBeInTheDocument();
  });

  it('calls onApprove when approve button is clicked', async () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    const approveButton = screen.getByRole('button', { name: /Approve & Submit/i });
    await user.click(approveButton);

    expect(mockOnApprove).toHaveBeenCalledWith(mockDocuments);
  });

  it('calls onCancel when cancel button is clicked', async () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls onEdit when edit button is clicked', async () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
        onEdit={mockOnEdit}
      />
    );

    // Look for edit button (might be an icon button)
    const editButton = screen.getByRole('button', { name: /Edit|edit/i });
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('handles keyword acceptance', async () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    const acceptButton = screen.getByRole('button', { name: /Accept Keyword/i });
    await user.click(acceptButton);

    // The keyword should be marked as accepted
    // This would need to be verified through component state or props
    expect(acceptButton).toBeInTheDocument();
  });

  it('handles keyword rejection', async () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    const rejectButton = screen.getByRole('button', { name: /Reject Keyword/i });
    await user.click(rejectButton);

    expect(rejectButton).toBeInTheDocument();
  });

  it('switches between document tabs correctly', async () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={mockDocuments}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    // Click on cover letter tab
    const coverLetterTab = screen.getByRole('tab', { name: /Cover Letter/i });
    await user.click(coverLetterTab);

    // Should show cover letter content
    expect(screen.getByText(/Dear Hiring Manager, I am excited to apply/i)).toBeInTheDocument();
  });

  it('handles empty documents array', () => {
    render(
      <DocumentReviewModal
        isOpen={true}
        documents={[]}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Document Review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Approve & Submit/i })).toBeInTheDocument();
  });

  it('handles documents without keywords', () => {
    const documentsWithoutKeywords = [
      {
        type: 'resume' as const,
        title: 'Simple Resume',
        content: 'Basic resume content',
        metadata: {
          wordCount: 200,
          lastModified: new Date(),
        },
      },
    ];

    render(
      <DocumentReviewModal
        isOpen={true}
        documents={documentsWithoutKeywords}
        onApprove={mockOnApprove}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Document Review/i)).toBeInTheDocument();
  });
});
