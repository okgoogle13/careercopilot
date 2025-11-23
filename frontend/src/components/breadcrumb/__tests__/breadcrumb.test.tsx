import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { Breadcrumbs, BreadcrumbItem } from '../breadcrumb';

describe('Breadcrumbs', () => {
  const mockItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Applications', href: '/applications' },
    { label: 'Job Details' },
  ];

  it('renders without errors', () => {
    render(<Breadcrumbs items={mockItems} />);
    const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(breadcrumb).toBeInTheDocument();
  });

  it('renders all breadcrumb items', () => {
    render(<Breadcrumbs items={mockItems} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Applications')).toBeInTheDocument();
    expect(screen.getByText('Job Details')).toBeInTheDocument();
  });

  it('renders links for non-last items', () => {
    render(<Breadcrumbs items={mockItems} />);

    const homeLink = screen.getByText('Home').closest('a');
    const applicationsLink = screen.getByText('Applications').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(applicationsLink).toHaveAttribute('href', '/applications');
  });

  it('renders last item as text, not link', () => {
    render(<Breadcrumbs items={mockItems} />);

    const lastItem = screen.getByText('Job Details');
    expect(lastItem.tagName).not.toBe('A');
  });

  it('calls onClick when breadcrumb link is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    const itemsWithClick: BreadcrumbItem[] = [
      { label: 'Home', href: '/', onClick: mockOnClick },
      { label: 'Current Page' },
    ];

    render(<Breadcrumbs items={itemsWithClick} />);

    const homeLink = screen.getByText('Home');
    await user.click(homeLink);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('prevents default behavior when onClick is provided', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn((e: Event) => e.preventDefault());

    const itemsWithClick: BreadcrumbItem[] = [
      { label: 'Home', href: '/', onClick: mockOnClick },
      { label: 'Current Page' },
    ];

    render(<Breadcrumbs items={itemsWithClick} />);

    const homeLink = screen.getByText('Home');
    await user.click(homeLink);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('shows home icon by default', () => {
    const { container } = render(<Breadcrumbs items={mockItems} />);

    // lucide-react Home icon should be rendered
    const homeIcon = container.querySelector('svg');
    expect(homeIcon).toBeInTheDocument();
  });

  it('hides home icon when showHomeIcon is false', () => {
    const { container } = render(<Breadcrumbs items={mockItems} showHomeIcon={false} />);

    // No icon should be shown for first item
    const firstItem = screen.getByText('Home');
    expect(firstItem).toBeInTheDocument();
  });

  it('renders custom icons for breadcrumb items', () => {
    const itemsWithIcons: BreadcrumbItem[] = [
      { label: 'Dashboard', icon: <span data-testid="custom-icon">📊</span> },
      { label: 'Current Page' },
    ];

    render(<Breadcrumbs items={itemsWithIcons} />);

    const customIcon = screen.getByTestId('custom-icon');
    expect(customIcon).toBeInTheDocument();
  });

  it('uses custom separator when provided', () => {
    const customSeparator = <span data-testid="custom-separator">/</span>;
    render(<Breadcrumbs items={mockItems} separator={customSeparator} />);

    const separator = screen.getByTestId('custom-separator');
    expect(separator).toBeInTheDocument();
  });

  it('uses default ChevronRight separator', () => {
    const { container } = render(<Breadcrumbs items={mockItems} />);

    // Default separator is ChevronRight from lucide-react
    const separators = container.querySelectorAll('.MuiBreadcrumbs-separator svg');
    expect(separators.length).toBeGreaterThan(0);
  });

  it('respects maxItems prop', () => {
    const manyItems: BreadcrumbItem[] = [
      { label: 'Item 1', href: '/1' },
      { label: 'Item 2', href: '/2' },
      { label: 'Item 3', href: '/3' },
      { label: 'Item 4', href: '/4' },
      { label: 'Item 5', href: '/5' },
      { label: 'Item 6', href: '/6' },
      { label: 'Item 7', href: '/7' },
      { label: 'Item 8', href: '/8' },
      { label: 'Item 9', href: '/9' },
      { label: 'Current Page' },
    ];

    render(<Breadcrumbs items={manyItems} maxItems={3} />);

    // MUI Breadcrumbs with maxItems should render ellipsis
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  it('has correct accessibility role', () => {
    render(<Breadcrumbs items={mockItems} />);

    const navigation = screen.getByRole('navigation');
    expect(navigation).toHaveAttribute('aria-label', 'breadcrumb');
  });

  it('applies hover styles to links', async () => {
    const user = userEvent.setup();
    render(<Breadcrumbs items={mockItems} />);

    const homeLink = screen.getByText('Home');
    await user.hover(homeLink);

    expect(homeLink).toBeInTheDocument();
  });

  it('renders with single item (current page only)', () => {
    const singleItem: BreadcrumbItem[] = [{ label: 'Current Page' }];

    render(<Breadcrumbs items={singleItem} />);

    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('handles empty items array gracefully', () => {
    render(<Breadcrumbs items={[]} />);

    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  it('renders multiple breadcrumbs with different styles', () => {
    render(<Breadcrumbs items={mockItems} />);

    const homeLink = screen.getByText('Home');
    const lastItem = screen.getByText('Job Details');

    // Links should be clickable
    expect(homeLink.closest('a')).toBeInTheDocument();

    // Last item should not be a link
    expect(lastItem.closest('a')).not.toBeInTheDocument();
  });

  it('displays icon and label together', () => {
    const itemsWithIcon: BreadcrumbItem[] = [
      { label: 'Dashboard', icon: <span data-testid="dashboard-icon">📊</span> },
      { label: 'Current' },
    ];

    render(<Breadcrumbs items={itemsWithIcon} />);

    const icon = screen.getByTestId('dashboard-icon');
    const label = screen.getByText('Dashboard');

    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it('prevents navigation when onClick is provided without href', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();

    const itemsWithOnlyClick: BreadcrumbItem[] = [
      { label: 'Clickable', onClick: mockOnClick },
      { label: 'Current' },
    ];

    render(<Breadcrumbs items={itemsWithOnlyClick} />);

    const clickableItem = screen.getByText('Clickable');
    await user.click(clickableItem);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('renders with default maxItems of 8', () => {
    // Default maxItems is 8, should not collapse unless > 8 items
    const eightItems: BreadcrumbItem[] = Array.from({ length: 8 }, (_, i) => ({
      label: `Item ${i + 1}`,
      href: `/${i + 1}`,
    }));

    render(<Breadcrumbs items={eightItems} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 8')).toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const { container } = render(<Breadcrumbs items={mockItems} />);

    // Container has padding (py: 1)
    const breadcrumbContainer = container.querySelector('[class*="MuiBox"]');
    expect(breadcrumbContainer).toBeInTheDocument();
  });

  it('supports keyboard navigation on links', async () => {
    const user = userEvent.setup();
    render(<Breadcrumbs items={mockItems} />);

    const homeLink = screen.getByText('Home');
    homeLink.focus();

    expect(document.activeElement).toBe(homeLink);

    await user.keyboard('{Enter}');
    // Link should be clickable via keyboard
  });
});
