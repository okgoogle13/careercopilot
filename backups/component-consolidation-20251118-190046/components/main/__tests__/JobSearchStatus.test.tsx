import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { JobSearchStatus } from '../JobSearchStatus';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('JobSearchStatus', () => {
  it('renders without errors', () => {
    renderWithTheme(<JobSearchStatus />);
    expect(screen.getByText('Job Search Dashboard')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    renderWithTheme(<JobSearchStatus />);
    expect(screen.getByText('Job Search Dashboard')).toBeInTheDocument();
  });

  it('displays the subtitle', () => {
    renderWithTheme(<JobSearchStatus />);
    expect(screen.getByText(/Track your progress/i)).toBeInTheDocument();
  });

  it('displays default stats', () => {
    renderWithTheme(<JobSearchStatus />);

    expect(screen.getByText('Applications Sent')).toBeInTheDocument();
    expect(screen.getByText('Interviews')).toBeInTheDocument();
    expect(screen.getByText('Offers Received')).toBeInTheDocument();
  });

  it('displays custom stats when provided', () => {
    const customStats = {
      applicationsSent: 50,
      interviews: 10,
      offers: 5,
      responseRate: 30,
      avgResponseTime: 7,
      profileViews: 200,
    };

    renderWithTheme(<JobSearchStatus stats={customStats} />);

    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays response rate', () => {
    renderWithTheme(<JobSearchStatus />);
    expect(screen.getByText('Response Rate')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('displays average response time', () => {
    renderWithTheme(<JobSearchStatus />);
    expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
    expect(screen.getByText('5 days')).toBeInTheDocument();
  });

  it('displays profile views', () => {
    renderWithTheme(<JobSearchStatus />);
    expect(screen.getByText('Profile Views')).toBeInTheDocument();
    expect(screen.getByText('145')).toBeInTheDocument();
  });

  it('renders all 6 stat cards', () => {
    renderWithTheme(<JobSearchStatus />);

    expect(screen.getByText('Applications Sent')).toBeInTheDocument();
    expect(screen.getByText('Interviews')).toBeInTheDocument();
    expect(screen.getByText('Offers Received')).toBeInTheDocument();
    expect(screen.getByText('Response Rate')).toBeInTheDocument();
    expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
    expect(screen.getByText('Profile Views')).toBeInTheDocument();
  });

  it('displays trend indicators when provided', () => {
    const trends = {
      applicationsTrend: { value: 20, isPositive: true },
      interviewsTrend: { value: 30, isPositive: true },
      offersTrend: { value: 50, isPositive: true },
    };

    renderWithTheme(<JobSearchStatus trends={trends} />);

    expect(screen.getByText('+20%')).toBeInTheDocument();
    expect(screen.getByText('+30%')).toBeInTheDocument();
    expect(screen.getByText('+50%')).toBeInTheDocument();
  });

  it('displays stat subtitles', () => {
    renderWithTheme(<JobSearchStatus />);

    expect(screen.getByText('This month')).toBeInTheDocument();
    expect(screen.getByText('Scheduled & completed')).toBeInTheDocument();
    expect(screen.getByText('Active offers')).toBeInTheDocument();
  });

  it('handles zero stats gracefully', () => {
    const zeroStats = {
      applicationsSent: 0,
      interviews: 0,
      offers: 0,
      responseRate: 0,
      avgResponseTime: 0,
      profileViews: 0,
    };

    renderWithTheme(<JobSearchStatus stats={zeroStats} />);

    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  // TODO: Add responsive tests
  it.todo('displays stats in 3 columns on desktop');
  it.todo('displays stats in 2 columns on tablet');
  it.todo('displays stats in 1 column on mobile');

  // TODO: Add accessibility tests
  it.todo('has accessible labels for all stats');
});
