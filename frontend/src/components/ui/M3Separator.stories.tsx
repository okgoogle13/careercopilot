import type { Meta, StoryObj } from '@storybook/react';
import { M3Separator } from './M3Separator';

const meta: Meta<typeof M3Separator> = {
  title: 'M3/Utility/Separator',
  component: M3Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Separator>;

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>Item 1</span>
      <M3Separator orientation="vertical" />
      <span>Item 2</span>
      <M3Separator orientation="vertical" />
      <span>Item 3</span>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div>
      <p>Content above separator</p>
      <M3Separator orientation="horizontal" />
      <p>Content below separator</p>
    </div>
  ),
};

export const InBreadcrumbs: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
      <a href="#" style={{ textDecoration: 'none', color: '#1976d2' }}>
        Home
      </a>
      <M3Separator orientation="vertical" />
      <a href="#" style={{ textDecoration: 'none', color: '#1976d2' }}>
        Products
      </a>
      <M3Separator orientation="vertical" />
      <span>Details</span>
    </div>
  ),
};

export const InToolbar: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <button style={{ padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Action 1
      </button>
      <button style={{ padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Action 2
      </button>
      <M3Separator orientation="vertical" />
      <button style={{ padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Delete
      </button>
    </div>
  ),
};

export const InMenu: Story = {
  render: () => (
    <div style={{ width: 200, border: '1px solid #ccc', borderRadius: '8px', padding: '4px' }}>
      <div style={{ padding: '8px 12px', cursor: 'pointer' }}>Profile</div>
      <div style={{ padding: '8px 12px', cursor: 'pointer' }}>Settings</div>
      <M3Separator orientation="horizontal" />
      <div style={{ padding: '8px 12px', cursor: 'pointer', color: '#d32f2f' }}>Logout</div>
    </div>
  ),
};

export const InlineText: Story = {
  render: () => (
    <div style={{ fontSize: '14px' }}>
      <span>Author: John Doe</span>
      <M3Separator orientation="vertical" />
      <span>Date: 2024-01-15</span>
      <M3Separator orientation="vertical" />
      <span>5 min read</span>
    </div>
  ),
};

export const TagList: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
      <span
        style={{
          padding: '4px 12px',
          backgroundColor: '#e0e0e0',
          borderRadius: '16px',
          fontSize: '12px',
        }}
      >
        React
      </span>
      <M3Separator orientation="vertical" />
      <span
        style={{
          padding: '4px 12px',
          backgroundColor: '#e0e0e0',
          borderRadius: '16px',
          fontSize: '12px',
        }}
      >
        TypeScript
      </span>
      <M3Separator orientation="vertical" />
      <span
        style={{
          padding: '4px 12px',
          backgroundColor: '#e0e0e0',
          borderRadius: '16px',
          fontSize: '12px',
        }}
      >
        Material Design
      </span>
    </div>
  ),
};

export const Footer: Story = {
  render: () => (
    <footer style={{ padding: '24px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', gap: '4px' }}>
        <a href="#" style={{ textDecoration: 'none', color: '#666' }}>
          About
        </a>
        <M3Separator orientation="vertical" />
        <a href="#" style={{ textDecoration: 'none', color: '#666' }}>
          Privacy
        </a>
        <M3Separator orientation="vertical" />
        <a href="#" style={{ textDecoration: 'none', color: '#666' }}>
          Terms
        </a>
        <M3Separator orientation="vertical" />
        <a href="#" style={{ textDecoration: 'none', color: '#666' }}>
          Contact
        </a>
      </div>
      <M3Separator orientation="horizontal" />
      <div style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>
        © 2024 Company Name. All rights reserved.
      </div>
    </footer>
  ),
};

export const Metadata: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px',
        color: '#666',
        padding: '12px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: '16px', height: '16px', marginRight: '4px' }}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
      <span>Published</span>
      <M3Separator orientation="vertical" />
      <span>1,234 views</span>
      <M3Separator orientation="vertical" />
      <span>45 comments</span>
    </div>
  ),
};

export const MixedOrientations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Vertical Separators</h4>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>One</span>
          <M3Separator orientation="vertical" />
          <span>Two</span>
          <M3Separator orientation="vertical" />
          <span>Three</span>
        </div>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Horizontal Separator</h4>
        <p style={{ margin: '0 0 8px 0' }}>Content above</p>
        <M3Separator orientation="horizontal" />
        <p style={{ margin: '8px 0 0 0' }}>Content below</p>
      </div>
    </div>
  ),
};
