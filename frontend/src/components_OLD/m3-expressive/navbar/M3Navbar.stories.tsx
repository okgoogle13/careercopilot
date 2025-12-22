import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3Navbar, type M3NavbarMenuItem, type M3NavbarUserMenu } from './M3Navbar';

/**
 * M3 Expressive Navbar Component
 *
 * Implements Material Design 3 top navigation bar.
 * Use for main application navigation with logo, menu items, and user menu.
 *
 * Features:
 * - Logo/branding area
 * - Menu items with icons and badges
 * - User menu with dropdown
 * - Responsive mobile menu
 * - Active state indicators
 * - Keyboard navigation
 */

const meta: Meta<typeof M3Navbar> = {
  component: M3Navbar,
  title: 'M3 Expressive/Navbar',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    logo: {
      control: false,
      description: 'Logo element (React node or image URL)',
    },
    brand: {
      control: 'text',
      description: 'Brand text to display next to logo',
    },
    menuItems: {
      control: false,
      description: 'Array of navigation menu items',
    },
    userMenu: {
      control: false,
      description: 'User menu configuration',
    },
    showMobileMenu: {
      control: 'boolean',
      description: 'If true, show mobile menu button',
    },
    onMenuItemClick: {
      action: 'menu item clicked',
      description: 'Callback when a menu item is clicked',
    },
    onUserMenuItemClick: {
      action: 'user menu item clicked',
      description: 'Callback when a user menu item is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Navbar>;

const basicMenuItems: M3NavbarMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <span>🏠</span>,
    path: '/home',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <span>📊</span>,
    path: '/dashboard',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <span>⚙️</span>,
    path: '/settings',
  },
];

const menuItemsWithActive: M3NavbarMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <span>🏠</span>,
    path: '/home',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <span>📊</span>,
    path: '/dashboard',
    active: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <span>⚙️</span>,
    path: '/settings',
  },
];

const menuItemsWithBadges: M3NavbarMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <span>🏠</span>,
    path: '/home',
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: <span>💬</span>,
    path: '/messages',
    badge: 3,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <span>🔔</span>,
    path: '/notifications',
    badge: 12,
  },
];

const userMenu: M3NavbarUserMenu = {
  name: 'John Doe',
  email: 'john.doe@example.com',
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
      icon: <span>⚙️</span>,
      path: '/settings',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <span>🚪</span>,
      path: '/logout',
    },
  ],
};

/**
 * Default Navbar
 */
export const Default: Story = {
  args: {
    brand: 'CareerCopilot',
    menuItems: basicMenuItems,
  },
};

/**
 * With Logo
 */
export const WithLogo: Story = {
  args: {
    logo: <span style={{ fontSize: '24px' }}>🚀</span>,
    brand: 'CareerCopilot',
    menuItems: basicMenuItems,
  },
};

/**
 * With Active Item
 */
export const WithActiveItem: Story = {
  args: {
    brand: 'CareerCopilot',
    menuItems: menuItemsWithActive,
  },
};

/**
 * With Badges
 */
export const WithBadges: Story = {
  args: {
    brand: 'CareerCopilot',
    menuItems: menuItemsWithBadges,
  },
};

/**
 * With User Menu
 */
export const WithUserMenu: Story = {
  args: {
    brand: 'CareerCopilot',
    menuItems: basicMenuItems,
    userMenu: userMenu,
  },
};

/**
 * With User Avatar
 */
export const WithUserAvatar: Story = {
  args: {
    brand: 'CareerCopilot',
    menuItems: basicMenuItems,
    userMenu: {
      ...userMenu,
      avatar: 'https://via.placeholder.com/32',
    },
  },
};

/**
 * Complete Navbar
 */
export const Complete: Story = {
  args: {
    logo: <span style={{ fontSize: '24px' }}>🚀</span>,
    brand: 'CareerCopilot',
    menuItems: menuItemsWithBadges,
    userMenu: userMenu,
  },
};

/**
 * Without Menu Items
 */
export const WithoutMenuItems: Story = {
  args: {
    brand: 'CareerCopilot',
    userMenu: userMenu,
  },
};

/**
 * Without User Menu
 */
