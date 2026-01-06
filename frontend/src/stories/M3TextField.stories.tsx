import type { Meta, StoryObj } from '@storybook/react';
import { M3TextField, M3TextArea } from '../components/ui/M3TextField';
import { Search, Mail, Lock, User, AlertCircle } from 'lucide-react';

const meta: Meta<typeof M3TextField> = {
    title: 'M3 Components/TextField',
    component: M3TextField,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['filled', 'outlined'],
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        error: { control: 'boolean' },
        disabled: { control: 'boolean' },
        fullWidth: { control: 'boolean' },
        showCounter: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof M3TextField>;

export const Outlined: Story = {
    args: {
        variant: 'outlined',
        label: 'Username',
        placeholder: 'Enter your username',
        helperText: 'Must be unique',
    },
};

export const Filled: Story = {
    args: {
        variant: 'filled',
        label: 'Email',
        placeholder: 'you@example.com',
        startAdornment: <Mail size={18} />,
    },
};

export const WithIcons: Story = {
    args: {
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        startAdornment: <Lock size={18} />,
        endAdornment: <AlertCircle size={18} className="text-error" />,
    },
};

export const ErrorState: Story = {
    args: {
        label: 'Phone Number',
        defaultValue: '123-abc',
        error: true,
        errorMessage: 'Invalid phone number format',
    },
};

export const WithCounter: Story = {
    args: {
        label: 'Description',
        placeholder: 'Tell us about yourself',
        showCounter: true,
        maxLength: 50,
        defaultValue: 'This is a short bio.',
    },
};

export const TextArea: StoryObj<typeof M3TextArea> = {
    render: (args) => <M3TextArea {...args} />,
    args: {
        label: 'Comments',
        placeholder: 'Type your feedback here...',
        rows: 4,
        showCounter: true,
        maxLength: 500,
    },
};

export const InputSizes: Story = {
    render: () => (
        <div className="flex flex-col gap-6 w-80">
            <M3TextField label="Small" size="small" placeholder="Small input" />
            <M3TextField label="Medium" size="medium" placeholder="Medium input" />
            <M3TextField label="Large" size="large" placeholder="Large input" />
        </div>
    ),
};
