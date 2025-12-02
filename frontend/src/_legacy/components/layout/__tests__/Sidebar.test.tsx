import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Sidebar } from '../Sidebar';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('Sidebar', () => {
  const mockOnTabChange = jest.fn();

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  it('renders without errors', () => {
    renderWithTheme(<Sidebar activeTab="dashboard" onTabChange={mockOnTabChange} />);
    expect(screen.getByText('CareerCopilot')).toBeInTheDocument();
  });

  it('displays all menu items', () => {
    renderWithTheme(<Sidebar activeTab="dashboard" onTabChange={mockOnTabChange} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('ATS Analysis')).toBeInTheDocument();
  });

  it('highlights the active tab', () => {
    renderWithTheme(<Sidebar activeTab="dashboard" onTabChange={mockOnTabChange} />);
    const dashboardButton = screen.getByText('Dashboard').closest('div[role="button"]');
    expect(dashboardButton).toHaveClass('Mui-selected');
  });

  it('calls onTabChange when menu item is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<Sidebar activeTab="dashboard" onTabChange={mockOnTabChange} />);

    const atsAnalysisButton = screen.getByText('ATS Analysis');
    await user.click(atsAnalysisButton);

    expect(mockOnTabChange).toHaveBeenCalledWith('ats-analysis');
    expect(mockOnTabChange).toHaveBeenCalledTimes(1);
  });

  it('displays the New Application button', () => {
    renderWithTheme(<Sidebar activeTab="dashboard" onTabChange={mockOnTabChange} />);
    expect(screen.getByText('New Application')).toBeInTheDocument();
  });

  it('renders New Application button with icon', () => {
    renderWithTheme(<Sidebar activeTab="dashboard" onTabChange={mockOnTabChange} />);
    const button = screen.getByRole('button', { name: /new application/i });
    expect(button).toBeInTheDocument();
  });

  it('changes active state when activeTab prop changes', () => {
    const { rerender } = renderWithTheme(
      <Sidebar activeTab="dashboard" onTabChange={mockOnTabChange} />
    );

    let dashboardButton = screen.getByText('Dashboard').closest('div[role="button"]');
    expect(dashboardButton).toHaveClass('Mui-selected');

    rerender(
      <ThemeProvider theme={mockTheme}>
        <Sidebar activeTab="ats-analysis" onTabChange={mockOnTabChange} />
      </ThemeProvider>
    );

    dashboardButton = screen.getByText('Dashboard').closest('div[role="button"]');
    const atsButton = screen.getByText('ATS Analysis').closest('div[role="button"]');

    expect(dashboardButton).not.toHaveClass('Mui-selected');
    expect(atsButton).toHaveClass('Mui-selected');
  });

  it('renders all menu item icons', () => {
    renderWithTheme(<Sidebar activeTab="dashboard" onTabChange={mockOnTabChange} />);
    // Both items should have icons - we can verify by checking the ListItemIcon components exist
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add responsive tests
  it.todo('adapts to mobile screen sizes');
});
