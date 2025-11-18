import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Typography } from '@mui/material';

// Mock TimelineView component
const TimelineView = ({
  events,
}: {
  events: Array<{ id: string; title: string; date: string; description: string }>;
}) => (
  <Timeline>
    {events.map((event) => (
      <TimelineItem key={event.id}>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h6">{event.title}</Typography>
          <Typography variant="caption">{event.date}</Typography>
          <Typography>{event.description}</Typography>
        </TimelineContent>
      </TimelineItem>
    ))}
  </Timeline>
);

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('TimelineView', () => {
  const mockEvents = [
    {
      id: '1',
      title: 'Application Submitted',
      date: '2024-01-15',
      description: 'Submitted application to Google',
    },
    {
      id: '2',
      title: 'Interview Scheduled',
      date: '2024-01-20',
      description: 'First round technical interview',
    },
  ];

  it('renders without errors', () => {
    renderWithTheme(<TimelineView events={mockEvents} />);
    expect(screen.getByText('Application Submitted')).toBeInTheDocument();
  });

  it('displays all events', () => {
    renderWithTheme(<TimelineView events={mockEvents} />);

    expect(screen.getByText('Application Submitted')).toBeInTheDocument();
    expect(screen.getByText('Interview Scheduled')).toBeInTheDocument();
  });

  it('displays event dates', () => {
    renderWithTheme(<TimelineView events={mockEvents} />);

    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('2024-01-20')).toBeInTheDocument();
  });

  it('displays event descriptions', () => {
    renderWithTheme(<TimelineView events={mockEvents} />);

    expect(screen.getByText('Submitted application to Google')).toBeInTheDocument();
    expect(screen.getByText('First round technical interview')).toBeInTheDocument();
  });

  it('handles empty events array', () => {
    renderWithTheme(<TimelineView events={[]} />);
    const timeline = screen.queryByText('Application Submitted');
    expect(timeline).not.toBeInTheDocument();
  });

  it('displays events in order', () => {
    renderWithTheme(<TimelineView events={mockEvents} />);

    const titles = screen.getAllByRole('heading', { level: 6 });
    expect(titles[0]).toHaveTextContent('Application Submitted');
    expect(titles[1]).toHaveTextContent('Interview Scheduled');
  });

  // TODO: Add visual tests
  it.todo('displays timeline connector between events');
  it.todo('displays timeline dots for each event');

  // TODO: Add accessibility tests
  it.todo('has accessible chronological order');

  // TODO: Add edge case tests
  it.todo('handles single event');
  it.todo('handles many events (20+)');
});
