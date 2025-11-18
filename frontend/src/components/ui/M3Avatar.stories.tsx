import type { Meta, StoryObj } from '@storybook/react';
import { M3Avatar } from './M3Avatar';

const meta: Meta<typeof M3Avatar> = {
  title: 'M3/Utility/Avatar',
  component: M3Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'xlarge'],
    },
    variant: {
      control: 'select',
      options: ['circular', 'rounded', 'square'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Avatar>;

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: 'User Avatar',
  },
};

export const WithInitials: Story = {
  args: {
    children: 'JD',
  },
};

export const WithIcon: Story = {
  render: () => (
    <M3Avatar>
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '60%', height: '60%' }}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </M3Avatar>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <M3Avatar size="small" src="https://i.pravatar.cc/150?img=2" alt="Small" />
      <M3Avatar size="medium" src="https://i.pravatar.cc/150?img=3" alt="Medium" />
      <M3Avatar size="large" src="https://i.pravatar.cc/150?img=4" alt="Large" />
      <M3Avatar size="xlarge" src="https://i.pravatar.cc/150?img=5" alt="Extra Large" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <M3Avatar variant="circular" src="https://i.pravatar.cc/150?img=6" alt="Circular" />
      <M3Avatar variant="rounded" src="https://i.pravatar.cc/150?img=7" alt="Rounded" />
      <M3Avatar variant="square" src="https://i.pravatar.cc/150?img=8" alt="Square" />
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <M3Avatar color="primary">AB</M3Avatar>
      <M3Avatar color="secondary">CD</M3Avatar>
      <M3Avatar color="tertiary">EF</M3Avatar>
      <M3Avatar color="error">GH</M3Avatar>
    </div>
  ),
};

export const InitialsGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '16px', justifyContent: 'start' }}>
      <M3Avatar color="primary">AB</M3Avatar>
      <M3Avatar color="secondary">CD</M3Avatar>
      <M3Avatar color="tertiary">EF</M3Avatar>
      <M3Avatar color="error">GH</M3Avatar>
      <M3Avatar color="primary">IJ</M3Avatar>
      <M3Avatar color="secondary">KL</M3Avatar>
      <M3Avatar color="tertiary">MN</M3Avatar>
      <M3Avatar color="error">OP</M3Avatar>
    </div>
  ),
};

export const ImageFallback: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <M3Avatar src="https://invalid-url.com/image.jpg" alt="Broken Image">
        FB
      </M3Avatar>
      <M3Avatar src="https://invalid-url.com/image.jpg" alt="Broken Image with Icon">
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '60%', height: '60%' }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
      </M3Avatar>
    </div>
  ),
};

export const UserList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[
        { name: 'Alice Brown', initials: 'AB', color: 'primary' },
        { name: 'Bob Smith', initials: 'BS', color: 'secondary' },
        { name: 'Carol Davis', initials: 'CD', color: 'tertiary' },
        { name: 'David Wilson', initials: 'DW', color: 'error' },
      ].map((user) => (
        <div key={user.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <M3Avatar color={user.color as any}>{user.initials}</M3Avatar>
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', marginLeft: '8px' }}>
      {[1, 2, 3, 4].map((num) => (
        <M3Avatar
          key={num}
          src={`https://i.pravatar.cc/150?img=${num + 10}`}
          alt={`User ${num}`}
          style={{ marginLeft: '-8px', border: '2px solid white' }}
        />
      ))}
      <M3Avatar
        color="secondary"
        style={{ marginLeft: '-8px', border: '2px solid white' }}
      >
        +5
      </M3Avatar>
    </div>
  ),
};

export const LargeProfile: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px' }}>
      <M3Avatar size="xlarge" src="https://i.pravatar.cc/150?img=20" alt="Profile Picture" />
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 4px 0' }}>John Doe</h3>
        <p style={{ margin: 0, color: '#666' }}>Software Engineer</p>
      </div>
    </div>
  ),
};

export const CustomIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <M3Avatar color="primary">
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '60%', height: '60%' }}>
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      </M3Avatar>
      <M3Avatar color="secondary">
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '60%', height: '60%' }}>
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      </M3Avatar>
      <M3Avatar color="tertiary">
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '60%', height: '60%' }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </M3Avatar>
    </div>
  ),
};
