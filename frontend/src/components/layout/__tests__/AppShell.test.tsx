import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppShell } from '../AppShell';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('AppShell', () => {
  it('renders without errors', () => {
    renderWithTheme(<AppShell />);
    expect(screen.getByText('Angry Unicorn')).toBeInTheDocument();
  });

  it('displays the application name', () => {
    renderWithTheme(<AppShell />);
    expect(screen.getAllByText('Angry Unicorn').length).toBeGreaterThan(0);
    expect(screen.getByText('Career Copilot')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    renderWithTheme(<AppShell />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Applications')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });

  it('renders Settings menu item', () => {
    renderWithTheme(<AppShell />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('highlights the active tab', () => {
    renderWithTheme(<AppShell activeTab="dashboard" />);
    const dashboardButton = screen.getByText('Dashboard').closest('div[role="button"]');
    expect(dashboardButton).toHaveClass('Mui-selected');
  });

  it('calls onTabChange when menu item is clicked', async () => {
    const mockTabChange = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(<AppShell activeTab="dashboard" onTabChange={mockTabChange} />);

    const documentsButton = screen.getByText('Documents');
    await user.click(documentsButton);

    expect(mockTabChange).toHaveBeenCalledWith('documents');
  });

  it('calls onSettingsClick when settings is clicked', async () => {
    const mockSettingsClick = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(<AppShell onSettingsClick={mockSettingsClick} />);

    const settingsButtons = screen.getAllByText('Settings');
    await user.click(settingsButtons[0]);

    expect(mockSettingsClick).toHaveBeenCalledTimes(1);
  });

  it('renders children content', () => {
    renderWithTheme(
      <AppShell>
        <div data-testid="test-content">Test Content</div>
      </AppShell>
    );
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('displays logo image', () => {
    renderWithTheme(<AppShell />);
    const logos = screen.getAllByAltText('Angry Unicorn');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('changes active state when activeTab prop changes', () => {
    const { rerender } = renderWithTheme(<AppShell activeTab="dashboard" />);

    let dashboardButton = screen.getByText('Dashboard').closest('div[role="button"]');
    expect(dashboardButton).toHaveClass('Mui-selected');

    rerender(
      <ThemeProvider theme={mockTheme}>
        <AppShell activeTab="documents" />
      </ThemeProvider>
    );

    dashboardButton = screen.getByText('Dashboard').closest('div[role="button"]');
    const documentsButton = screen.getByText('Documents').closest('div[role="button"]');

    expect(dashboardButton).not.toHaveClass('Mui-selected');
    expect(documentsButton).toHaveClass('Mui-selected');
  });

  it('renders mobile menu button', () => {
    renderWithTheme(<AppShell />);
    const menuButton = screen.getByLabelText('open drawer');
    expect(menuButton).toBeInTheDocument();
  });

  it('has accessible drawer label', () => {
    renderWithTheme(<AppShell />);
    expect(screen.getByLabelText('open drawer')).toBeInTheDocument();
  });

  it('renders all tab menu items with icons', () => {
    renderWithTheme(<AppShell />);

    const menuItems = [
      'Dashboard',
      'Documents',
      'Opportunities',
      'Applications',
      'Analysis',
    ];

    menuItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('defaults to dashboard tab when no activeTab provided', () => {
    renderWithTheme(<AppShell />);
    const dashboardButton = screen.getByText('Dashboard').closest('div[role="button"]');
    expect(dashboardButton).toHaveClass('Mui-selected');
  });

  // TODO: Add mobile drawer tests
  it.todo('opens mobile drawer when menu button is clicked');
  it.todo('closes mobile drawer when tab is selected on mobile');

  // TODO: Add responsive tests
  it.todo('shows desktop drawer on desktop screens');
  it.todo('shows temporary drawer on mobile screens');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');
});
