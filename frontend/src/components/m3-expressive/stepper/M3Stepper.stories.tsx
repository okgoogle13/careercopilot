import type { Meta, StoryObj } from '@storybook/react';
import { M3Stepper } from './M3Stepper';

/**
 * M3 Expressive Stepper Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Stepper> = {
  component: M3Stepper,
  title: 'M3 Expressive/Stepper',
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
 * Default Stepper
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
