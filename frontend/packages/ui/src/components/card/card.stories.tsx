import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from './card';
import { Button } from './button';
import { MoreVertical } from 'lucide-react';

const meta: Meta<typeof Card> = {
    title: 'Components/UI/Card',
    component: Card,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="tier-display text-xl">Job Application</CardTitle>
                <CardDescription>Software Engineer at Google</CardDescription>
                <CardAction>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-sm font-medium">Status: Interviewing</p>
                    <p className="text-xs text-muted-foreground">Applied on Oct 24, 2024</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>View Details</Button>
            </CardFooter>
        </Card>
    ),
};

export const Simple: Story = {
    render: () => (
        <Card className="w-[350px]">
            <CardContent className="pt-6">
                <p className="tier-body">This is a simple card with only content. Perfect for small snippets of information.</p>
            </CardContent>
        </Card>
    ),
};
