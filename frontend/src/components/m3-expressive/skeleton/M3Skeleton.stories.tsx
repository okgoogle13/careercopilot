import type { Meta, StoryObj } from '@storybook/react';
import { M3Skeleton } from './M3Skeleton';

const meta: Meta<typeof M3Skeleton> = {
  title: 'M3/Feedback/Skeleton',
  component: M3Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'rectangular', 'circular'],
      description: 'The shape variant of the skeleton',
    },
    width: {
      control: 'text',
      description: 'Width (number in px or string with CSS unit)',
    },
    height: {
      control: 'text',
      description: 'Height (number in px or string with CSS unit)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof M3Skeleton>;

/**
 * Single line of text skeleton
 */
export const TextSingleLine: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <M3Skeleton variant="text" />
    </div>
  ),
};

/**
 * Multiple lines of text skeleton
 */
export const TextMultipleLines: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <M3Skeleton variant="text" />
      <M3Skeleton variant="text" />
      <M3Skeleton variant="text" width="60%" />
    </div>
  ),
};

/**
 * Rectangular skeleton with avatar and text (card layout)
 */
export const RectangularAvatarText: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <M3Skeleton variant="circular" width={40} height={40} />
      <div style={{ flex: 1 }}>
        <M3Skeleton variant="text" width="60%" />
        <M3Skeleton variant="text" width="40%" />
      </div>
    </div>
  ),
};

/**
 * Circular skeleton (avatar placeholder)
 */
export const CircularAvatar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <M3Skeleton variant="circular" width={40} height={40} />
      <M3Skeleton variant="circular" width={60} height={60} />
      <M3Skeleton variant="circular" width={80} height={80} />
    </div>
  ),
};

/**
 * Custom dimensions - rectangular with specific sizes
 */
export const CustomDimensions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <M3Skeleton variant="rectangular" width={200} height={100} />
      <M3Skeleton variant="rectangular" width="100%" height={200} />
      <M3Skeleton variant="rectangular" width="50%" height={150} />
    </div>
  ),
};

/**
 * Full card skeleton example
 */
export const CompleteCard: Story = {
  render: () => (
    <div style={{ width: '350px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <M3Skeleton variant="rectangular" width="100%" height={180} />
      <div style={{ marginTop: '16px' }}>
        <M3Skeleton variant="text" width="80%" />
        <M3Skeleton variant="text" width="60%" />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
        <M3Skeleton variant="circular" width={32} height={32} />
        <M3Skeleton variant="text" width="40%" />
      </div>
    </div>
  ),
};
