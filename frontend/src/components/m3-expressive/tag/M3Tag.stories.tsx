import type { Meta, StoryObj } from '@storybook/react';
import { M3Tag } from './M3Tag';

/**
 * M3 Expressive Tag Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Tag> = {
  component: M3Tag,
  title: 'M3 Expressive/Tag',
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
 * Default Tag
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
