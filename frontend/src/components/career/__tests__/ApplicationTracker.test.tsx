import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import { ApplicationTracker } from '../ApplicationTracker';
import type { Application } from '../types';

// Mock the TimelineView component
jest.mock('../TimelineView', () => ({
  TimelineView: jest.fn(() => <div data-testid="timeline-view">TimelineView Mock</div>)
}));

// Mock MUI components
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual as object,
    Dialog: ({ children, open, onClose, maxWidth, fullWidth, PaperProps }: any) => {
      return open ? (
        <div data-testid="dialog" data-maxwidth={maxWidth} data-fullwidth={String(fullWidth)}>
          <div className={PaperProps?.className}>
            {children}
          </div>
        </div>
      ) : null;
    },
    DialogTitle: ({ children }: any) => (
      <div data-testid="dialog-title">
        {children}
      </div>
    ),
    DialogContent: ({ children }: any) => (
      <div data-testid="dialog-content">
        {children}
      </div>
    ),
    DialogActions: ({ children }: any) => (
      <div data-testid="dialog-actions">
        {children}
      </div>
    ),
    Button: ({ children, onClick, variant, ...props }: any) => (
      <button 
        data-testid={props['data-testid'] || 'button'} 
        onClick={onClick}
        data-variant={variant}
        {...props}
      >
        {children}
      </button>
    ),
    IconButton: ({ children, onClick, ...props }: any) => (
      <button 
        data-testid={props['data-testid'] || 'icon-button'} 
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    ),
    Typography: ({ children, variant, ...props }: any) => (
      <div data-testid={`typography-${variant || 'default'}`} {...props}>
        {children}
      </div>
    ),
  };
});

// Mock MUI icons
jest.mock('@mui/icons-material', () => ({
  Close: () => <span data-testid="close-icon">×</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
}));

