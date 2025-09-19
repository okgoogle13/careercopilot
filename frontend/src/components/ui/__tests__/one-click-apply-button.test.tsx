import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { OneClickApplyButton } from '../one-click-apply-button';
import { render, screen } from '../utils/test-utils';

// Mock timers
jest.useFakeTimers();

// Mock the DocumentReviewModal component
jest.mock('../document-review-modal', () => ({
  DocumentReviewModal: ({ documents, onApprove }: any) => {
    // Only render the approve button if onApprove is provided
    return (
      <div data-testid="document-review-modal">
        <h3>Document Review Modal</h3>
        {onApprove && <button onClick={() => onApprove(documents)}>Approve Documents</button>}
      </div>
    );
  },
}));

describe('OneClickApplyButton', () => {
  const user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  });

  const mockJob = {
    id: 'job-1',
    jobTitle: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Remote',
    applicationUrl: 'https://example.com/apply',
    requirements: ['React', 'TypeScript', 'Testing'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<OneClickApplyButton job={mockJob} />);
    const button = screen.getByRole('button', { name: /Apply with AI/i });
    expect(button).toBeInTheDocument();
  });

  it('shows loading state when clicked', async () => {
    render(<OneClickApplyButton job={mockJob} />);
    const applyButton = screen.getByRole('button', { name: /Apply with AI/i });

    await act(async () => {
      await user.click(applyButton);
      jest.advanceTimersByTime(1000);
    });

    // Check for loading state
    expect(applyButton).toHaveTextContent(/Generating Documents|Review Documents/);
  });

  it('opens document review modal during application process', async () => {
    render(<OneClickApplyButton job={mockJob} />);
    const applyButton = screen.getByRole('button', { name: /Apply with AI/i });

    await act(async () => {
      await user.click(applyButton);
      jest.advanceTimersByTime(2000);
    });

    // Check if modal is shown
    expect(screen.getByTestId('document-review-modal')).toBeInTheDocument();
  });

  it('handles successful application flow', async () => {
    const mockOnComplete = jest.fn();
    render(<OneClickApplyButton job={mockJob} onApplicationComplete={mockOnComplete} />);

    const applyButton = screen.getByRole('button', { name: /Apply with AI/i });

    // Start application
    await act(async () => {
      await user.click(applyButton);
      jest.advanceTimersByTime(2000);
    });

    // Approve documents
    const approveButton = screen.getByRole('button', { name: /Approve Documents/i });

    await act(async () => {
      await user.click(approveButton);
      jest.advanceTimersByTime(2000);
    });

    // Verify completion callback was called
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('shows progress indicators during document generation', async () => {
    render(<OneClickApplyButton job={mockJob} />);
    const applyButton = screen.getByRole('button', { name: /Apply with AI/i });

    await act(async () => {
      await user.click(applyButton);
      // Advance timers enough to show progress but not complete
      jest.advanceTimersByTime(500);
    });

    // Check for progress indicator in the document
    const progressIndicator = document.querySelector('[class*="bg-blue-600"]');
    expect(progressIndicator).not.toBeNull();
  });

  it('disabled state works correctly', () => {
    render(<OneClickApplyButton job={mockJob} disabled />);
    const applyButton = screen.getByRole('button', { name: /Apply with AI/i });
    expect(applyButton).toBeDisabled();
  });

  it('prevents multiple simultaneous applications', async () => {
    render(<OneClickApplyButton job={mockJob} />);
    const applyButton = screen.getByRole('button', { name: /Apply with AI/i });

    // First click - start application
    await act(async () => {
      await user.click(applyButton);
      jest.advanceTimersByTime(100);
    });

    // Get the current button state
    const buttonText = applyButton.textContent;

    // Second click - should be ignored
    await act(async () => {
      await user.click(applyButton);
      jest.advanceTimersByTime(100);
    });

    // Verify button state didn't change
    expect(applyButton.textContent).toBe(buttonText);
  });
});
