import type { Meta, StoryObj } from '@storybook/react';
import { M3Drawer } from './M3Drawer';

/**
 * M3 Expressive Drawer Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Drawer> = {
  component: M3Drawer,
  title: 'M3 Expressive/Drawer',
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
 * Default Drawer
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
