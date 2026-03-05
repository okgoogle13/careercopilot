import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Bell } from 'lucide-react';
import { Seed } from './Seed';

const meta: Meta<typeof Seed> = {
  title: 'Components/UI/Seed',
  component: Seed,
  tags: ['autodocs'],
  args: {
    content: '3',
    variant: 'standard',
    color: 'error',
    children: (
      <Bell
        aria-label="Notifications"
        className="h-6 w-6 text-[var(--sys-color-worker-ash-steps-6)]"
      />
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Seed>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    className: 'hover:scale-105',
  },
};

export const Focus: Story = {
  args: {
    className: 'ring-2 ring-[var(--sys-color-inkGold-base)] rounded-[var(--radius-seed)]',
  },
};

export const Disabled: Story = {
  args: {
    invisible: true,
  },
};

export const Error: Story = {
  args: {
    color: 'error',
    content: '!',
  },
};