export const WithoutUserMenu: Story = {
  args: {
    brand: 'CareerCopilot',
    menuItems: basicMenuItems,
  },
};

/**
 * Interactive Navbar
 */
export const Interactive: Story = {
  render: () => {
    const [activeId, setActiveId] = useState<string>('home');
    
    const items: M3NavbarMenuItem[] = [
      {
        id: 'home',
        label: 'Home',
        icon: <span>🏠</span>,
        path: '/home',
        active: activeId === 'home',
        onClick: () => setActiveId('home'),
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <span>📊</span>,
        path: '/dashboard',
        active: activeId === 'dashboard',
        onClick: () => setActiveId('dashboard'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <span>⚙️</span>,
        path: '/settings',
        active: activeId === 'settings',
        onClick: () => setActiveId('settings'),
      },
    ];

    return (
      <M3Navbar
        brand="CareerCopilot"
        menuItems={items}
        userMenu={userMenu}
        onMenuItemClick={(item) => {
          console.log('Menu item clicked:', item);
        }}
        onUserMenuItemClick={(item) => {
          console.log('User menu item clicked:', item);
        }}
      />
    );
  },
};

/**
 * Many Menu Items
 */
export const ManyMenuItems: Story = {
  args: {
    brand: 'CareerCopilot',
    menuItems: [
      { id: '1', label: 'Home', icon: <span>🏠</span>, path: '/home' },
      { id: '2', label: 'Dashboard', icon: <span>📊</span>, path: '/dashboard' },
      { id: '3', label: 'Messages', icon: <span>💬</span>, path: '/messages', badge: 5 },
      { id: '4', label: 'Notifications', icon: <span>🔔</span>, path: '/notifications', badge: 12 },
      { id: '5', label: 'Documents', icon: <span>📁</span>, path: '/documents' },
      { id: '6', label: 'Settings', icon: <span>⚙️</span>, path: '/settings' },
    ],
    userMenu: userMenu,
  },
};

/**
 * With Disabled Items
 */
export const WithDisabledItems: Story = {
  args: {
    brand: 'CareerCopilot',
    menuItems: [
      {
        id: 'home',
        label: 'Home',
        icon: <span>🏠</span>,
        path: '/home',
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <span>📊</span>,
        path: '/dashboard',
        disabled: true,
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <span>⚙️</span>,
        path: '/settings',
      },
    ],
  },
};

/**
 * Minimal Navbar
 */
export const Minimal: Story = {
  args: {
    brand: 'CareerCopilot',
  },
};

/**
 * Full Example
 */
export const FullExample: Story = {
  render: () => {
    const [activeId, setActiveId] = useState<string>('dashboard');
    
    const items: M3NavbarMenuItem[] = [
      {
        id: 'home',
        label: 'Home',
        icon: <span>🏠</span>,
        path: '/home',
        active: activeId === 'home',
        onClick: () => setActiveId('home'),
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <span>📊</span>,
        path: '/dashboard',
        active: activeId === 'dashboard',
        badge: 3,
        onClick: () => setActiveId('dashboard'),
      },
      {
        id: 'messages',
        label: 'Messages',
        icon: <span>💬</span>,
        path: '/messages',
        active: activeId === 'messages',
        badge: 12,
        onClick: () => setActiveId('messages'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <span>⚙️</span>,
        path: '/settings',
        active: activeId === 'settings',
        onClick: () => setActiveId('settings'),
      },
    ];

    return (
      <div>
        <M3Navbar
          logo={<span style={{ fontSize: '24px' }}>🚀</span>}
          brand="CareerCopilot"
          menuItems={items}
          userMenu={{
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'https://via.placeholder.com/32',
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
                icon: <span>⚙️</span>,
                path: '/settings',
              },
              {
                id: 'help',
                label: 'Help & Support',
                icon: <span>❓</span>,
                path: '/help',
              },
              {
                id: 'logout',
                label: 'Logout',
                icon: <span>🚪</span>,
                path: '/logout',
              },
            ],
          }}
        />
        <div style={{ padding: '24px' }}>
          <h1>Page Content</h1>
          <p>Active menu item: {activeId}</p>
          <p>This is the main content area below the navbar.</p>
        </div>
      </div>
    );
  },
};
