import type { Meta, StoryObj } from '@storybook/react';
import { KeralaRageButton } from './KeralaRageButton';
import 'src/styles/design-tokens.css';

const meta: Meta<typeof KeralaRageButton> = {
  title: 'Components/KeralaRageButton',
  component: KeralaRageButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Kerala Rage Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Secondary Action',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    size: 'md',
    children: 'Tertiary Action',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    loading: true,
    children: 'Processing...',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
    children: 'Disabled Button',
  },
};

export const SmallSize: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
};

export const LargeSize: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
};

export const WithStartIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    startIcon: <span>→</span>,
    children: 'With Start Icon',
  },
};

export const WithEndIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    endIcon: <span>←</span>,
    children: 'With End Icon',
  },
};

export const SecondaryLarge: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    children: 'Secondary Large',
  },
};

export const TertiarySmall: Story = {
  args: {
    variant: 'tertiary',
    size: 'sm',
    children: 'Tertiary Small',
  },
};

export const LoadingSecondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    loading: true,
    children: 'Loading Secondary',
  },
};

export const DisabledTertiary: Story = {
  args: {
    variant: 'tertiary',
    size: 'md',
    disabled: true,
    children: 'Disabled Tertiary',
  },
};
