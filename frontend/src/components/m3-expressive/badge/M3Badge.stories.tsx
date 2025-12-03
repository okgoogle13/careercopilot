import type { Meta, StoryObj } from '@storybook/react';
import { M3Badge } from './M3Badge';

/**
 * M3 Expressive Badge Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Badge> = {
  component: M3Badge,
  title: 'M3 Expressive/Badge',
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
 * Default Badge
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
