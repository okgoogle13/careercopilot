import type { Meta, StoryObj } from '@storybook/react';
import { M3Accordion } from './M3Accordion';

/**
 * M3 Expressive Accordion Component
 *
 * [Add description]
 */
const meta: Meta<typeof M3Accordion> = {
  component: M3Accordion,
  title: 'M3 Expressive/Accordion',
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
 * Default Accordion
 */
export const Default: Story = {
  args: {
    children: 'Content',
  },
};

// TODO: Add additional stories for variants, colors, sizes, etc.
