import type { Meta, StoryObj } from '@storybook/react';
import { M3Pagination } from './M3Pagination';

/**
 * M3 Expressive Pagination Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Pagination> = {
  component: M3Pagination,
  title: 'M3 Expressive/Pagination',
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
 * Default Pagination
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
