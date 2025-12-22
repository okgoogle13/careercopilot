import type { Meta, StoryObj } from '@storybook/react';
import { M3Progress } from './M3Progress';

/**
 * M3 Expressive Progress Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Progress> = {
  component: M3Progress,
  title: 'M3 Expressive/Progress',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // TODO: Add argTypes for variants and props
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Progress
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
