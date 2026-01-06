import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from '../components/ui/StatusBadge/StatusBadge';

const meta: Meta<typeof StatusBadge> = {
    title: 'M3 Components/StatusBadge',
    component: StatusBadge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary', 'neutral', 'outline'],
        },
        label: { control: 'text' },
        showDot: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {
    args: {
        label: 'Status Label',
        variant: 'neutral',
    },
};

export const Primary: Story = {
    args: {
        label: 'Active',
        variant: 'primary',
        showDot: true,
    },
};

export const Secondary: Story = {
    args: {
        label: 'Pending',
        variant: 'secondary',
        showDot: true,
    },
};

export const Tertiary: Story = {
    args: {
        label: 'New Opportunity',
        variant: 'tertiary',
        showDot: true,
    },
};

export const Outline: Story = {
    args: {
        label: 'Archived',
        variant: 'outline',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <StatusBadge variant="primary" label="Primary" showDot />
            <StatusBadge variant="secondary" label="Secondary" showDot />
            <StatusBadge variant="tertiary" label="Tertiary" showDot />
            <StatusBadge variant="neutral" label="Neutral" showDot />
            <StatusBadge variant="outline" label="Outline" />
        </div>
    ),
};
