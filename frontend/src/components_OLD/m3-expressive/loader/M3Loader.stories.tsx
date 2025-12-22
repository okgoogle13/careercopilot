import type { Meta, StoryObj } from '@storybook/react';
import { M3Loader } from './M3Loader';

/**
 * M3 Expressive Loader Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Loader> = {
  component: M3Loader,
  title: 'M3 Expressive/Loader',
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
 * Default Loader
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
