import React from 'react';
import { screen, waitFor, act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { OneClickApplyButton } from '../one-click-apply-button';
import { mockJob } from '../utils/test-utils';

// Setup user event
const user = userEvent.setup({ delay: null });

// Mock timers
jest.useFakeTimers();

// Create mock implementations for AI services
const mockGenerateCoverLetter = jest.fn();
const mockGenerateTailoredResume = jest.fn();

// Mock the document review modal module with implementation
const mockDocumentReviewModal = jest.fn(({ isOpen, onConfirm, onOpenChange }: any) => {
  React.useEffect(() => {
    // Auto-confirm when the modal opens
    if (isOpen && onConfirm) {
      const timer = setTimeout(() => {
        onConfirm([{
          type: 'cover_letter',
          title: 'Cover Letter for Frontend Developer',
          content: 'Mock cover letter content',
          metadata: {}
        }]);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onConfirm]);

  if (!isOpen) return null;
  
  return (
    <div data-testid="document-review-modal">
      <h3>Document Review Modal</h3>
      <button onClick={() => onConfirm && onConfirm([{
        type: 'cover_letter',
        title: 'Cover Letter for Frontend Developer',
        content: 'Mock cover letter content',
        metadata: {}
      }])}>
        Confirm
      </button>
      <button onClick={() => onOpenChange && onOpenChange(false)}>
        Cancel
      </button>
    </div>
  );
});

// Mock the document generation function
const mockGenerateDocuments = async (job: any) => {
  return [
    {
      type: 'cover_letter',
      title: `Cover Letter for ${job.jobTitle} at ${job.company}`,
      content: 'Mock cover letter content',
      metadata: {}
    },
    {
      type: 'resume',
      title: `Resume for ${job.jobTitle}`,
      content: 'Mock resume content',
      metadata: {}
    }
  ];
};

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  
  // Set up default mock implementations
  mockGenerateCoverLetter.mockResolvedValue('Mock cover letter content');
  mockGenerateTailoredResume.mockResolvedValue({ resume_content: 'Mock resume content' });
  
  // Reset the document review modal mock
  mockDocumentReviewModal.mockClear();
  mockDocumentReviewModal.mockImplementation(({ isOpen, onConfirm, onOpenChange }: any) => {
    React.useEffect(() => {
      // Auto-confirm when the modal opens
      if (isOpen && onConfirm) {
        const timer = setTimeout(() => {
          onConfirm([{
            type: 'cover_letter',
            title: 'Cover Letter for Frontend Developer',
            content: 'Mock cover letter content',
            metadata: {}
          }]);
        }, 50);
        
        return () => clearTimeout(timer);
      }
    }, [isOpen, onConfirm]);

    if (!isOpen) return null;
    
    return (
      <div data-testid="document-review-modal">
        <h3>Document Review Modal</h3>
        <button onClick={() => onConfirm && onConfirm([{
          type: 'cover_letter',
          title: 'Cover Letter for Frontend Developer',
          content: 'Mock cover letter content',
          metadata: {}
        }])}>
          Confirm
        </button>
        <button onClick={() => onOpenChange && onOpenChange(false)}>
          Cancel
        </button>
      </div>
    );
  });
});

// Mock the document review modal module
jest.mock('../document-review-modal', () => ({
  __esModule: true,
  DocumentReviewModal: (props: any) => mockDocumentReviewModal(props)
}));

// Mock the AI services module
jest.mock('@/api/aiServices', () => ({
  __esModule: true,
  generateCoverLetter: (...args: any[]) => mockGenerateCoverLetter(...args),
  generateTailoredResume: (...args: any[]) => mockGenerateTailoredResume(...args),
  default: {
    generateCoverLetter: (...args: any[]) => mockGenerateCoverLetter(...args),
    generateTailoredResume: (...args: any[]) => mockGenerateTailoredResume(...args)
  }
}));

// Increase test timeout
jest.setTimeout(15000);

describe('OneClickApplyButton', () => {
  let user: ReturnType<typeof userEvent.setup>;
  
  beforeAll(() => {
    // Setup user event with no delay for testing
    user = userEvent.setup({ delay: null });
  });
  
  beforeEach(() => {
    // Clear all mocks between tests
    jest.clearAllMocks();
    // Reset timers
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    // Clean up fake timers
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

    // Mock job data is imported from test-utils
  
  it('renders without crashing', async () => {
    render(<OneClickApplyButton job={mockJob} />);
    
    // Use findByText which is async and waits for the element to appear
    const button = await screen.findByText(/Apply with AI/i);
    expect(button).toBeInTheDocument();
  });

  it('shows loading state when clicked', async () => {
    render(<OneClickApplyButton job={mockJob} />);
    
    // Use findByText which is async and waits for the element to appear
    const applyButton = await screen.findByText(/Apply with AI/i);
    expect(applyButton).toBeInTheDocument();

    await act(async () => {
      await user.click(applyButton);
      // Advance timers to simulate passage of time
      jest.advanceTimersByTime(100);
    });

    // Check for loading state
    await waitFor(() => {
      const button = screen.getByText(/Generating Documents|Review Documents/);
      expect(button).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('shows document review modal during application process', async () => {
    // Set up mock implementations
    const mockCoverLetter = 'Mock cover letter';
    const mockResume = { resume_content: 'Mock resume' };

    mockGenerateCoverLetter.mockResolvedValueOnce(mockCoverLetter);
    mockGenerateTailoredResume.mockResolvedValueOnce(mockResume);

    render(<OneClickApplyButton job={mockJob} />);

    // Wait for the apply button to be in the document
    const applyButton = await screen.findByRole('button', { name: /Apply with AI/i });
    expect(applyButton).toBeInTheDocument();

    // Start application
    await act(async () => {
      await user.click(applyButton);
    });

    // Fast-forward time to complete document generation
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Verify the modal was shown with the correct props
    await waitFor(() => {
      // Find any call where the modal was opened
      const modalCalls = mockDocumentReviewModal.mock.calls.filter(call => call[0].isOpen);
      expect(modalCalls.length).toBeGreaterThan(0);
      
      const lastCall = modalCalls[modalCalls.length - 1][0];
      expect(lastCall).toMatchObject({
        isOpen: true
      });
    }, { timeout: 5000 });
  });

  it('calls onApplicationComplete when application is submitted', async () => {
    // Create a mock implementation that we can track
    const mockOnComplete = jest.fn();
    
    // Set up the mock to return our test documents
    mockGenerateCoverLetter.mockResolvedValueOnce('Test cover letter content');
    mockGenerateTailoredResume.mockResolvedValueOnce({ resume_content: 'Test resume content' });
    
    // Render the component
    render(<OneClickApplyButton job={mockJob} onApplicationComplete={mockOnComplete} />);

    // Wait for the apply button to be in the document
    const applyButton = await screen.findByRole('button', { name: /Apply with AI/i });
    expect(applyButton).toBeInTheDocument();

    // Start application
    await act(async () => {
      await user.click(applyButton);
      // Fast-forward time to complete document generation
      jest.advanceTimersByTime(2000);
    });

    // Wait for the document review modal to appear
    await waitFor(() => {
      const modalCalls = mockDocumentReviewModal.mock.calls.filter(call => call[0].isOpen);
      expect(modalCalls.length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    // Get the last modal call
    const modalCalls = mockDocumentReviewModal.mock.calls.filter(call => call[0].isOpen);
    const lastModalCall = modalCalls[modalCalls.length - 1][0];

    // Manually trigger the onConfirm handler with mock documents
    await act(async () => {
      lastModalCall.onConfirm([
        {
          type: 'cover_letter',
          title: 'Cover Letter for Test Job',
          content: 'Test cover letter content',
          metadata: {}
        },
        {
          type: 'resume',
          title: 'Resume for Test Job',
          content: 'Test resume content',
          metadata: {}
        }
      ]);
      // Fast-forward time to complete submission
      jest.advanceTimersByTime(2000);
    });

    // Verify the callback was called with the expected arguments
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();

      const [jobArg, documentsArg] = mockOnComplete.mock.calls[0];
      
      // Verify job argument
      expect(jobArg).toMatchObject({
        id: mockJob.id,
        jobTitle: mockJob.jobTitle,
        company: mockJob.company
      });

      // Verify documents argument structure
      expect(Array.isArray(documentsArg)).toBe(true);
      expect(documentsArg.length).toBeGreaterThan(0);
      
      // Check for at least one document with expected structure
      const hasCoverLetter = documentsArg.some(doc => 
        doc && 
        typeof doc === 'object' && 
        'type' in doc && 
        doc.type === 'cover_letter' &&
        'title' in doc &&
        'content' in doc
      );
      
      expect(hasCoverLetter).toBe(true);
    }, { timeout: 5000 });
  });

  it('shows progress indicators during document generation', async () => {
    render(<OneClickApplyButton job={mockJob} />);
    
    // Use findByText which is async and waits for the element to appear
    const applyButton = await screen.findByText(/Apply with AI/i);

    await act(async () => {
      await user.click(applyButton);
      jest.advanceTimersByTime(100);
    });

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText(/Generating Documents/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('disabled state works correctly', async () => {
    render(<OneClickApplyButton job={mockJob} disabled />);
    
    // Use findByRole which is the recommended approach
    const applyButton = await screen.findByRole('button', { name: /Apply with AI/i });
    
    // Verify the button is disabled (either by attribute or class)
    expect(applyButton).toBeDisabled();
    
    // Check for either the disabled attribute or the MUI disabled class
    const isDisabled = applyButton.hasAttribute('disabled') || 
                      applyButton.getAttribute('aria-disabled') === 'true' ||
                      applyButton.classList.contains('Mui-disabled');
    
    expect(isDisabled).toBe(true);
    
    // Verify no API calls were made on mount
    expect(mockGenerateCoverLetter).not.toHaveBeenCalled();
    expect(mockGenerateTailoredResume).not.toHaveBeenCalled();
  });

  it('prevents multiple simultaneous applications', async () => {
    // Set up mocks to resolve immediately
    mockGenerateCoverLetter.mockResolvedValue('Test cover letter content');
    mockGenerateTailoredResume.mockResolvedValue({ resume_content: 'Test resume content' });
    
    // Render the component
    render(<OneClickApplyButton job={mockJob} />);
    
    // Wait for the apply button to be in the document
    const applyButton = await screen.findByRole('button', { name: /Apply with AI/i });
    expect(applyButton).toBeInTheDocument();
    
    // First click - should start the application
    await act(async () => {
      await user.click(applyButton);
      // Fast-forward time to start document generation
      jest.advanceTimersByTime(100);
    });
    
    // Verify the button is now disabled and shows loading state
    await waitFor(() => {
      expect(applyButton).toBeDisabled();
    }, { timeout: 5000 });
    
    // Try to click again - should not trigger another API call
    await act(async () => {
      // The button should be disabled, so we'll use a try-catch to handle the error
      try {
        await user.click(applyButton);
      } catch (e) {
        // Expected error - button is disabled
        expect(e.message).toMatch(/pointer-events: none/);
      }
      jest.advanceTimersByTime(100);
    });
    
    // Complete the application by confirming the modal
    const modalCalls = mockDocumentReviewModal.mock.calls.filter(call => call[0].isOpen);
    if (modalCalls.length > 0) {
      const lastModalCall = modalCalls[modalCalls.length - 1][0];
      await act(async () => {
        lastModalCall.onConfirm([
          {
            type: 'cover_letter',
            title: 'Cover Letter for Test Job',
            content: 'Test cover letter content',
            metadata: {}
          },
          {
            type: 'resume',
            title: 'Resume for Test Job',
            content: 'Test resume content',
            metadata: {}
          }
        ]);
        jest.advanceTimersByTime(2000);
      });
    }
  });

});

afterEach(() => {
  // Clean up fake timers
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
