import type { Meta, StoryObj } from '@storybook/react';
import { IconBadge } from './icon-badge';
import { Sparkles, Zap, Shield, Heart } from 'lucide-react';

const meta: Meta<typeof IconBadge> = {
    title: 'Components/UI/IconBadge',
    component: IconBadge,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof IconBadge>;

export const Default: Story = {
    args: {
        icon: Sparkles,
        size: 'md',
    },
};

export const Small: Story = {
    args: {
        icon: Zap,
        size: 'sm',
        color: 'text-yellow-400',
        background: 'bg-yellow-400/10',
    },
};

export const Large: Story = {
    args: {
        icon: Shield,
        size: 'lg',
        color: 'text-green-400',
        background: 'bg-green-400/10',
    },
};

export const Custom: Story = {
    args: {
        icon: Heart,
        size: 'md',
        color: 'text-red-400',
        background: 'bg-red-400/10',
    },
};
