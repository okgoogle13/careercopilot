import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Stone } from './Stone';

const meta: Meta<typeof Stone> = {
  title: 'Components/UI/Stone',
  component: Stone,
  tags: ['autodocs'],
  args: {
    mode: 'KrDark',
    elevation: 'raised',
    children: <p className="text-[var(--sys-color-worker-ash-steps-6)]">Primary container content</p>,
  },
};

export default meta;
type Story = StoryObj<typeof Stone>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    className: 'hover:shadow-ink-hover',
  },
};

export const Focus: Story = {
  args: {
    className: 'ring-2 ring-[var(--sys-color-inkGold-base)]',
  },
};

export const Disabled: Story = {
  args: {
    className: 'opacity-50',
  },
};

export const Error: Story = {
  args: {
    className: 'border-[var(--sys-color-solidarityRed-base)]',
    children: <p className="text-[var(--sys-color-solidarityRed-base)]">Error emphasis container</p>,
  },
};
