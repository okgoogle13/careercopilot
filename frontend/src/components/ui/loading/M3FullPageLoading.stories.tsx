import type { Meta, StoryObj } from '@storybook/react';
import { M3FullPageLoading } from './M3FullPageLoading';

const meta: Meta<typeof M3FullPageLoading> = {
  title: 'M3/Feedback/FullPageLoading',
  component: M3FullPageLoading,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof M3FullPageLoading>;

export const Default: Story = { args: { open: true } };
export const WithMessage: Story = { args: { open: true, message: 'Loading your data...' } };
