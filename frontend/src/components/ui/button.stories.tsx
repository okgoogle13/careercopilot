import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Trash } from 'lucide-react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
};

export const Hover: Story = {
  args: {
    children: 'Hover Preview',
    variant: 'default',
    className: 'hover:scale-105',
  },
};

export const Focus: Story = {
  args: {
    children: 'Focus Preview',
    variant: 'default',
    className: 'ring-2 ring-[var(--sys-color-inkGold-base)]',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'destructive',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Mail className="w-4 h-4" />
      Login with Email
    </Button>
  ),
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    variant: 'outline',
    'aria-label': 'Delete item',
  },
  render: (args) => (
    <Button {...args}>
      <Trash className="w-4 h-4" />
    </Button>
  ),
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};
