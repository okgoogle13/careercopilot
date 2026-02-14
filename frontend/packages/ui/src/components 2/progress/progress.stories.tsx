import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';
import { useState, useEffect } from 'react';

const meta: Meta<typeof Progress> = {
    title: 'Components/UI/Progress',
    component: Progress,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
    args: {
        value: 60,
    },
};

export const LowProgress: Story = {
    args: {
        value: 15,
        className: "w-[60%]"
    },
};

export const Completed: Story = {
    args: {
        value: 100,
    },
};

export const Animated: Story = {
    render: () => {
        const [progress, setProgress] = useState(13);

        useEffect(() => {
            const timer = setTimeout(() => setProgress(66), 500);
            return () => clearTimeout(timer);
        }, []);

        return <Progress value={progress} className="w-[60%]" />;
    },
};
