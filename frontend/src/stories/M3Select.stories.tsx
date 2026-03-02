import type { Meta, StoryObj } from '@storybook/react';
import { M3Select } from '../legacy/ui/M3Select';

const meta: Meta<typeof M3Select> = {
    title: 'M3 Components/Select',
    component: M3Select,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        placeholder: { control: 'text' },
        error: { control: 'boolean' },
        disabled: { control: 'boolean' },
        fullWidth: { control: 'boolean' },
    },
    decorators: [
        (Story) => (
            <div style={{ paddingBottom: '200px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof M3Select>;

const defaultOptions = [
    { value: 'au', label: 'Australia' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'de', label: 'Germany' },
];

export const Default: Story = {
    args: {
        label: 'Select Country',
        options: defaultOptions,
    },
};

export const SelectedValue: Story = {
    args: {
        label: 'Job Priority',
        value: 'high',
        options: [
            { value: 'low', label: 'Low Priority' },
            { value: 'medium', label: 'Medium Priority' },
            { value: 'high', label: 'High Priority' },
        ],
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Workspace',
        placeholder: 'Choose a location',
        helperText: 'Select where you would like to work from',
        options: [
            { value: 'remote', label: 'Remote' },
            { value: 'hybrid', label: 'Hybrid' },
            { value: 'onsite', label: 'On-site' },
        ],
    },
};

export const ErrorState: Story = {
    args: {
        label: 'Industry',
        error: true,
        errorMessage: 'Please select an industry to continue',
        options: defaultOptions,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Role (Read Only)',
        disabled: true,
        value: 'admin',
        options: [
            { value: 'user', label: 'Standard User' },
            { value: 'admin', label: 'Administrator' },
        ],
    },
};

export const FullWidth: Story = {
    args: {
        label: 'Department',
        fullWidth: true,
        options: [
            { value: 'eng', label: 'Engineering' },
            { value: 'prod', label: 'Product' },
            { value: 'design', label: 'Design' },
            { value: 'mktg', label: 'Marketing' },
        ],
    },
};
