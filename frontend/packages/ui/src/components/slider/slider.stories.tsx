import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './slider';
import { useState } from 'react';

const meta: Meta<typeof Slider> = {
    title: 'Components/UI/Slider',
    component: Slider,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    args: {
        defaultValue: [50],
        max: 100,
        step: 1,
        className: 'w-[60%]',
    },
};

export const Range: Story = {
    args: {
        defaultValue: [25, 75],
        max: 100,
        step: 1,
        className: 'w-[60%]',
    },
};

export const Interactive: Story = {
    render: () => {
        const [value, setValue] = useState([40]);
        return (
            <div className="w-[60%] space-y-4">
                <Slider value={value} onValueChange={setValue} max={100} step={1} />
                <p className="text-sm text-muted-foreground">Volume: {value[0]}%</p>
            </div>
        );
    },
};

export const Vertical: Story = {
    render: () => (
        <div className="h-44">
            <Slider orientation="vertical" defaultValue={[50]} max={100} step={1} />
        </div>
    ),
};
