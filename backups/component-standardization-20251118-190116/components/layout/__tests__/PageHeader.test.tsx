import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PageHeader } from '../PageHeader';

const mockTheme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('PageHeader', () => {
  it('renders without errors', () => {
    renderWithTheme(<PageHeader title="Test Page" />);
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('displays the title', () => {
    renderWithTheme(<PageHeader title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays the subtitle when provided', () => {
    renderWithTheme(<PageHeader title="Documents" subtitle="Manage your documents" />);
    expect(screen.getByText('Manage your documents')).toBeInTheDocument();
  });

  it('displays the description when provided', () => {
    renderWithTheme(
      <PageHeader title="Test" description="This is a test description" />
    );
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('renders breadcrumbs when provided', () => {
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Documents', href: '/documents' },
      { label: 'Current Page' },
    ];
    renderWithTheme(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('displays status chip when provided', () => {
    renderWithTheme(
      <PageHeader title="Test" status={{ label: 'Active', color: 'success' }} />
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const mockOnBack = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(<PageHeader title="Test" onBack={mockOnBack} />);

    const backButton = screen.getByLabelText('Back');
    await user.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('displays custom back label in tooltip', () => {
    renderWithTheme(
      <PageHeader title="Test" onBack={jest.fn()} backLabel="Go to Dashboard" />
    );
    expect(screen.getByLabelText('Go to Dashboard')).toBeInTheDocument();
  });

  it('renders avatar when provided', () => {
    renderWithTheme(
      <PageHeader
        title="Test"
        avatar={{ src: '/avatar.jpg', alt: 'User Avatar', fallback: 'UA' }}
      />
    );
    expect(screen.getByAltText('User Avatar')).toBeInTheDocument();
  });

  it('renders avatar fallback when no image provided', () => {
    renderWithTheme(
      <PageHeader title="Test" avatar={{ alt: 'User Avatar', fallback: 'UA' }} />
    );
    expect(screen.getByText('UA')).toBeInTheDocument();
  });

  it('renders action buttons', async () => {
    const mockEdit = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(
      <PageHeader
        title="Test"
        actions={[
          {
            id: 'edit',
            label: 'Edit',
            onClick: mockEdit,
          },
        ]}
      />
    );

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    expect(mockEdit).toHaveBeenCalledTimes(1);
  });

  it('disables action buttons when disabled prop is true', () => {
    renderWithTheme(
      <PageHeader
        title="Test"
        actions={[
          {
            id: 'edit',
            label: 'Edit',
            onClick: jest.fn(),
            disabled: true,
          },
        ]}
      />
    );

    const editButton = screen.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeDisabled();
  });

  it('opens menu when more actions button is clicked', async () => {
    const user = userEvent.setup();
    const actions = [
      { id: 'action1', label: 'Action 1', onClick: jest.fn() },
      { id: 'action2', label: 'Action 2', onClick: jest.fn() },
      { id: 'action3', label: 'Action 3', onClick: jest.fn() },
      { id: 'action4', label: 'Action 4', onClick: jest.fn() },
    ];

    renderWithTheme(<PageHeader title="Test" actions={actions} />);

    const moreButton = screen.getByLabelText('more actions');
    await user.click(moreButton);

    expect(screen.getByText('Action 4')).toBeInTheDocument();
  });

  it('executes menu action when clicked', async () => {
    const mockAction = jest.fn();
    const user = userEvent.setup();

    renderWithTheme(
      <PageHeader
        title="Test"
        menuActions={[
          {
            id: 'delete',
            label: 'Delete',
            onClick: mockAction,
          },
        ]}
      />
    );

    const moreButton = screen.getByLabelText('more actions');
    await user.click(moreButton);

    const deleteOption = screen.getByText('Delete');
    await user.click(deleteOption);

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('renders in compact variant', () => {
    renderWithTheme(<PageHeader title="Test" variant="compact" />);
    // Title should be h6 in compact mode
    const title = screen.getByText('Test');
    expect(title.tagName).toBe('H6');
  });

  it('renders in detailed variant', () => {
    renderWithTheme(<PageHeader title="Test" variant="detailed" />);
    // Title should be h4 in detailed mode
    const title = screen.getByText('Test');
    expect(title.tagName).toBe('H4');
  });

  it('renders children when provided', () => {
    renderWithTheme(
      <PageHeader title="Test">
        <div data-testid="custom-content">Custom Content</div>
      </PageHeader>
    );
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs with home icon on first item', () => {
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Documents' },
    ];
    renderWithTheme(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

    // Home icon should be rendered
    const homeLinks = screen.getAllByRole('link');
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  it('calls breadcrumb onClick when provided', async () => {
    const mockClick = jest.fn();
    const user = userEvent.setup();
    const breadcrumbs = [
      { label: 'Home', onClick: mockClick },
    ];

    renderWithTheme(<PageHeader title="Test" breadcrumbs={breadcrumbs} />);

    const homeLink = screen.getByText('Home');
    await user.click(homeLink);

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  // TODO: Add accessibility tests
  it.todo('is accessible via keyboard navigation');

  // TODO: Add responsive tests
  it.todo('adapts action buttons for mobile screens');

  // TODO: Add edge case tests
  it.todo('handles very long titles gracefully');
  it.todo('handles many action buttons (10+) gracefully');
});
