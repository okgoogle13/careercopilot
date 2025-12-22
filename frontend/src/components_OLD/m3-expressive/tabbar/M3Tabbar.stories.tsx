import type { Meta, StoryObj } from '@storybook/react';
import { M3Tabbar } from './M3Tabbar';

/**
 * M3 Expressive Tabbar Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Tabbar> = {
  component: M3Tabbar,
  title: 'M3 Expressive/Tabbar',
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
 * Default Tabbar
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
