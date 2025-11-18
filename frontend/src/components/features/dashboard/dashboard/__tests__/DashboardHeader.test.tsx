import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DashboardHeader } from '../DashboardHeader';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('DashboardHeader', () => {
  const mockOnCreateProfile = jest.fn();
  const mockOnNavigateToSettings = jest.fn();

  beforeEach(() => {
    mockOnCreateProfile.mockClear();
    mockOnNavigateToSettings.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays the title', () => {
    renderWithTheme(<DashboardHeader title="My Dashboard" />);
    expect(screen.getByText('My Dashboard')).toBeInTheDocument();
  });

  it('displays the subtitle when provided', () => {
    renderWithTheme(
      <DashboardHeader title="Dashboard" subtitle="Welcome back!" />
    );
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
  });

  it('does not display subtitle when not provided', () => {
    renderWithTheme(<DashboardHeader title="Dashboard" />);
    const subtitle = screen.queryByText('Welcome back!');
    expect(subtitle).not.toBeInTheDocument();
  });

  it('renders create button by default', () => {
    renderWithTheme(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('Create Document')).toBeInTheDocument();
  });

  it('hides create button when showCreateButton is false', () => {
    renderWithTheme(<DashboardHeader title="Dashboard" showCreateButton={false} />);
    expect(screen.queryByText('Create Document')).not.toBeInTheDocument();
  });

  it('shows "Create Your First Document" when isEmpty is true', () => {
    renderWithTheme(<DashboardHeader title="Dashboard" isEmpty={true} />);
    expect(screen.getByText('Create Your First Document')).toBeInTheDocument();
  });

  it('shows "Create Document" when isEmpty is false', () => {
    renderWithTheme(<DashboardHeader title="Dashboard" isEmpty={false} />);
    expect(screen.getByText('Create Document')).toBeInTheDocument();
  });

  it('calls onCreateProfile when create button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <DashboardHeader title="Dashboard" onCreateProfile={mockOnCreateProfile} />
    );

    const createButton = screen.getByText('Create Document');
    await user.click(createButton);

    expect(mockOnCreateProfile).toHaveBeenCalledTimes(1);
  });

  it('calls onNavigateToSettings when settings button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <DashboardHeader
        title="Dashboard"
        onNavigateToSettings={mockOnNavigateToSettings}
      />
    );

    const settingsButtons = screen.getAllByRole('button');
    const settingsButton = settingsButtons.find((btn) =>
      btn.querySelector('[data-testid="SettingsIcon"]')
    );

    if (settingsButton) {
      await user.click(settingsButton);
      expect(mockOnNavigateToSettings).toHaveBeenCalledTimes(1);
    }
  });

  it('renders settings icon', () => {
    const { container } = renderWithTheme(<DashboardHeader title="Dashboard" />);
    const settingsIcon = container.querySelector('[data-testid="SettingsIcon"]');
    expect(settingsIcon).toBeInTheDocument();
  });

  it('renders user avatar', () => {
    const { container } = renderWithTheme(<DashboardHeader title="Dashboard" />);
    const userIcon = container.querySelector('[data-testid="PersonIcon"]');
    expect(userIcon).toBeInTheDocument();
  });

  it('shows navigation tabs when not empty', () => {
    renderWithTheme(<DashboardHeader title="Dashboard" isEmpty={false} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('ATS Analysis')).toBeInTheDocument();
  });

  it('hides navigation tabs when empty', () => {
    renderWithTheme(<DashboardHeader title="Dashboard" isEmpty={true} />);
    // There should still be a "Dashboard" text in the title
    const dashboardTexts = screen.getAllByText('Dashboard');
    // But the navigation tab "ATS Analysis" should not be present
    expect(screen.queryByText('ATS Analysis')).not.toBeInTheDocument();
  });

  it('renders with all props provided', () => {
    renderWithTheme(
      <DashboardHeader
        title="Test Dashboard"
        subtitle="Test Subtitle"
        onCreateProfile={mockOnCreateProfile}
        onNavigateToSettings={mockOnNavigateToSettings}
        showCreateButton={true}
        isEmpty={false}
      />
    );

    expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Create Document')).toBeInTheDocument();
  });

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add responsive tests
  it.todo('adapts layout for mobile screens');

  // TODO: Add edge case tests
  it.todo('handles very long titles gracefully');
  it.todo('handles missing callbacks gracefully');
});
