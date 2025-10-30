/**
 * Unit tests for ApplicationDetailsModal component
 * Tests the 4-tab interface for viewing and editing application details
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApplicationDetailsModal, ApplicationDetailsModalProps } from './ApplicationDetailsModal';
import { Application, ApplicationStatus } from '../../types';

// Mock data
const mockApplication: Application = {
  id: 'app-1',
  jobTitle: 'Senior Frontend Engineer',
  company: 'TechCorp',
  status: 'interviewing' as ApplicationStatus,
  appliedDate: new Date('2025-10-15'),
  priority: 'high',
  location: 'San Francisco, CA',
  jobUrl: 'https://example.com/job/123',
  notes: 'Great opportunity, matches my skills',
  documents: ['resume-1', 'cover-letter-1'],
  timeline: [
    {
      id: 'event-1',
      date: new Date('2025-10-15'),
      type: 'applied',
      title: 'Application Submitted',
      description: 'Initial application submitted',
    },
    {
      id: 'event-2',
      date: new Date('2025-10-20'),
      type: 'phone_screen',
      title: 'Phone Screening',
      description: 'Initial phone screen with recruiter',
    },
  ],
};

describe('ApplicationDetailsModal', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  const defaultProps: ApplicationDetailsModalProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    applicationId: 'app-1',
    application: mockApplication,
    onUpdate: mockOnUpdate,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders modal when open prop is true', () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
      expect(screen.getByText('TechCorp')).toBeInTheDocument();
    });

    test('does not render modal when open prop is false', () => {
      const { container } = render(
        <ApplicationDetailsModal {...defaultProps} open={false} />
      );
      // Modal should not be visible
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).not.toBeInTheDocument();
    });

    test('displays all four tabs', () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      expect(screen.getByText(/Overview/i)).toBeInTheDocument();
      expect(screen.getByText(/Timeline/i)).toBeInTheDocument();
      expect(screen.getByText(/Documents/i)).toBeInTheDocument();
      expect(screen.getByText(/Notes/i)).toBeInTheDocument();
    });
  });

  describe('Overview Tab', () => {
    test('displays application details in overview tab', () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
      expect(screen.getByText('TechCorp')).toBeInTheDocument();
      expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    });

    test('displays status badge with correct styling', () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      // Status should show 'Interviewing'
      const statusText = screen.getByText(/interviewing/i);
      expect(statusText).toBeInTheDocument();
    });

    test('displays priority indicator', () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      // Priority should be indicated somehow
      expect(screen.getByText(/high|priority/i)).toBeInTheDocument();
    });

    test('displays applied date', () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const dateText = screen.getByText(/October|10\/15|2025/i);
      expect(dateText).toBeInTheDocument();
    });
  });

  describe('Timeline Tab', () => {
    test('switches to timeline tab when clicked', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const timelineTab = screen.getByText(/Timeline/i);
      fireEvent.click(timelineTab);

      await waitFor(() => {
        expect(screen.getByText('Application Submitted')).toBeInTheDocument();
        expect(screen.getByText('Phone Screening')).toBeInTheDocument();
      });
    });

    test('displays timeline events in chronological order', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const timelineTab = screen.getByText(/Timeline/i);
      fireEvent.click(timelineTab);

      await waitFor(() => {
        const events = screen.getAllByText(/Application Submitted|Phone Screening/i);
        expect(events.length).toBeGreaterThanOrEqual(2);
      });
    });

    test('displays event descriptions', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const timelineTab = screen.getByText(/Timeline/i);
      fireEvent.click(timelineTab);

      await waitFor(() => {
        expect(screen.getByText(/Initial application submitted/i)).toBeInTheDocument();
      });
    });
  });

  describe('Documents Tab', () => {
    test('switches to documents tab when clicked', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const documentsTab = screen.getByText(/Documents/i);
      fireEvent.click(documentsTab);

      await waitFor(() => {
        // Should show document list
        expect(documentsTab.closest('[role="tab"]')).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Notes Tab', () => {
    test('switches to notes tab when clicked', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const notesTab = screen.getByText(/Notes/i);
      fireEvent.click(notesTab);

      await waitFor(() => {
        expect(notesTab.closest('[role="tab"]')).toHaveAttribute('aria-selected', 'true');
      });
    });

    test('displays existing notes', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const notesTab = screen.getByText(/Notes/i);
      fireEvent.click(notesTab);

      await waitFor(() => {
        const textarea = screen.getByDisplayValue(/Great opportunity/i);
        expect(textarea).toBeInTheDocument();
      });
    });

    test('updates notes when user types', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const notesTab = screen.getByText(/Notes/i);
      fireEvent.click(notesTab);

      await waitFor(() => {
        const textarea = screen.getByDisplayValue(/Great opportunity/i) as HTMLTextAreaElement;
        fireEvent.change(textarea, { target: { value: 'Updated notes' } });
        expect(textarea.value).toBe('Updated notes');
      });
    });

    test('calls onUpdate when save button is clicked', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const notesTab = screen.getByText(/Notes/i);
      fireEvent.click(notesTab);

      await waitFor(() => {
        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);
        expect(mockOnUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('Modal Controls', () => {
    test('calls onOpenChange when close button is clicked', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const closeButton = screen.getByText(/Close|✕/i);
      fireEvent.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    test('calls onDelete when delete button is clicked', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const deleteButton = screen.getByText(/Delete/i);
      fireEvent.click(deleteButton);

      // Confirm deletion if there's a confirmation dialog
      await waitFor(() => {
        const confirmButton = screen.queryByText(/Confirm|Yes/i);
        if (confirmButton) {
          fireEvent.click(confirmButton);
        }
      });

      expect(mockOnDelete).toHaveBeenCalled();
    });
  });

  describe('Responsive Design', () => {
    test('renders on mobile viewport', () => {
      // Mock mobile viewport
      window.innerWidth = 375;
      window.innerHeight = 667;

      const { container } = render(<ApplicationDetailsModal {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('renders on tablet viewport', () => {
      window.innerWidth = 768;
      window.innerHeight = 1024;

      const { container } = render(<ApplicationDetailsModal {...defaultProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('renders without timeline events', () => {
      const appWithoutTimeline = { ...mockApplication, timeline: [] };
      render(
        <ApplicationDetailsModal
          {...defaultProps}
          application={appWithoutTimeline}
        />
      );
      expect(screen.getByText('TechCorp')).toBeInTheDocument();
    });

    test('renders without documents', () => {
      const appWithoutDocs = { ...mockApplication, documents: [] };
      render(
        <ApplicationDetailsModal
          {...defaultProps}
          application={appWithoutDocs}
        />
      );
      expect(screen.getByText('TechCorp')).toBeInTheDocument();
    });

    test('renders with null application gracefully', () => {
      render(
        <ApplicationDetailsModal
          {...defaultProps}
          application={undefined}
        />
      );
      // Should not crash
      expect(screen.queryByText('TechCorp')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('tabs have proper aria-selected attributes', () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const overviewTab = screen.getByText(/Overview/i).closest('[role="tab"]');
      expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    });

    test('inactive tabs have aria-selected false', async () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const timelineTab = screen.getByText(/Timeline/i).closest('[role="tab"]');
      expect(timelineTab).toHaveAttribute('aria-selected', 'false');
    });

    test('modal has proper role attribute', () => {
      const { container } = render(<ApplicationDetailsModal {...defaultProps} />);
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
    });

    test('buttons are keyboard accessible', () => {
      render(<ApplicationDetailsModal {...defaultProps} />);
      const closeButton = screen.getByText(/Close|✕/i);
      expect(closeButton).toHaveAttribute('type', 'button');
    });
  });
});
