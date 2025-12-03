import type { Meta, StoryObj } from '@storybook/react';
import { M3Rangeslider } from './M3Rangeslider';

/**
 * M3 Expressive Rangeslider Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Rangeslider> = {
  component: M3Rangeslider,
  title: 'M3 Expressive/Rangeslider',
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
 * Default Rangeslider
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
