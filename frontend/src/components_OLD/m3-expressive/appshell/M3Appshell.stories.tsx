import type { Meta, StoryObj } from '@storybook/react';
import { M3Appshell } from './M3Appshell';

/**
 * M3 Expressive AppShell Component
 *
 * Implements Material Design 3 page wrapper/container.
 * Use as the main layout component for entire pages.
 *
 * Features:
 * - Navbar slot (top)
 * - Sidebar slot (left)
 * - Main content area
 * - Flex layout for responsive design
 * - Proper spacing throughout
 * - Fixed or relative sidebar positioning
 */

const meta: Meta<typeof M3Appshell> = {
  component: M3Appshell,
  title: 'M3 Expressive/AppShell',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    sidebarWidth: {
      control: 'text',
      description: 'Width of the sidebar',
    },
    fixedSidebar: {
      control: 'boolean',
      description: 'If true, sidebar is fixed on desktop',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Appshell>;

/**
 * Default AppShell (Main Content Only)
 */
export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: '24px' }}>
        <h1>Main Content</h1>
        <p>This is the main content area.</p>
      </div>
    ),
  },
};

/**
 * With Navbar
 */
export const WithNavbar: Story = {
  args: {
    navbar: (
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        }}
      >
        <strong>Navbar</strong>
      </div>
    ),
    children: (
      <div style={{ padding: '24px' }}>
        <h1>Page Content</h1>
        <p>Content with navbar at the top.</p>
      </div>
    ),
  },
};

/**
 * With Sidebar
 */
export const WithSidebar: Story = {
  args: {
    sidebar: (
      <div style={{ padding: '24px' }}>
        <h2>Sidebar</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>Home</li>
            <li style={{ marginBottom: '8px' }}>Dashboard</li>
            <li style={{ marginBottom: '8px' }}>Settings</li>
          </ul>
        </nav>
      </div>
    ),
    children: (
      <div style={{ padding: '24px' }}>
        <h1>Page Content</h1>
        <p>Content with sidebar on the left.</p>
      </div>
    ),
  },
};

/**
 * With Navbar and Sidebar
 */
export const WithNavbarAndSidebar: Story = {
  args: {
    navbar: (
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        }}
      >
        <strong>Navbar</strong>
      </div>
    ),
    sidebar: (
      <div style={{ padding: '24px' }}>
        <h2>Sidebar</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>Home</li>
            <li style={{ marginBottom: '8px' }}>Dashboard</li>
            <li style={{ marginBottom: '8px' }}>Settings</li>
          </ul>
        </nav>
      </div>
    ),
    children: (
      <div style={{ padding: '24px' }}>
        <h1>Page Content</h1>
        <p>Complete layout with navbar and sidebar.</p>
      </div>
    ),
  },
};

/**
 * Fixed Sidebar
 */
export const FixedSidebar: Story = {
  args: {
    fixedSidebar: true,
    sidebar: (
      <div style={{ padding: '24px' }}>
        <h2>Fixed Sidebar</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>Home</li>
            <li style={{ marginBottom: '8px' }}>Dashboard</li>
            <li style={{ marginBottom: '8px' }}>Settings</li>
          </ul>
        </nav>
      </div>
    ),
    children: (
      <div style={{ padding: '24px' }}>
        <h1>Page Content</h1>
        <p>This sidebar is fixed on desktop.</p>
        <div style={{ height: '200vh' }}>
          <p>Scroll to see the sidebar stays fixed.</p>
        </div>
      </div>
    ),
  },
};

/**
 * Relative Sidebar
 */
export const RelativeSidebar: Story = {
  args: {
    fixedSidebar: false,
    sidebar: (
      <div style={{ padding: '24px' }}>
        <h2>Relative Sidebar</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>Home</li>
            <li style={{ marginBottom: '8px' }}>Dashboard</li>
            <li style={{ marginBottom: '8px' }}>Settings</li>
          </ul>
        </nav>
      </div>
    ),
    children: (
      <div style={{ padding: '24px' }}>
        <h1>Page Content</h1>
        <p>This sidebar scrolls with the content.</p>
      </div>
    ),
  },
};

/**
 * Custom Sidebar Width
 */
export const CustomSidebarWidth: Story = {
  args: {
    sidebarWidth: '320px',
    sidebar: (
      <div style={{ padding: '24px' }}>
        <h2>Wide Sidebar</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>Home</li>
            <li style={{ marginBottom: '8px' }}>Dashboard</li>
            <li style={{ marginBottom: '8px' }}>Settings</li>
          </ul>
        </nav>
      </div>
    ),
    children: (
      <div style={{ padding: '24px' }}>
        <h1>Page Content</h1>
        <p>Sidebar has custom width of 320px.</p>
      </div>
    ),
  },
};

/**
 * Full Example
 */
export const FullExample: Story = {
  args: {
    navbar: (
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          borderBottom: '1px solid var(--md-sys-color-outline-variant)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <strong>CareerCopilot</strong>
        <div>
          <button style={{ marginLeft: '8px' }}>Profile</button>
        </div>
      </div>
    ),
    sidebar: (
      <div style={{ padding: '24px' }}>
        <h2 style={{ marginTop: 0 }}>Navigation</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '12px', padding: '8px', borderRadius: '4px', backgroundColor: 'var(--md-sys-color-primary-container)' }}>
              <strong>Home</strong>
            </li>
            <li style={{ marginBottom: '12px', padding: '8px' }}>Dashboard</li>
            <li style={{ marginBottom: '12px', padding: '8px' }}>Documents</li>
            <li style={{ marginBottom: '12px', padding: '8px' }}>Settings</li>
          </ul>
        </nav>
      </div>
    ),
    children: (
      <div style={{ padding: '24px' }}>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard. This is a complete example of the AppShell component.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: '8px' }}>
            <h3>Card 1</h3>
            <p>Content</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: '8px' }}>
            <h3>Card 2</h3>
            <p>Content</p>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--md-sys-color-surface-container)', borderRadius: '8px' }}>
            <h3>Card 3</h3>
            <p>Content</p>
          </div>
        </div>
      </div>
    ),
  },
};

/**
 * Long Content (Scroll Test)
 */
export const LongContent: Story = {
  args: {
    navbar: (
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          borderBottom: '1px solid var(--md-sys-color-outline-variant)',
        }}
      >
        <strong>Navbar</strong>
      </div>
    ),
    sidebar: (
      <div style={{ padding: '24px' }}>
        <h2>Sidebar</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Array.from({ length: 20 }, (_, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                Item {i + 1}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    ),
    children: (
      <div style={{ padding: '24px' }}>
        <h1>Long Content</h1>
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i}>Paragraph {i + 1} - This is a long content example to test scrolling behavior.</p>
        ))}
      </div>
    ),
  },
};
