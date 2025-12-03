import type { Meta, StoryObj } from '@storybook/react';
import { M3Card } from './M3Card';

/**
 * M3 Expressive Card Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Card> = {
  component: M3Card,
  title: 'M3 Expressive/Card',
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
 * Default Card
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
