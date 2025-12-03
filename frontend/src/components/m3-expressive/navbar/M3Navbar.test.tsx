import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { M3Navbar, type M3NavbarMenuItem, type M3NavbarUserMenu } from './M3Navbar';

const mockMenuItems: M3NavbarMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <span data-testid="home-icon">🏠</span>,
    path: '/home',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <span data-testid="dashboard-icon">📊</span>,
    path: '/dashboard',
    active: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    disabled: true,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    badge: 5,
  },
];

const mockUserMenu: M3NavbarUserMenu = {
  name: 'John Doe',
  email: 'john@example.com',
  items: [
    {
      id: 'profile',
      label: 'Profile',
      icon: <span>👤</span>,
      path: '/profile',
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
    },
    {
      id: 'logout',
      label: 'Logout',
      path: '/logout',
    },
  ],
};

describe('M3Navbar Component', () => {
  // Basic Rendering Tests
  describe('Basic Rendering', () => {
    test('renders navbar with navigation role', () => {
      render(<M3Navbar />);
      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
      expect(navbar).toHaveAttribute('aria-label', 'Main navigation');
    });

    test('applies base class', () => {
      const { container } = render(<M3Navbar />);
      const navbar = container.querySelector('.m3-navbar');
      expect(navbar).toBeInTheDocument();
    });

    test('forwards custom className', () => {
      const { container } = render(
        <M3Navbar className="custom-class" />
      );
      const navbar = container.querySelector('.custom-class');
      expect(navbar).toBeInTheDocument();
    });

    test('renders navbar container', () => {
      const { container } = render(<M3Navbar />);
      const containerEl = container.querySelector('.m3-navbar__container');
      expect(containerEl).toBeInTheDocument();
    });
  });

  // Logo/Brand Tests
  describe('Logo and Brand', () => {
    test('renders logo as React node', () => {
      render(
        <M3Navbar logo={<span data-testid="logo">Logo</span>} />
      );
      expect(screen.getByTestId('logo')).toBeInTheDocument();
    });

    test('renders logo as image URL', () => {
      render(<M3Navbar logo="/logo.png" brand="TestBrand" />);
      const logo = document.querySelector('.m3-navbar__logo img');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logo.png');
      expect(logo).toHaveAttribute('alt', 'TestBrand');
    });

    test('renders brand text', () => {
      render(<M3Navbar brand="CareerCopilot" />);
      expect(screen.getByText('CareerCopilot')).toBeInTheDocument();
    });

    test('renders both logo and brand', () => {
      render(
        <M3Navbar
          logo={<span>Logo</span>}
          brand="Brand"
        />
      );
      expect(screen.getByText('Logo')).toBeInTheDocument();
      expect(screen.getByText('Brand')).toBeInTheDocument();
    });
  });

  // Menu Items Tests
  describe('Menu Items', () => {
    test('renders menu items', () => {
      render(<M3Navbar menuItems={mockMenuItems} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('renders menu item icons', () => {
      render(<M3Navbar menuItems={mockMenuItems} />);
      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument();
    });

    test('renders menu item badges', () => {
      render(<M3Navbar menuItems={mockMenuItems} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('applies active class to active menu item', () => {
      const { container } = render(
        <M3Navbar menuItems={mockMenuItems} />
      );
      const activeItem = container.querySelector(
        '.m3-navbar__menu-item--active'
      );
      expect(activeItem).toBeInTheDocument();
      expect(activeItem).toHaveTextContent('Dashboard');
    });

    test('sets aria-current on active menu item', () => {
      render(<M3Navbar menuItems={mockMenuItems} />);
      const dashboardItem = screen.getByTestId('m3-navbar-menu-item-dashboard');
      expect(dashboardItem).toHaveAttribute('aria-current', 'page');
    });

    test('applies disabled class to disabled menu item', () => {
      const { container } = render(
        <M3Navbar menuItems={mockMenuItems} />
      );
      const disabledItem = container.querySelector(
        '.m3-navbar__menu-item--disabled'
      );
      expect(disabledItem).toBeInTheDocument();
    });

    test('calls onMenuItemClick when menu item is clicked', () => {
      const handleMenuItemClick = jest.fn();
      render(
        <M3Navbar
          menuItems={mockMenuItems}
          onMenuItemClick={handleMenuItemClick}
        />
      );
      const homeItem = screen.getByTestId('m3-navbar-menu-item-home');
      fireEvent.click(homeItem);
      expect(handleMenuItemClick).toHaveBeenCalledTimes(1);
      expect(handleMenuItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'home' })
      );
    });

    test('calls item onClick handler when provided', () => {
      const handleItemClick = jest.fn();
      const itemsWithHandler: M3NavbarMenuItem[] = [
        {
          id: 'test',
          label: 'Test',
          path: '/test',
          onClick: handleItemClick,
        },
      ];
      render(
        <M3Navbar menuItems={itemsWithHandler} />
      );
      const testItem = screen.getByTestId('m3-navbar-menu-item-test');
      fireEvent.click(testItem);
      expect(handleItemClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled item is clicked', () => {
      const handleMenuItemClick = jest.fn();
      render(
        <M3Navbar
          menuItems={mockMenuItems}
          onMenuItemClick={handleMenuItemClick}
        />
      );
      const settingsItem = screen.getByTestId('m3-navbar-menu-item-settings');
      fireEvent.click(settingsItem);
      expect(handleMenuItemClick).not.toHaveBeenCalled();
    });
  });

  // User Menu Tests
  describe('User Menu', () => {
    test('renders user menu button', () => {
      render(<M3Navbar userMenu={mockUserMenu} />);
      expect(screen.getByTestId('m3-navbar-user-button')).toBeInTheDocument();
    });

    test('renders user name', () => {
      render(<M3Navbar userMenu={mockUserMenu} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    test('renders user avatar as image', () => {
      const userMenuWithAvatar: M3NavbarUserMenu = {
        ...mockUserMenu,
        avatar: '/avatar.jpg',
      };
      const { container } = render(<M3Navbar userMenu={userMenuWithAvatar} />);
      const avatarContainer = container.querySelector('.m3-navbar__user-avatar');
      expect(avatarContainer).toBeInTheDocument();
      // The avatar should be rendered inside the user button
      const userButton = screen.getByTestId('m3-navbar-user-button');
      const avatarImg = userButton.querySelector('img');
      expect(avatarImg).toBeInTheDocument();
      expect(avatarImg).toHaveAttribute('src', '/avatar.jpg');
      expect(avatarImg).toHaveAttribute('alt', 'John Doe');
    });

    test('renders user avatar as React node', () => {
      const userMenuWithAvatar: M3NavbarUserMenu = {
        ...mockUserMenu,
        avatar: <span data-testid="avatar">Avatar</span>,
      };
      render(<M3Navbar userMenu={userMenuWithAvatar} />);
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    test('renders default avatar with first letter when no avatar provided', () => {
      render(<M3Navbar userMenu={mockUserMenu} />);
      const avatar = document.querySelector('.m3-navbar__user-avatar--default');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent('J');
    });

    test('opens user dropdown when user button is clicked', () => {
      render(<M3Navbar userMenu={mockUserMenu} />);
      const userButton = screen.getByTestId('m3-navbar-user-button');
      fireEvent.click(userButton);
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('closes user dropdown when clicking outside', async () => {
      render(
        <div>
          <M3Navbar userMenu={mockUserMenu} />
          <div data-testid="outside">Outside</div>
        </div>
      );
      const userButton = screen.getByTestId('m3-navbar-user-button');
      fireEvent.click(userButton);
      expect(screen.getByText('Profile')).toBeInTheDocument();

      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);
      
      await waitFor(() => {
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
      });
    });

    test('renders user email in dropdown', () => {
      render(<M3Navbar userMenu={mockUserMenu} />);
      const userButton = screen.getByTestId('m3-navbar-user-button');
      fireEvent.click(userButton);
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    test('calls onUserMenuItemClick when user menu item is clicked', () => {
      const handleUserMenuItemClick = jest.fn();
      render(
        <M3Navbar
          userMenu={mockUserMenu}
          onUserMenuItemClick={handleUserMenuItemClick}
        />
      );
      const userButton = screen.getByTestId('m3-navbar-user-button');
      fireEvent.click(userButton);
      
      const profileItem = screen.getByTestId('m3-navbar-user-menu-item-profile');
      fireEvent.click(profileItem);
      
      expect(handleUserMenuItemClick).toHaveBeenCalledTimes(1);
      expect(handleUserMenuItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'profile' })
      );
    });

    test('closes dropdown after clicking user menu item', () => {
      render(<M3Navbar userMenu={mockUserMenu} />);
      const userButton = screen.getByTestId('m3-navbar-user-button');
      fireEvent.click(userButton);
      
      const profileItem = screen.getByTestId('m3-navbar-user-menu-item-profile');
      fireEvent.click(profileItem);
      
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });

    test('sets aria-expanded on user button', () => {
      render(<M3Navbar userMenu={mockUserMenu} />);
      const userButton = screen.getByTestId('m3-navbar-user-button');
      expect(userButton).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(userButton);
      expect(userButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // Mobile Menu Tests
  describe('Mobile Menu', () => {
    test('renders mobile menu toggle button', () => {
      render(<M3Navbar menuItems={mockMenuItems} />);
      expect(screen.getByTestId('m3-navbar-mobile-toggle')).toBeInTheDocument();
    });

    test('does not render mobile toggle when showMobileMenu is false', () => {
      render(
        <M3Navbar menuItems={mockMenuItems} showMobileMenu={false} />
      );
      expect(
        screen.queryByTestId('m3-navbar-mobile-toggle')
      ).not.toBeInTheDocument();
    });

    test('opens mobile menu when toggle is clicked', () => {
      render(<M3Navbar menuItems={mockMenuItems} />);
      const toggle = screen.getByTestId('m3-navbar-mobile-toggle');
      fireEvent.click(toggle);
      
      expect(screen.getByTestId('m3-navbar-mobile-menu-item-home')).toBeInTheDocument();
    });

    test('closes mobile menu when menu item is clicked', () => {
      const handleMenuItemClick = jest.fn();
      render(
        <M3Navbar
          menuItems={mockMenuItems}
          onMenuItemClick={handleMenuItemClick}
        />
      );
      const toggle = screen.getByTestId('m3-navbar-mobile-toggle');
      fireEvent.click(toggle);
      
      const homeItem = screen.getByTestId('m3-navbar-mobile-menu-item-home');
      fireEvent.click(homeItem);
      
      expect(handleMenuItemClick).toHaveBeenCalled();
      expect(screen.queryByTestId('m3-navbar-mobile-menu-item-home')).not.toBeInTheDocument();
    });

    test('toggles mobile menu open/closed', () => {
      render(<M3Navbar menuItems={mockMenuItems} />);
      const toggle = screen.getByTestId('m3-navbar-mobile-toggle');
      
      // Open
      fireEvent.click(toggle);
      expect(screen.getByTestId('m3-navbar-mobile-menu-item-home')).toBeInTheDocument();
      
      // Close
      fireEvent.click(toggle);
      expect(
        screen.queryByTestId('m3-navbar-mobile-menu-item-home')
      ).not.toBeInTheDocument();
    });

    test('sets aria-expanded on mobile toggle', () => {
      render(<M3Navbar menuItems={mockMenuItems} />);
      const toggle = screen.getByTestId('m3-navbar-mobile-toggle');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // Responsive Behavior Tests
  describe('Responsive Behavior', () => {
    test('applies mobile-open class when mobile menu is open', () => {
      const { container } = render(
        <M3Navbar menuItems={mockMenuItems} />
      );
      const toggle = screen.getByTestId('m3-navbar-mobile-toggle');
      fireEvent.click(toggle);
      
      const navbar = container.querySelector('.m3-navbar--mobile-open');
      expect(navbar).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    test('has navigation role', () => {
      render(<M3Navbar />);
      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
    });

    test('has aria-label on navigation', () => {
      render(<M3Navbar />);
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveAttribute('aria-label', 'Main navigation');
    });

    test('mobile toggle has aria-label', () => {
      render(<M3Navbar menuItems={mockMenuItems} />);
      const toggle = screen.getByTestId('m3-navbar-mobile-toggle');
      expect(toggle).toHaveAttribute('aria-label', 'Toggle mobile menu');
    });

    test('user button has aria-haspopup', () => {
      render(<M3Navbar userMenu={mockUserMenu} />);
      const userButton = screen.getByTestId('m3-navbar-user-button');
      expect(userButton).toHaveAttribute('aria-haspopup', 'true');
    });

    test('icons have aria-hidden', () => {
      const { container } = render(
        <M3Navbar menuItems={mockMenuItems} />
      );
      const icons = container.querySelectorAll('.m3-navbar__menu-icon');
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  // Ref Forwarding Tests
  describe('Ref Forwarding', () => {
    test('forwards ref to nav element', () => {
      const ref = React.createRef<HTMLElement>();
      render(<M3Navbar ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('NAV');
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    test('renders without menu items', () => {
      render(<M3Navbar brand="Test" />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    test('renders without user menu', () => {
      render(<M3Navbar menuItems={mockMenuItems} />);
      expect(screen.queryByTestId('m3-navbar-user-button')).not.toBeInTheDocument();
    });

    test('renders without logo', () => {
      render(<M3Navbar brand="Test" />);
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(document.querySelector('.m3-navbar__logo')).not.toBeInTheDocument();
    });

    test('handles empty menu items array', () => {
      render(<M3Navbar menuItems={[]} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    test('handles user menu without email', () => {
      const userMenuWithoutEmail: M3NavbarUserMenu = {
        name: 'John Doe',
        items: mockUserMenu.items,
      };
      render(<M3Navbar userMenu={userMenuWithoutEmail} />);
      const userButton = screen.getByTestId('m3-navbar-user-button');
      fireEvent.click(userButton);
      
      // Should not render email section
      expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
    });
  });
});
