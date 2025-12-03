import type { Meta, StoryObj } from '@storybook/react';
import { M3Bottomnavigation } from './M3Bottomnavigation';

/**
 * M3 Expressive Bottomnavigation Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Bottomnavigation> = {
  component: M3Bottomnavigation,
  title: 'M3 Expressive/Bottomnavigation',
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
 * Default Bottomnavigation
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
