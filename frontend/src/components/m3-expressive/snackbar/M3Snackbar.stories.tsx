import type { Meta, StoryObj } from '@storybook/react';
import { M3Snackbar } from './M3Snackbar';

/**
 * M3 Expressive Snackbar Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Snackbar> = {
  component: M3Snackbar,
  title: 'M3 Expressive/Snackbar',
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
 * Default Snackbar
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
