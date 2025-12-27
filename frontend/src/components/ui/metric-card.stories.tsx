import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './metric-card';
import { Briefcase, Users, TrendingUp, Zap } from 'lucide-react';

const meta: Meta<typeof MetricCard> = {
    title: 'Components/UI/MetricCard',
    component: MetricCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Outlined: Story = {
    args: {
        icon: Briefcase,
        label: 'Open Roles',
        value: '24',
        variant: 'outlined',
    },
};

export const Filled: Story = {
    args: {
        icon: Users,
        label: 'Total Candidates',
        value: '1,280',
        variant: 'filled',
        iconColor: 'text-[#8a9a5b]',
    },
};

export const HighValue: Story = {
    args: {
        icon: TrendingUp,
        label: 'Success Rate',
        value: '94%',
        variant: 'filled',
    },
};

export const CustomColor: Story = {
    args: {
        icon: Zap,
        label: 'AI Match Score',
        value: '98',
        iconColor: 'text-[#e2725b]',
        variant: 'outlined',
    },
};
