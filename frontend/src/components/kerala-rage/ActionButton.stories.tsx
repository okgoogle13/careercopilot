import type { Meta, StoryObj } from '@storybook/react';
import { ActionButton } from './ActionButton';

const meta: Meta<typeof ActionButton> = {
  title: 'KeralaRage/ActionButton',
  component: ActionButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Primary: Story = {
  args: {
    label: 'Primary Action',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Action',
    variant: 'secondary',
  },
};

export const Accent: Story = {
  args: {
    label: 'Accent Action',
    variant: 'accent',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Action',
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    label: 'Small Button',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Button',
    size: 'lg',
  },
};
