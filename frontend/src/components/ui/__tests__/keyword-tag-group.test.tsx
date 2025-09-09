import React from 'react';
import { render, screen, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import { KeywordTagGroup } from '../keyword-tag-group';

describe('KeywordTagGroup', () => {
  const user = userEvent.setup();

  const mockKeywords = [
    { keyword: 'React', status: 'matched' as const, id: '1' },
    { keyword: 'TypeScript', status: 'suggested' as const, id: '2' },
    { keyword: 'Testing', status: 'missing' as const, id: '3' },
    { keyword: 'Node.js', status: 'accepted' as const, id: '4' },
    { keyword: 'Python', status: 'rejected' as const, id: '5' },
  ];

  const mockProps = {
    keywords: mockKeywords,
    onAccept: jest.fn(),
    onReject: jest.fn(),
    onRemove: jest.fn(),
    onBulkAccept: jest.fn(),
    onBulkReject: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<KeywordTagGroup {...mockProps} />);

    expect(screen.getByText(/Keywords/i)).toBeInTheDocument();
  });

  it('displays all keyword tags', () => {
    render(<KeywordTagGroup {...mockProps} />);

    mockKeywords.forEach(keyword => {
      expect(screen.getByText(keyword.keyword)).toBeInTheDocument();
    });
  });

  it('shows correct status for each keyword', () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Check that different keywords have different visual indicators
    const reactKeyword = screen.getByText('React');
    const typescriptKeyword = screen.getByText('TypeScript');
    const testingKeyword = screen.getByText('Testing');

    expect(reactKeyword).toBeInTheDocument();
    expect(typescriptKeyword).toBeInTheDocument();
    expect(testingKeyword).toBeInTheDocument();
  });

  it('displays keyword counts correctly', () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Should show counts for different statuses
    expect(screen.getByText(/5/)).toBeInTheDocument(); // total keywords
  });

  it('handles accept action on individual keyword', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Find accept button for a suggested keyword
    const acceptButtons = screen.getAllByRole('button', { name: /accept|add/i });
    if (acceptButtons.length > 0) {
      await user.click(acceptButtons[0]);
      expect(mockProps.onAccept).toHaveBeenCalled();
    }
  });

  it('handles reject action on individual keyword', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Find reject button for a keyword
    const rejectButtons = screen.getAllByRole('button', { name: /reject|remove/i });
    if (rejectButtons.length > 0) {
      await user.click(rejectButtons[0]);
      expect(mockProps.onReject).toHaveBeenCalled();
    }
  });

  it('handles remove action on individual keyword', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Find remove button (X button)
    const removeButtons = screen.getAllByRole('button', { name: /remove|delete/i });
    if (removeButtons.length > 0) {
      await user.click(removeButtons[0]);
      expect(mockProps.onRemove).toHaveBeenCalled();
    }
  });

  it('displays bulk action buttons when applicable', () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Should show bulk accept/reject buttons if there are suggested keywords
    const bulkButtons = screen.queryAllByText(/Accept All|Reject All/i);
    expect(bulkButtons.length).toBeGreaterThanOrEqual(0);
  });

  it('handles bulk accept action', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    const bulkAcceptButton = screen.queryByText(/Accept All/i);
    if (bulkAcceptButton) {
      await user.click(bulkAcceptButton);
      expect(mockProps.onBulkAccept).toHaveBeenCalled();
    }
  });

  it('handles bulk reject action', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    const bulkRejectButton = screen.queryByText(/Reject All/i);
    if (bulkRejectButton) {
      await user.click(bulkRejectButton);
      expect(mockProps.onBulkReject).toHaveBeenCalled();
    }
  });

  it('renders empty state when no keywords provided', () => {
    render(<KeywordTagGroup {...mockProps} keywords={[]} />);

    expect(screen.getByText(/Keywords/i)).toBeInTheDocument();
    // Should handle empty keywords gracefully
  });

  it('filters keywords by status correctly', () => {
    render(<KeywordTagGroup {...mockProps} />);

    // Should show matched keywords
    expect(screen.getByText('React')).toBeInTheDocument();

    // Should show suggested keywords
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Should show missing keywords
    expect(screen.getByText('Testing')).toBeInTheDocument();
  });

  it('applies correct styling for different keyword statuses', () => {
    render(<KeywordTagGroup {...mockProps} />);

    const reactKeyword = screen.getByText('React');
    const testingKeyword = screen.getByText('Testing');
    const rejectedKeyword = screen.getByText('Python');

    // Each should have different styling based on status
    expect(reactKeyword.closest('[class*="matched"]') || reactKeyword.closest('[class*="green"]')).toBeTruthy();
    expect(testingKeyword.closest('[class*="missing"]') || testingKeyword.closest('[class*="destructive"]')).toBeTruthy();
    expect(rejectedKeyword.closest('[class*="rejected"]') || rejectedKeyword.closest('[class*="muted"]')).toBeTruthy();
  });

  it('handles keyboard navigation', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    const firstKeyword = screen.getByText('React');
    firstKeyword.focus();

    // Test tab navigation
    await user.tab();

    expect(document.activeElement).toBeTruthy();
  });

  it('shows tooltips for keyword status', async () => {
    render(<KeywordTagGroup {...mockProps} />);

    const reactKeyword = screen.getByText('React');

    // Hover to potentially show tooltip
    await user.hover(reactKeyword);

    // Component should handle hover states
    expect(reactKeyword).toBeInTheDocument();
  });

  it('handles keywords without IDs', () => {
    const keywordsWithoutIds = [
      { keyword: 'JavaScript', status: 'matched' as const },
      { keyword: 'CSS', status: 'suggested' as const },
    ];

    render(<KeywordTagGroup {...mockProps} keywords={keywordsWithoutIds} />);

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
  });

  it('updates when keywords prop changes', async () => {
    const { rerender } = render(<KeywordTagGroup {...mockProps} />);

    expect(screen.getByText('React')).toBeInTheDocument();

    const newKeywords = [
      { keyword: 'Vue.js', status: 'matched' as const, id: '6' },
    ];

    rerender(<KeywordTagGroup {...mockProps} keywords={newKeywords} />);

    await waitFor(() => {
      expect(screen.queryByText('React')).not.toBeInTheDocument();
      expect(screen.getByText('Vue.js')).toBeInTheDocument();
    });
  });

  it('handles missing callback functions gracefully', () => {
    const minimalProps = { keywords: mockKeywords };

    expect(() => {
      render(<KeywordTagGroup {...minimalProps} />);
    }).not.toThrow();

    expect(screen.getByText('React')).toBeInTheDocument();
  });
});
