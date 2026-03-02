import type { Meta, StoryObj } from '@storybook/react';
<<<<<<< HEAD
import { M3Checkbox, M3Radio } from '../components/ui/M3Checkbox';
=======
import { M3Checkbox, M3Radio } from '../components/ui/Mark';
import { Mark } from '../components/ui/Mark';
>>>>>>> restoration-KR-Rage-Figma-v2.0

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
                <Mark label="Default Checkout" />
                <Mark label="Checked" checked />
                <Mark label="Disabled" disabled />
                <Mark label="Disabled Checked" disabled checked />
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-title-medium">Radio Variants</h3>
<<<<<<< HEAD
                <M3Radio groupName="r" label="Default Radio" />
                <M3Radio groupName="r" label="Selected Radio" checked />
                <M3Radio groupName="r" label="Disabled Radio" disabled />
=======
                <M3Radio name="r" label="Default Radio" />
                <M3Radio name="r" label="Selected Radio" checked />
                <M3Radio name="r" label="Disabled Radio" disabled />
>>>>>>> restoration-KR-Rage-Figma-v2.0
            </div>
        </div>
    ),
};
