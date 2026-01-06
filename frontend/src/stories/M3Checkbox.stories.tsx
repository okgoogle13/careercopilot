import type { Meta, StoryObj } from '@storybook/react';
import { M3Checkbox, M3Radio } from '../components/ui/M3Checkbox';

const meta: Meta<typeof M3Checkbox> = {
    title: 'M3 Components/Selection Controls',
    component: M3Checkbox,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        checked: { control: 'boolean' },
        indeterminate: { control: 'boolean' },
        error: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
};

export default meta;

export const Checkbox: StoryObj<typeof M3Checkbox> = {
    args: {
        label: 'I accept the Terms and Conditions',
        checked: false,
    },
};

export const Indeterminate: StoryObj<typeof M3Checkbox> = {
    args: {
        label: 'Select All Tasks',
        indeterminate: true,
        checked: true,
    },
};

export const SelectionError: StoryObj<typeof M3Checkbox> = {
    args: {
        label: 'Required selection',
        error: true,
    },
};

export const RadioButtons: StoryObj<typeof M3Radio> = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <M3Radio {...args} name="group" label="Daily Updates" checked={true} />
            <M3Radio {...args} name="group" label="Weekly Summary" checked={false} />
            <M3Radio {...args} name="group" label="Monthly Digest" checked={false} />
        </div>
    ),
    args: {
        error: false,
        disabled: false,
    },
};

export const MixedStates: StoryObj<typeof M3Checkbox> = {
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h3 className="text-title-medium">Checkbox Variants</h3>
                <M3Checkbox label="Default Checkout" />
                <M3Checkbox label="Checked" checked />
                <M3Checkbox label="Disabled" disabled />
                <M3Checkbox label="Disabled Checked" disabled checked />
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-title-medium">Radio Variants</h3>
                <M3Radio groupName="r" label="Default Radio" />
                <M3Radio groupName="r" label="Selected Radio" checked />
                <M3Radio groupName="r" label="Disabled Radio" disabled />
            </div>
        </div>
    ),
};