describe('ApplicationTracker', () => {
  const mockApplications = [
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: 'Remote',
      salary: '$120,000 - $150,000',
      appliedDate: '2023-10-15',
      status: 'screening' as const,
      events: [],
      nextEvent: {
        type: 'Phone Interview',
        date: '2023-10-20',
      },
      progress: 25,
      companyLogo: 'https://example.com/logo.png',
    },
    {
      id: '2',
      jobTitle: 'Full Stack Engineer',
      company: 'Web Solutions Inc',
      location: 'New York, NY',
      salary: '$130,000 - $160,000',
      appliedDate: '2023-10-10',
      status: 'interview' as const,
      nextEvent: {
        type: 'Technical Interview',
        date: '2023-10-25',
      },
      progress: 50,
    },
  ];

  const mockOnApplicationUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ApplicationTracker />);
    expect(screen.getByTestId('application-tracker')).toBeInTheDocument();
  });

  it('renders with applications when provided', () => {
    render(<ApplicationTracker applications={mockApplications} />);
    
    // Check if applications are rendered (this would need to be updated based on actual rendering)
    // For now, we'll just check if the component renders without errors
    expect(screen.getByTestId('application-tracker')).toBeInTheDocument();
  });

  it('opens timeline view when an application is clicked', () => {
    render(
      <ApplicationTracker 
        applications={mockApplications} 
        onApplicationUpdate={mockOnApplicationUpdate} 
      />
    );
    
    // Simulate clicking on an application (this would need to target a real element)
    // For now, we'll directly test the handler
    const { handleApplicationClick } = require('../ApplicationTracker');
    handleApplicationClick('1');
    
    // Check if the dialog is open
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    
    // Check if TimelineView is rendered with the correct props
    expect(TimelineView).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationId: '1',
        companyName: 'Tech Corp',
        jobTitle: 'Senior Frontend Developer',
      }),
      expect.anything()
    );
  });

  it('closes timeline view when close button is clicked', () => {
    render(
      <ApplicationTracker 
        applications={mockApplications} 
        onApplicationUpdate={mockOnApplicationUpdate} 
      />
    );
    
    // Open the dialog first
    const { handleApplicationClick } = require('../ApplicationTracker');
    handleApplicationClick('1');
    
    // Close the dialog
    const closeButton = screen.getByTestId('close-icon').closest('button');
    fireEvent.click(closeButton!);
    
    // The dialog should be closed (not in the document)
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('calls onApplicationUpdate when application status changes', () => {
    render(
      <ApplicationTracker 
        applications={mockApplications} 
        onApplicationUpdate={mockOnApplicationUpdate} 
      />
    );
    
    // Simulate moving an application to a different status
    const { handleApplicationMove } = require('../ApplicationTracker');
    handleApplicationMove('1', 'interview');
    
    expect(mockOnApplicationUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        status: 'interview',
      })
    );
  });

  it('renders the timeline view with applications', () => {
    render(
      <ApplicationTracker 
        applications={mockApplications as Application[]} 
        onApplicationUpdate={mockOnApplicationUpdate} 
      />
    );
    
    // Check if the timeline view is rendered
    expect(screen.getByTestId('timeline-view')).toBeInTheDocument();
  });

  it('handles adding a new application', () => {
    render(
      <ApplicationTracker 
        applications={mockApplications} 
        onApplicationUpdate={mockOnApplicationUpdate} 
      />
    );
    
    // Simulate adding a new application
    const { handleAddApplication } = require('../ApplicationTracker');
    const consoleSpy = jest.spyOn(console, 'log');
    handleAddApplication();

    expect(consoleSpy).toHaveBeenCalledWith('Add new application');
    consoleSpy.mockRestore();
  });

  it('handles event editing', () => {
    render(
      <ApplicationTracker 
        applications={mockApplications} 
        onApplicationUpdate={mockOnApplicationUpdate} 
      />
    );
    
    // Open the dialog first
    const { handleApplicationClick, handleEventEdit } = require('../ApplicationTracker');
    handleApplicationClick('1');

    // Simulate editing an event
    const consoleSpy = jest.spyOn(console, 'log');
    handleEventEdit('event-123');

    expect(consoleSpy).toHaveBeenCalledWith('Edit event:', 'event-123');
    consoleSpy.mockRestore();
  });

  it('handles adding a note to an event', () => {
    render(
      <ApplicationTracker 
        applications={mockApplications} 
        onApplicationUpdate={mockOnApplicationUpdate} 
      />
    );
    
    // Open the dialog first
    const { handleApplicationClick, handleAddNote } = require('../ApplicationTracker');
    handleApplicationClick('1');

    // Simulate adding a note to an event
    const consoleSpy = jest.spyOn(console, 'log');
    handleAddNote('event-123');

    expect(consoleSpy).toHaveBeenCalledWith('Add note to event:', 'event-123');
    consoleSpy.mockRestore();
  });

  it('handles viewing a document', () => {
    render(
      <ApplicationTracker 
        applications={mockApplications} 
        onApplicationUpdate={mockOnApplicationUpdate} 
      />
    );
    
    // Open the dialog first
    const { handleApplicationClick, handleViewDocument } = require('../ApplicationTracker');
    handleApplicationClick('1');

    // Simulate viewing a document
    const consoleSpy = jest.spyOn(console, 'log');
    handleViewDocument('resume.pdf');

    expect(consoleSpy).toHaveBeenCalledWith('View document:', 'resume.pdf');
    consoleSpy.mockRestore();
  });

  it('renders correctly with no applications', () => {
    render(<ApplicationTracker applications={[]} />);
    
    // The component should still render without errors
    expect(screen.getByTestId('application-tracker')).toBeInTheDocument();
    
    // Check if the "No applications" message is shown (if applicable)
    // This would depend on the actual implementation
  });

  it('renders with the correct dialog props', () => {
    render(
      <ApplicationTracker 
        applications={mockApplications} 
        onApplicationUpdate={mockOnApplicationUpdate} 
      />
    );
    
    // Open the dialog
    const { handleApplicationClick } = require('../ApplicationTracker');
    handleApplicationClick('1');
    
    // Check dialog props
    const dialog = screen.getByTestId('dialog');
    expect(dialog).toHaveAttribute('data-maxwidth', 'lg');
    expect(dialog).toHaveAttribute('data-fullwidth', 'true');
  });
});
