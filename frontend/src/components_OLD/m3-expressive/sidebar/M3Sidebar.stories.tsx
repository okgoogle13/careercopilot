import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { M3Sidebar, type M3SidebarNavItem } from './M3Sidebar';

/**
 * M3 Expressive Sidebar Component
 *
 * Implements Material Design 3 navigation sidebar.
 * Use for main navigation, secondary navigation, and hierarchical menus.
 *
 * Features:
 * - Active state indicators
 * - Icon support
 * - Badge/notification support
 * - Collapsible sections
 * - Keyboard navigation
 * - Responsive design
 */

const meta: Meta<typeof M3Sidebar> = {
  component: M3Sidebar,
  title: 'M3 Expressive/Sidebar',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: false,
      description: 'Array of navigation items',
    },
    activeItemId: {
      control: 'text',
      description: 'Currently active item ID',
    },
    collapsed: {
      control: 'boolean',
      description: 'If true, sidebar is collapsed to icon-only mode',
    },
    width: {
      control: 'text',
      description: 'Width of the sidebar',
    },
    onItemClick: {
      action: 'item clicked',
      description: 'Callback when a nav item is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Sidebar>;

const basicItems: M3SidebarNavItem[] = [
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

const itemsWithBadges: M3SidebarNavItem[] = [
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
  {
    id: 'tasks',
    label: 'Tasks',
    icon: <span>✅</span>,
    path: '/tasks',
    badge: 5,
  },
];

const itemsWithNested: M3SidebarNavItem[] = [
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
      {
        id: 'reports',
        label: 'Reports',
        path: '/dashboard/reports',
      },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <span>📁</span>,
    path: '/documents',
    children: [
      {
        id: 'all-documents',
        label: 'All Documents',
        path: '/documents/all',
      },
      {
        id: 'recent',
        label: 'Recent',
        path: '/documents/recent',
      },
      {
        id: 'shared',
        label: 'Shared',
        path: '/documents/shared',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <span>⚙️</span>,
    path: '/settings',
  },
];

const itemsWithDisabled: M3SidebarNavItem[] = [
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
];

/**
 * Default Sidebar
 */
export const Default: Story = {
  args: {
    items: basicItems,
    activeItemId: 'home',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * With Active State
 */
export const WithActiveState: Story = {
  args: {
    items: basicItems,
    activeItemId: 'dashboard',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * With Badges
 */
export const WithBadges: Story = {
  args: {
    items: itemsWithBadges,
    activeItemId: 'home',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * With Nested Items
 */
export const WithNestedItems: Story = {
  args: {
    items: itemsWithNested,
    activeItemId: 'dashboard',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * With Disabled Items
 */
export const WithDisabledItems: Story = {
  args: {
    items: itemsWithDisabled,
    activeItemId: 'home',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Collapsed State
 */
export const Collapsed: Story = {
  args: {
    items: basicItems,
    activeItemId: 'home',
    collapsed: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Custom Width
 */
export const CustomWidth: Story = {
  args: {
    items: basicItems,
    activeItemId: 'home',
    width: '320px',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Interactive Sidebar
 */
export const Interactive: Story = {
  render: () => {
    const [activeId, setActiveId] = useState<string>('home');
    
    return (
      <div style={{ height: '600px', display: 'flex' }}>
        <M3Sidebar
          items={basicItems}
          activeItemId={activeId}
          onItemClick={(item) => {
            setActiveId(item.id);
            console.log('Clicked:', item);
          }}
        />
      </div>
    );
  },
};

/**
 * Complex Navigation
 */
export const ComplexNavigation: Story = {
  args: {
    items: [
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
        badge: 2,
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
      {
        id: 'messages',
        label: 'Messages',
        icon: <span>💬</span>,
        path: '/messages',
        badge: 5,
      },
      {
        id: 'documents',
        label: 'Documents',
        icon: <span>📁</span>,
        path: '/documents',
        children: [
          {
            id: 'all',
            label: 'All Documents',
            path: '/documents/all',
          },
          {
            id: 'recent',
            label: 'Recent',
            path: '/documents/recent',
          },
        ],
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <span>⚙️</span>,
        path: '/settings',
      },
      {
        id: 'help',
        label: 'Help',
        icon: <span>❓</span>,
        path: '/help',
        disabled: true,
      },
    ],
    activeItemId: 'dashboard',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Full Example
 */
export const FullExample: Story = {
  render: () => {
    const [activeId, setActiveId] = useState<string>('home');
    const [collapsed, setCollapsed] = useState(false);

    const fullItems: M3SidebarNavItem[] = [
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
        badge: 3,
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
      {
        id: 'messages',
        label: 'Messages',
        icon: <span>💬</span>,
        path: '/messages',
        badge: 12,
      },
      {
        id: 'documents',
        label: 'Documents',
        icon: <span>📁</span>,
        path: '/documents',
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <span>⚙️</span>,
        path: '/settings',
      },
    ];

    return (
      <div style={{ height: '600px', display: 'flex', gap: '16px' }}>
        <M3Sidebar
          items={fullItems}
          activeItemId={activeId}
          collapsed={collapsed}
          onItemClick={(item) => {
            if (!item.children) {
              setActiveId(item.id);
            }
          }}
        />
        <div style={{ flex: 1, padding: '24px' }}>
          <h2>Content Area</h2>
          <p>Active Item: {activeId}</p>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              padding: '8px 16px',
              marginTop: '16px',
              cursor: 'pointer',
            }}
          >
            {collapsed ? 'Expand' : 'Collapse'} Sidebar
          </button>
        </div>
      </div>
    );
  },
};
