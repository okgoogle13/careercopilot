import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard, Settings } from '@mui/icons-material';
import { NavigationItem } from '../NavigationItem';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/dashboard' }),
}));

const mockTheme = createTheme();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={mockTheme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('NavigationItem', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without errors', () => {
    const item = {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard />,
    };
    renderWithProviders(<NavigationItem item={item} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays the item label', () => {
    const item = {
      label: 'Settings',
      path: '/settings',
      icon: <Settings />,
    };
    renderWithProviders(<NavigationItem item={item} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('navigates when clicked', async () => {
    const user = userEvent.setup();
    const item = {
      label: 'Settings',
      path: '/settings',
      icon: <Settings />,
    };
    renderWithProviders(<NavigationItem item={item} />);

    const button = screen.getByText('Settings');
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  it('calls onItemClick when clicked', async () => {
    const mockOnItemClick = jest.fn();
    const user = userEvent.setup();
    const item = {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard />,
    };
    renderWithProviders(<NavigationItem item={item} onItemClick={mockOnItemClick} />);

    const button = screen.getByText('Dashboard');
    await user.click(button);

    expect(mockOnItemClick).toHaveBeenCalledTimes(1);
  });

  it('shows as active when path matches location', () => {
    const item = {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard />,
    };
    renderWithProviders(<NavigationItem item={item} />);

    const button = screen.getByText('Dashboard').closest('div[role="button"]');
    expect(button).toHaveClass('Mui-selected');
  });

  it('does not show as active when path does not match', () => {
    const item = {
      label: 'Settings',
      path: '/settings',
      icon: <Settings />,
    };
    renderWithProviders(<NavigationItem item={item} />);

    const button = screen.getByText('Settings').closest('div[role="button"]');
    expect(button).not.toHaveClass('Mui-selected');
  });

  it('renders expand icon when has children', () => {
    const item = {
      label: 'Documents',
      path: '/documents',
      icon: <Dashboard />,
      children: [
        { label: 'Resumes', path: '/documents/resumes', icon: <Settings /> },
      ],
    };
    renderWithProviders(<NavigationItem item={item} />);

    // Should show expand/collapse icon
    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  it('expands children when clicked', async () => {
    const user = userEvent.setup();
    const item = {
      label: 'Documents',
      path: '/documents',
      icon: <Dashboard />,
      children: [
        { label: 'Resumes', path: '/documents/resumes', icon: <Settings /> },
      ],
    };
    renderWithProviders(<NavigationItem item={item} />);

    const button = screen.getByText('Documents');
    await user.click(button);

    expect(screen.getByText('Resumes')).toBeInTheDocument();
  });

  it('does not navigate when has children', async () => {
    const user = userEvent.setup();
    const item = {
      label: 'Documents',
      path: '/documents',
      icon: <Dashboard />,
      children: [
        { label: 'Resumes', path: '/documents/resumes', icon: <Settings /> },
      ],
    };
    renderWithProviders(<NavigationItem item={item} />);

    const button = screen.getByText('Documents');
    await user.click(button);

    // Should not navigate, just expand
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('applies correct depth padding', () => {
    const item = {
      label: 'Nested Item',
      path: '/nested',
      icon: <Dashboard />,
    };
    renderWithProviders(<NavigationItem item={item} depth={2} />);

    // Should render with increased padding based on depth
    expect(screen.getByText('Nested Item')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const item = {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard data-testid="dashboard-icon" />,
    };
    renderWithProviders(<NavigationItem item={item} />);

    expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument();
  });

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add nested children tests
  it.todo('renders nested children correctly');
  it.todo('highlights parent when child is active');
});
