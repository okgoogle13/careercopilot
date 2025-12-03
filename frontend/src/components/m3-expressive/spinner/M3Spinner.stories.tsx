import type { Meta, StoryObj } from '@storybook/react';
import { M3Spinner } from './M3Spinner';

/**
 * M3 Expressive Spinner Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Spinner> = {
  component: M3Spinner,
  title: 'M3 Expressive/Spinner',
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
 * Default Spinner
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
