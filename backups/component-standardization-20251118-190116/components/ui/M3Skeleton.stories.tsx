import type { Meta, StoryObj } from '@storybook/react';
import { M3Skeleton } from './M3Skeleton';

const meta: Meta<typeof M3Skeleton> = {
  title: 'M3/Feedback/Skeleton',
  component: M3Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'rectangular', 'circular', 'rounded'],
    },
    animation: {
      control: 'select',
      options: [false, 'pulse', 'wave'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
    width: '100%',
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 100,
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 40,
    height: 40,
  },
};

export const Rounded: Story = {
  args: {
    variant: 'rounded',
    width: 200,
    height: 100,
  },
};

export const TextVariations: Story = {
  render: () => (
    <div style={{ width: '100%' }}>
      <M3Skeleton variant="text" width="100%" />
      <M3Skeleton variant="text" width="80%" />
      <M3Skeleton variant="text" width="60%" />
      <M3Skeleton variant="text" width="40%" />
    </div>
  ),
};

export const Avatar: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <M3Skeleton variant="circular" width={40} height={40} />
      <div style={{ flex: 1 }}>
        <M3Skeleton variant="text" width="60%" />
        <M3Skeleton variant="text" width="40%" />
      </div>
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div style={{ width: 300, border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px' }}>
      <M3Skeleton variant="rectangular" width="100%" height={200} />
      <div style={{ marginTop: '16px' }}>
        <M3Skeleton variant="text" width="60%" />
        <M3Skeleton variant="text" width="80%" />
        <M3Skeleton variant="text" width="40%" />
      </div>
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div style={{ width: '100%' }}>
      {[1, 2, 3, 4].map((item) => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <M3Skeleton variant="circular" width={40} height={40} />
          <div style={{ flex: 1 }}>
            <M3Skeleton variant="text" width="70%" />
            <M3Skeleton variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const PulseAnimation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <M3Skeleton variant="text" width="100%" animation="pulse" />
      <M3Skeleton variant="rectangular" width="100%" height={100} animation="pulse" />
      <M3Skeleton variant="circular" width={40} height={40} animation="pulse" />
    </div>
  ),
};

export const WaveAnimation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <M3Skeleton variant="text" width="100%" animation="wave" />
      <M3Skeleton variant="rectangular" width="100%" height={100} animation="wave" />
      <M3Skeleton variant="circular" width={40} height={40} animation="wave" />
    </div>
  ),
};

export const NoAnimation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <M3Skeleton variant="text" width="100%" animation={false} />
      <M3Skeleton variant="rectangular" width="100%" height={100} animation={false} />
      <M3Skeleton variant="circular" width={40} height={40} animation={false} />
    </div>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <div style={{ width: 300 }}>
      <M3Skeleton>
        <img
          src="https://via.placeholder.com/300x200"
          alt="Placeholder"
          style={{ width: '100%', height: 'auto' }}
        />
      </M3Skeleton>
    </div>
  ),
};

export const BlogPost: Story = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <M3Skeleton variant="rectangular" width="100%" height={300} />
      <div style={{ marginTop: '16px' }}>
        <M3Skeleton variant="text" width="40%" height={32} />
        <M3Skeleton variant="text" width="100%" />
        <M3Skeleton variant="text" width="100%" />
        <M3Skeleton variant="text" width="80%" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
        <M3Skeleton variant="circular" width={48} height={48} />
        <div style={{ flex: 1 }}>
          <M3Skeleton variant="text" width="30%" />
          <M3Skeleton variant="text" width="20%" />
        </div>
      </div>
    </div>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <div style={{ maxWidth: 400, border: '1px solid #e0e0e0', borderRadius: '8px', padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <M3Skeleton variant="circular" width={80} height={80} />
        <M3Skeleton variant="text" width="60%" height={24} />
        <M3Skeleton variant="text" width="40%" />
      </div>
      <div style={{ marginTop: '24px' }}>
        <M3Skeleton variant="text" width="100%" />
        <M3Skeleton variant="text" width="100%" />
        <M3Skeleton variant="text" width="80%" />
      </div>
      <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
        <M3Skeleton variant="rounded" width="100%" height={40} />
        <M3Skeleton variant="rounded" width="100%" height={40} />
      </div>
    </div>
  ),
};
