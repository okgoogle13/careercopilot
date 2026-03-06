import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock lucide-react
(jest as any).unstable_mockModule('lucide-react', () => ({
  AlertCircle: () => <div data-testid="icon-alert-circle" />,
  ArrowLeft: () => <div data-testid="icon-arrow-left" />,
  Building2: () => <div data-testid="icon-building-2" />,
  Calendar: () => <div data-testid="icon-calendar" />,
  CheckCircle: () => <div data-testid="icon-check-circle" />,
  ChevronDown: () => <div data-testid="icon-chevron-down" />,
  ChevronUp: () => <div data-testid="icon-chevron-up" />,
  Clock: () => <div data-testid="icon-clock" />,
  FileText: () => <div data-testid="icon-file-text" />,
  Mail: () => <div data-testid="icon-mail" />,
  MessageSquare: () => <div data-testid="icon-message-square" />,
  Phone: () => <div data-testid="icon-phone" />,
  Plus: () => <div data-testid="icon-plus" />,
  Star: () => <div data-testid="icon-star" />,
  User: () => <div data-testid="icon-user" />,
  Video: () => <div data-testid="icon-video" />,
  XCircle: () => <div data-testid="icon-x-circle" />,
  Loader2: () => <div data-testid="icon-loader2" />,
}));

// Mock UI components
(jest as any).unstable_mockModule('@/components/ui/Pebble', () => ({
  Pebble: ({ children, onClick }: any) => (
    <button
      onClick={onClick}
      data-testid="pebble-btn"
    >
      {children}
    </button>
  ),
}));

(jest as any).unstable_mockModule('@/components/ui/StatusBadge/StatusBadge', () => ({
  StatusBadge: ({ label }: any) => <div data-testid="status-badge">{label}</div>,
}));

(jest as any).unstable_mockModule('@/components/ui/Stone', () => ({
  Stone: ({ children }: any) => <div data-testid="stone-container">{children}</div>,
}));

const { TimelineView } = await import('../TimelineView');

describe('TimelineView', () => {
  it('renders correctly with default mock events', () => {
    render(<TimelineView />);

    expect(screen.getByText('Application Timeline')).toBeInTheDocument();
    expect(screen.getByText(/Senior Frontend Developer at TechCorp/i)).toBeInTheDocument();

    // Check if initial events are rendered
    expect(screen.getByText('Application Submitted')).toBeInTheDocument();
    expect(screen.getByText('Phone Screening')).toBeInTheDocument();
  });

  it('filters events by type', () => {
    render(<TimelineView />);

    // Filter by Interviews
    fireEvent.click(screen.getByText('Interviews'));
    expect(screen.getByText('Phone Screening')).toBeInTheDocument();
    expect(screen.getByText('Technical Interview')).toBeInTheDocument();
    expect(screen.queryByText('Application Submitted')).not.toBeInTheDocument();

    // Filter by Comms
    fireEvent.click(screen.getByText('Comms'));
    expect(screen.getByText('Application Acknowledged')).toBeInTheDocument();
    expect(screen.queryByText('Phone Screening')).not.toBeInTheDocument();
  });

  it('expands and collapses event details', () => {
    render(<TimelineView />);

    // Find the first "Show Details" button
    const expandButtons = screen.getAllByText(/Show Details/i);
    fireEvent.click(expandButtons[0]);

    expect(screen.getByText('Show Less')).toBeInTheDocument();
    expect(screen.getByText('Notes:')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Show Less/i));
    expect(screen.queryByText('Notes:')).not.toBeInTheDocument();
  });

  it('shows progress correctly', () => {
    render(<TimelineView />);
    // 4 out of 6 events are completed in mock data
    expect(screen.getByText('67% Complete')).toBeInTheDocument();
  });
});
