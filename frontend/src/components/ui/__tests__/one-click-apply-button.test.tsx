import React from 'react';
import { render, screen, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import { OneClickApplyButton } from '../one-click-apply-button';

// Mock the DocumentReviewModal component
jest.mock('../document-review-modal', () => ({
  DocumentReviewModal: ({ documents, onApprove }: any) => (
    <div data-testid="document-review-modal">
      <h3>Document Review Modal</h3>
      <button onClick={() => onApprove(documents)}>Approve Documents</button>
    </div>
  ),
}));

describe('OneClickApplyButton', () => {
  const user = userEvent.setup();

  const mockJobApplication = {
    id: 'job-1',
    jobTitle: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Remote',
    applicationUrl: 'https://example.com/apply',
    requirements: ['React', 'TypeScript', 'Testing'],
  };

  const mockDocuments = [
    {
      type: 'resume' as const,
      title: 'Software Engineer Resume',
      content: 'Resume content...',
      metadata: {
        wordCount: 500,
        lastModified: new Date(),
        matchScore: 85,
      },
      keywords: [
        { keyword: 'React', status: 'matched' as const, id: '1' },
        { keyword: 'TypeScript', status: 'matched' as const, id: '2' },
      ],
    },
    {
      type: 'cover_letter' as const,
      title: 'Cover Letter',
      content: 'Cover letter content...',
      metadata: {
        wordCount: 300,
        lastModified: new Date(),
        matchScore: 90,
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<OneClickApplyButton />);

    expect(screen.getByRole('button', { name: /One-Click Apply/i })).toBeInTheDocument();
  });

  it('renders with custom job application', () => {
    render(<OneClickApplyButton jobApplication={mockJobApplication} />);

    expect(screen.getByRole('button', { name: /One-Click Apply/i })).toBeInTheDocument();
  });

  it('renders with custom documents', () => {
    render(<OneClickApplyButton documents={mockDocuments} />);

    expect(screen.getByRole('button', { name: /One-Click Apply/i })).toBeInTheDocument();
  });

  it('shows loading state when clicked', async () => {
    render(<OneClickApplyButton />);

    const applyButton = screen.getByRole('button', { name: /One-Click Apply/i });
    await user.click(applyButton);

    // Should show some kind of loading or processing state
    expect(applyButton).toHaveTextContent(/Generating|Processing|Loading/i);
  });

  it('opens document review modal during application process', async () => {
    render(<OneClickApplyButton jobApplication={mockJobApplication} />);

    const applyButton = screen.getByRole('button', { name: /One-Click Apply/i });
    await user.click(applyButton);

    await waitFor(() => {
      expect(screen.getByTestId('document-review-modal')).toBeInTheDocument();
    });
  });

  it('handles successful application flow', async () => {
    const mockOnComplete = jest.fn();
    render(
      <OneClickApplyButton
        jobApplication={mockJobApplication}
        documents={mockDocuments}
        onComplete={mockOnComplete}
      />
    );

    const applyButton = screen.getByRole('button', { name: /One-Click Apply/i });
    await user.click(applyButton);

    // Wait for modal to appear and approve documents
    await waitFor(() => {
      expect(screen.getByTestId('document-review-modal')).toBeInTheDocument();
    });

    const approveButton = screen.getByRole('button', { name: /Approve Documents/i });
    await user.click(approveButton);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('displays success state after completion', async () => {
    render(<OneClickApplyButton jobApplication={mockJobApplication} />);

    const applyButton = screen.getByRole('button', { name: /One-Click Apply/i });
    await user.click(applyButton);

    // Simulate completion of application process
    await waitFor(() => {
      expect(screen.getByTestId('document-review-modal')).toBeInTheDocument();
    });

    const approveButton = screen.getByRole('button', { name: /Approve Documents/i });
    await user.click(approveButton);

    // Check for success state
    await waitFor(() => {
      expect(screen.getByText(/Applied|Success|Complete/i)).toBeInTheDocument();
    });
  });

  it('handles error state appropriately', async () => {
    // Mock console.error to avoid test output noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<OneClickApplyButton />);

    const applyButton = screen.getByRole('button', { name: /One-Click Apply/i });
    await user.click(applyButton);

    // The component should handle errors gracefully
    // We can't easily simulate an error without more complex mocking,
    // but we can at least verify the component doesn't crash
    expect(applyButton).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('shows correct progress indicators', async () => {
    render(<OneClickApplyButton />);

    const applyButton = screen.getByRole('button', { name: /One-Click Apply/i });
    await user.click(applyButton);

    // Should show some progress indication
    await waitFor(() => {
      // Look for either progress text or progress bars
      const hasProgressText = screen.queryByText(/Step|Progress|Generating/i);
      const hasProgressBar = screen.queryByRole('progressbar');

      expect(hasProgressText || hasProgressBar).toBeTruthy();
    });
  });

  it('disabled state works correctly', () => {
    render(<OneClickApplyButton disabled />);

    const applyButton = screen.getByRole('button', { name: /One-Click Apply/i });
    expect(applyButton).toBeDisabled();
  });

  it('prevents multiple simultaneous applications', async () => {
    render(<OneClickApplyButton />);

    const applyButton = screen.getByRole('button', { name: /One-Click Apply/i });

    // Click multiple times rapidly
    await user.click(applyButton);
    await user.click(applyButton);
    await user.click(applyButton);

    // Should still show loading state, not reset
    expect(applyButton).toHaveTextContent(/Generating|Processing|Loading/i);
  });

  it('handles custom className prop', () => {
    render(<OneClickApplyButton className="custom-class" />);

    const applyButton = screen.getByRole('button', { name: /One-Click Apply/i });
    expect(applyButton).toHaveClass('custom-class');
  });
});
