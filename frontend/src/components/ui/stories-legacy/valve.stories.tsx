import 'src/design/styles/design-tokens.css';
import type { Meta, StoryObj } from '@storybook/react';
import { Valve } from './Valve';

const meta: Meta<typeof Valve> = {
  title: 'Components/UI/Valve',
  component: Valve,
  tags: ['autodocs'],
  args: {
    label: 'Enable daily job alerts',
    size: 'medium',
    color: 'primary',
    checked: true,
  },
};

export default meta;
type Story = StoryObj<typeof Valve>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    className: 'hover:opacity-90',
  },
};

export const Focus: Story = {
  args: {
    className: 'ring-2 ring-[var(--sys-color-inkGold-base)] rounded-[var(--radius-seed)]',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    error: true,
    helperText: 'Unable to save toggle preference.',
  },
};
