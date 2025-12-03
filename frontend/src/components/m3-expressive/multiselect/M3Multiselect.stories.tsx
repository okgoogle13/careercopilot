import type { Meta, StoryObj } from '@storybook/react';
import { M3Multiselect } from './M3Multiselect';

/**
 * M3 Expressive Multiselect Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Multiselect> = {
  component: M3Multiselect,
  title: 'M3 Expressive/Multiselect',
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
 * Default Multiselect
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
