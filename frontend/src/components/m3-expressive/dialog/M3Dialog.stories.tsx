import type { Meta, StoryObj } from '@storybook/react';
import { M3Dialog } from './M3Dialog';

/**
 * M3 Expressive Dialog Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Dialog> = {
  component: M3Dialog,
  title: 'M3 Expressive/Dialog',
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
 * Default Dialog
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
