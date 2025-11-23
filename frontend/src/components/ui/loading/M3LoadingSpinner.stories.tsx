import type { Meta, StoryObj } from '@storybook/react';
import { M3LoadingSpinner } from './M3LoadingSpinner';

const meta: Meta<typeof M3LoadingSpinner> = {
  title: 'M3/Feedback/LoadingSpinner',
  component: M3LoadingSpinner,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof M3LoadingSpinner>;

export const Small: Story = { args: { size: 'small' } };
export const Medium: Story = { args: { size: 'medium' } };
export const Large: Story = { args: { size: 'large' } };

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <M3LoadingSpinner size="small" />
      <M3LoadingSpinner size="medium" />
      <M3LoadingSpinner size="large" />
    </div>
  ),
};
