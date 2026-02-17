import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Pebble } from './Pebble';

const meta: Meta<typeof Pebble> = {
  title: 'Components/UI/Pebble',
  component: Pebble,
  tags: ['autodocs'],
  args: {
    children: 'Continue',
    variant: 'primary',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof Pebble>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    className: 'hover:-translate-y-0.5',
    iconRight: <ArrowRight className="h-4 w-4" />,
  },
};

export const Focus: Story = {
  args: {
    className: 'focus-visible:ring-2 focus-visible:ring-[var(--sys-color-inkGold-base)]',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    variant: 'destructive',
    iconLeft: <AlertTriangle className="h-4 w-4" />,
    children: 'Delete Application',
  },
};
