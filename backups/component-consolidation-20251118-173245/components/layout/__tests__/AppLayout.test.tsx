import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppLayout } from '../AppLayout';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('AppLayout', () => {
  const defaultProps = {
    children: <div>Test Content</div>,
    currentView: 'dashboard',
  };

  it('renders without errors', () => {
    renderWithTheme(<AppLayout {...defaultProps} />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('displays the current view title', () => {
    renderWithTheme(<AppLayout {...defaultProps} currentView="dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Overview and analytics')).toBeInTheDocument();
  });

  it('displays user information', () => {
    const user = {
      name: 'Jane Doe',
      email: 'jane@example.com',
    };
    renderWithTheme(<AppLayout {...defaultProps} user={user} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('calls onNavigate when a navigation item is clicked', async () => {
    const mockNavigate = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(
      <AppLayout {...defaultProps} onNavigate={mockNavigate} />
    );

    const documentsButton = screen.getByText('Documents');
    await user.click(documentsButton);

    expect(mockNavigate).toHaveBeenCalledWith('documents');
  });

  it('calls onThemeToggle when theme button is clicked', async () => {
    const mockThemeToggle = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(
      <AppLayout {...defaultProps} onThemeToggle={mockThemeToggle} isDarkMode={true} />
    );

    const themeButton = screen.getByText('Light');
    await user.click(themeButton);

    expect(mockThemeToggle).toHaveBeenCalledTimes(1);
  });

  it('displays correct theme button text based on isDarkMode prop', () => {
    const { rerender } = renderWithTheme(
      <AppLayout {...defaultProps} isDarkMode={true} />
    );
    expect(screen.getByText('Light')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={mockTheme}>
        <AppLayout {...defaultProps} isDarkMode={false} />
      </ThemeProvider>
    );
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });

  it('shows navigation drawer when showDemoNav is true', () => {
    renderWithTheme(<AppLayout {...defaultProps} showDemoNav={true} />);
    expect(screen.getByLabelText('navigation folders')).toBeInTheDocument();
  });

  it('hides navigation drawer when showDemoNav is false', () => {
    renderWithTheme(<AppLayout {...defaultProps} showDemoNav={false} />);
    expect(screen.queryByLabelText('navigation folders')).not.toBeInTheDocument();
  });

  it('shows navigation toggle button when showDemoNav is false', () => {
    renderWithTheme(
      <AppLayout {...defaultProps} showDemoNav={false} onToggleDemoNav={jest.fn()} />
    );
    expect(screen.getByText('Show Navigation')).toBeInTheDocument();
  });

  it('displays badge on navigation items when provided', () => {
    renderWithTheme(<AppLayout {...defaultProps} />);
    // Documents has a badge: 3
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('highlights the selected navigation item', () => {
    renderWithTheme(<AppLayout {...defaultProps} currentView="ats-analysis" />);
    const atsItem = screen.getByText('ATS Analysis').closest('div[role="button"]');
    expect(atsItem).toHaveClass('Mui-selected');
  });

  it('renders logout button', () => {
    renderWithTheme(<AppLayout {...defaultProps} />);
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    renderWithTheme(<AppLayout {...defaultProps} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('ATS Analysis')).toBeInTheDocument();
    expect(screen.getByText('Job Matching')).toBeInTheDocument();
    expect(screen.getByText('Career Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Interview Prep')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders user avatar with initials when no avatar image provided', () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
    };
    renderWithTheme(<AppLayout {...defaultProps} user={user} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithTheme(
      <AppLayout {...defaultProps}>
        <div data-testid="custom-content">Custom Content</div>
      </AppLayout>
    );
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  // TODO: Add mobile responsive tests
  it.todo('opens mobile drawer when menu icon is clicked');

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add edge case tests
  it.todo('handles missing user data gracefully');
});
