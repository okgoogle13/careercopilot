import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
import { Button } from './button';
import { Plus } from 'lucide-react';

const meta: Meta<typeof Tooltip> = {
    title: 'Components/UI/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add to library</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const Positions: Story = {
    render: () => (
        <TooltipProvider>
            <div className="flex gap-4">
                {['top', 'right', 'bottom', 'left'].map((side) => (
                    <Tooltip key={side}>
                        <TooltipTrigger asChild>
                            <Button variant="outline">{side}</Button>
                        </TooltipTrigger>
                        <TooltipContent side={side as any}>
                            <p>Tooltip on {side}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    ),
};
