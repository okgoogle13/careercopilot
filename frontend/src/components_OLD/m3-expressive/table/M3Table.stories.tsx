import type { Meta, StoryObj } from '@storybook/react';
import { M3Table } from './M3Table';

/**
 * M3 Expressive Table Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Table> = {
  component: M3Table,
  title: 'M3 Expressive/Table',
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
 * Default Table
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
