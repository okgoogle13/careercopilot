import type { Meta, StoryObj } from '@storybook/react';
import { M3LoadingSkeleton } from './M3LoadingSkeleton';

const meta: Meta<typeof M3LoadingSkeleton> = {
  title: 'M3/Feedback/LoadingSkeleton',
  component: M3LoadingSkeleton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof M3LoadingSkeleton>;

export const Default: Story = { args: { lines: 3 } };
export const FiveLines: Story = { args: { lines: 5 } };
export const SingleLine: Story = { args: { lines: 1 } };
