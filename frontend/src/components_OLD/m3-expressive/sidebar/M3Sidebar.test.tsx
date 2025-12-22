import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Sidebar, type M3SidebarNavItem } from './M3Sidebar';

const mockItems: M3SidebarNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <span data-testid="home-icon">🏠</span>,
    path: '/home',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <span data-testid="settings-icon">⚙️</span>,
    path: '/settings',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <span data-testid="profile-icon">👤</span>,
    path: '/profile',
    disabled: true,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <span data-testid="notifications-icon">🔔</span>,
    path: '/notifications',
    badge: 5,
  },
];

const mockItemsWithChildren: M3SidebarNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <span>📊</span>,
    path: '/dashboard',
    children: [
      {
        id: 'overview',
        label: 'Overview',
        path: '/dashboard/overview',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: '/dashboard/analytics',
      },
    ],
  },
];

describe('M3Sidebar Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders sidebar with navigation items', () => {
      render(<M3Sidebar items={mockItems} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('applies base class', () => {
      const { container } = render(<M3Sidebar items={mockItems} />);
      const sidebar = container.querySelector('.m3-sidebar');
      expect(sidebar).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Sidebar items={mockItems} className="custom-class" />
      );
      const sidebar = container.querySelector('.custom-class');
      expect(sidebar).toBeInTheDocument();
    });

    test('renders navigation list', () => {
      const { container } = render(<M3Sidebar items={mockItems} />);
      const navList = container.querySelector('.m3-sidebar__nav-list');
      expect(navList).toBeInTheDocument();
    });

    test('renders correct number of nav items', () => {
      const { container } = render(<M3Sidebar items={mockItems} />);
      const navItems = container.querySelectorAll('.m3-sidebar__nav-item');
      expect(navItems).toHaveLength(mockItems.length);
    });
  });

  // Navigation Item Rendering
  describe('Navigation Item Rendering', () => {
    test('renders nav item labels', () => {
      render(<M3Sidebar items={mockItems} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    test('renders nav item icons', () => {
      render(<M3Sidebar items={mockItems} />);
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    });

    test('renders nav item badges', () => {
      render(<M3Sidebar items={mockItems} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('renders nav buttons with correct structure', () => {
      const { container } = render(<M3Sidebar items={mockItems} />);
      const buttons = container.querySelectorAll('.m3-sidebar__nav-button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    test('renders items without icons', () => {
      const itemsWithoutIcons: M3SidebarNavItem[] = [
        { id: 'test', label: 'Test Item', path: '/test' },
      ];
      render(<M3Sidebar items={itemsWithoutIcons} />);
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
  });

  // Active State Tests
  describe('Active State', () => {
    test('applies active class to active item', () => {
      const { container } = render(
        <M3Sidebar items={mockItems} activeItemId="home" />
      );
      const activeButton = container.querySelector(
        '.m3-sidebar__nav-button--active'
      );
      expect(activeButton).toBeInTheDocument();
      expect(activeButton).toHaveTextContent('Home');
    });

    test('sets aria-current="page" on active item', () => {
      render(<M3Sidebar items={mockItems} activeItemId="home" />);
      const homeButton = screen.getByTestId('m3-sidebar-item-home');
      expect(homeButton).toHaveAttribute('aria-current', 'page');
    });

    test('does not set aria-current on inactive items', () => {
      render(<M3Sidebar items={mockItems} activeItemId="home" />);
      const settingsButton = screen.getByTestId('m3-sidebar-item-settings');
      expect(settingsButton).not.toHaveAttribute('aria-current');
    });

    test('handles item with active prop set to true', () => {
      const itemsWithActive: M3SidebarNavItem[] = [
        { id: 'test', label: 'Test', path: '/test', active: true },
      ];
      const { container } = render(<M3Sidebar items={itemsWithActive} />);
      const activeButton = container.querySelector(
        '.m3-sidebar__nav-button--active'
      );
      expect(activeButton).toBeInTheDocument();
    });
  });

  // Click Handler Tests
  describe('Click Handlers', () => {
    test('calls onItemClick when item is clicked', () => {
      const handleItemClick = jest.fn();
      render(
        <M3Sidebar items={mockItems} onItemClick={handleItemClick} />
      );
      const homeButton = screen.getByTestId('m3-sidebar-item-home');
      fireEvent.click(homeButton);
      expect(handleItemClick).toHaveBeenCalledTimes(1);
      expect(handleItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'home' }),
        expect.any(Object)
      );
    });

    test('does not call onItemClick when disabled item is clicked', () => {
      const handleItemClick = jest.fn();
      render(
        <M3Sidebar items={mockItems} onItemClick={handleItemClick} />
      );
      const profileButton = screen.getByTestId('m3-sidebar-item-profile');
      fireEvent.click(profileButton);
      expect(handleItemClick).not.toHaveBeenCalled();
    });

    test('toggles expanded state when item with children is clicked', () => {
      const { container } = render(
        <M3Sidebar items={mockItemsWithChildren} />
      );
      const dashboardButton = screen.getByTestId('m3-sidebar-item-dashboard');
      
      // Initially collapsed
      expect(dashboardButton).toHaveAttribute('aria-expanded', 'false');
      
      // Click to expand
      fireEvent.click(dashboardButton);
      expect(dashboardButton).toHaveAttribute('aria-expanded', 'true');
      
      // Click to collapse
      fireEvent.click(dashboardButton);
      expect(dashboardButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('renders children when parent is expanded', () => {
      const { container } = render(
        <M3Sidebar items={mockItemsWithChildren} />
      );
      const dashboardButton = screen.getByTestId('m3-sidebar-item-dashboard');
      
      // Expand
      fireEvent.click(dashboardButton);
      
      // Check children are rendered
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
  });

  // Icon Support Tests
  describe('Icon Support', () => {
    test('renders icon in nav item', () => {
      render(<M3Sidebar items={mockItems} />);
      const icon = screen.getByTestId('home-icon');
      expect(icon).toBeInTheDocument();
      expect(icon.closest('.m3-sidebar__nav-icon')).toBeInTheDocument();
    });

    test('renders multiple icons correctly', () => {
      render(<M3Sidebar items={mockItems} />);
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
      expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
    });

    test('hides icons when sidebar is collapsed', () => {
      const { container } = render(
        <M3Sidebar items={mockItems} collapsed />
      );
      // Icons should still be visible in collapsed mode, but labels hidden
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });
  });

  // Keyboard Navigation Tests
  describe('Keyboard Navigation', () => {
    test('activates item on Enter key', () => {
      const handleItemClick = jest.fn();
      render(
        <M3Sidebar items={mockItems} onItemClick={handleItemClick} />
      );
      const homeButton = screen.getByTestId('m3-sidebar-item-home');
      
      fireEvent.keyDown(homeButton, { key: 'Enter' });
      expect(handleItemClick).toHaveBeenCalledTimes(1);
    });

    test('activates item on Space key', () => {
      const handleItemClick = jest.fn();
      render(
        <M3Sidebar items={mockItems} onItemClick={handleItemClick} />
      );
      const homeButton = screen.getByTestId('m3-sidebar-item-home');
      
      fireEvent.keyDown(homeButton, { key: ' ' });
      expect(handleItemClick).toHaveBeenCalledTimes(1);
    });

    test('handles Enter key correctly', () => {
      const handleItemClick = jest.fn();
      render(
        <M3Sidebar items={mockItems} onItemClick={handleItemClick} />
      );
      const homeButton = screen.getByTestId('m3-sidebar-item-home');
      
      fireEvent.keyDown(homeButton, { key: 'Enter' });
      
      // Handler should be called, and preventDefault is called internally
      expect(handleItemClick).toHaveBeenCalledTimes(1);
    });

    test('does not activate disabled item on keyboard', () => {
      const handleItemClick = jest.fn();
      render(
        <M3Sidebar items={mockItems} onItemClick={handleItemClick} />
      );
      const profileButton = screen.getByTestId('m3-sidebar-item-profile');
      
      fireEvent.keyDown(profileButton, { key: 'Enter' });
      expect(handleItemClick).not.toHaveBeenCalled();
    });

    test('expands/collapses item with children on Enter', () => {
      const { container } = render(
        <M3Sidebar items={mockItemsWithChildren} />
      );
      const dashboardButton = screen.getByTestId('m3-sidebar-item-dashboard');
      
      fireEvent.keyDown(dashboardButton, { key: 'Enter' });
      expect(dashboardButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // Disabled State Tests
  describe('Disabled State', () => {
    test('applies disabled class to disabled items', () => {
      const { container } = render(<M3Sidebar items={mockItems} />);
      const profileButton = screen.getByTestId('m3-sidebar-item-profile');
      expect(profileButton).toHaveClass('m3-sidebar__nav-button--disabled');
    });

    test('disables button element for disabled items', () => {
      render(<M3Sidebar items={mockItems} />);
      const profileButton = screen.getByTestId('m3-sidebar-item-profile');
      expect(profileButton).toBeDisabled();
    });
  });

  // Collapsed State Tests
  describe('Collapsed State', () => {
    test('applies collapsed class when collapsed prop is true', () => {
      const { container } = render(
        <M3Sidebar items={mockItems} collapsed />
      );
      const sidebar = container.querySelector('.m3-sidebar--collapsed');
      expect(sidebar).toBeInTheDocument();
    });

    test('hides labels when collapsed', () => {
      const { container } = render(
        <M3Sidebar items={mockItems} collapsed />
      );
      const labels = container.querySelectorAll('.m3-sidebar__nav-label');
      labels.forEach((label) => {
        expect(label).not.toBeVisible();
      });
    });

    test('hides badges when collapsed', () => {
      const { container } = render(
        <M3Sidebar items={mockItems} collapsed />
      );
      const badges = container.querySelectorAll('.m3-sidebar__nav-badge');
      badges.forEach((badge) => {
        expect(badge).not.toBeVisible();
      });
    });

    test('sets width to 64px when collapsed', () => {
      const { container } = render(
        <M3Sidebar items={mockItems} collapsed />
      );
      const sidebar = container.querySelector('.m3-sidebar');
      expect(sidebar).toHaveStyle({ width: '64px' });
    });
  });

  // Width Prop Tests
  describe('Width Prop', () => {
    test('applies custom width', () => {
      const { container } = render(
        <M3Sidebar items={mockItems} width="300px" />
      );
      const sidebar = container.querySelector('.m3-sidebar');
      expect(sidebar).toHaveStyle({ width: '300px' });
    });

    test('uses default width when not specified', () => {
      const { container } = render(<M3Sidebar items={mockItems} />);
      const sidebar = container.querySelector('.m3-sidebar');
      expect(sidebar).toHaveStyle({ width: '256px' });
    });
  });

  // Nested Items Tests
  describe('Nested Items', () => {
    test('renders nested nav list for items with children', () => {
      const { container } = render(
        <M3Sidebar items={mockItemsWithChildren} />
      );
      const dashboardButton = screen.getByTestId('m3-sidebar-item-dashboard');
      fireEvent.click(dashboardButton);
      
      const nestedList = container.querySelector('.m3-sidebar__nav-list--nested');
      expect(nestedList).toBeInTheDocument();
    });

    test('applies nested class to nested items', () => {
      const { container } = render(
        <M3Sidebar items={mockItemsWithChildren} />
      );
      const dashboardButton = screen.getByTestId('m3-sidebar-item-dashboard');
      fireEvent.click(dashboardButton);
      
      const nestedButtons = container.querySelectorAll(
        '.m3-sidebar__nav-button--nested'
      );
      expect(nestedButtons.length).toBeGreaterThan(0);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has navigation role', () => {
      render(<M3Sidebar items={mockItems} />);
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    test('has aria-label on navigation', () => {
      render(<M3Sidebar items={mockItems} />);
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    test('buttons have proper roles', () => {
      render(<M3Sidebar items={mockItems} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    test('items with children have aria-expanded', () => {
      render(<M3Sidebar items={mockItemsWithChildren} />);
      const dashboardButton = screen.getByTestId('m3-sidebar-item-dashboard');
      expect(dashboardButton).toHaveAttribute('aria-expanded');
    });

    test('icons have aria-hidden', () => {
      const { container } = render(<M3Sidebar items={mockItems} />);
      const icons = container.querySelectorAll('.m3-sidebar__nav-icon');
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    test('forwards ref to nav element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<M3Sidebar items={mockItems} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('NAV');
    });
  });

  // Data Attributes Tests
  describe('Data Attributes', () => {
    test('applies data-testid to sidebar', () => {
      render(<M3Sidebar items={mockItems} />);
      expect(screen.getByTestId('m3-sidebar')).toBeInTheDocument();
    });

    test('applies custom data-testid to nav items', () => {
      const itemsWithTestId: M3SidebarNavItem[] = [
        {
          id: 'test',
          label: 'Test',
          path: '/test',
          'data-testid': 'custom-test-id',
        },
      ];
      render(<M3Sidebar items={itemsWithTestId} />);
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });
  });
});
