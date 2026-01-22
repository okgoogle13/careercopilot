import type { Meta, StoryObj } from '@storybook/react';
import { Pebble } from '../components/ui/M3Button';
import { Download, Send, Trash2 } from 'lucide-react';

const meta: Meta<typeof M3Button> = {
    title: 'M3 Components/Button',
    component: M3Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['filled', 'outlined', 'text', 'elevated', 'tonal'],
        },
        color: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary', 'error', 'warning'],
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        disabled: { control: 'boolean' },
        loading: { control: 'boolean' },
        fullWidth: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof M3Button>;

export const Filled: Story = {
    args: {
        variant: 'filled',
        color: 'primary',
        children: 'Filled Button',
    },
};

export const Outlined: Story = {
    args: {
        variant: 'outlined',
        color: 'primary',
        children: 'Outlined Button',
    },
};

export const Tonal: Story = {
    args: {
        variant: 'tonal',
        color: 'primary',
        children: 'Tonal Button',
    },
};

export const Elevated: Story = {
    args: {
        variant: 'elevated',
        color: 'primary',
        children: 'Elevated Button',
    },
};

export const Text: Story = {
    args: {
        variant: 'text',
        color: 'primary',
        children: 'Text Button',
    },
};

export const WithIcons: Story = {
    args: {
        variant: 'filled',
        color: 'secondary',
        children: 'Start & End Icons',
        startIcon: <Send size={18} />,
        endIcon: <Download size={18} />,
    },
};

export const Loading: Story = {
    args: {
        variant: 'filled',
        color: 'primary',
        children: 'Saving Data',
        loading: true,
    },
};

export const ErrorState: Story = {
    args: {
        variant: 'filled',
        color: 'error',
        children: 'Delete Project',
        startIcon: <Trash2 size={18} />,
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-4">
                <Pebble variant="filled">Filled</Pebble>
                <Pebble variant="elevated">Elevated</Pebble>
                <Pebble variant="tonal">Tonal</Pebble>
                <Pebble variant="outlined">Outlined</Pebble>
                <Pebble variant="text">Text</Pebble>
            </div>
            <div className="flex flex-wrap gap-4">
                <Pebble color="secondary">Secondary</Pebble>
                <Pebble color="tertiary">Tertiary</Pebble>
                <Pebble color="error">Error</Pebble>
                <Pebble color="warning">Warning</Pebble>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                <Pebble size="small">Small</Pebble>
                <Pebble size="medium">Medium</Pebble>
                <Pebble size="large">Large</Pebble>
            </div>
        </div>
    ),
};
