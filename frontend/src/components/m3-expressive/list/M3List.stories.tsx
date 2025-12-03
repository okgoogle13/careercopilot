import type { Meta, StoryObj } from '@storybook/react';
import { M3List } from './M3List';

/**
 * M3 Expressive List Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3List> = {
  component: M3List,
  title: 'M3 Expressive/List',
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
 * Default List
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
