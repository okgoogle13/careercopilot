import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './dialog';
import { Button } from './button';

const meta: Meta<typeof Dialog> = {
    title: 'Components/UI/Dialog',
    component: Dialog,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 py-4">
                    <div className="grid flex-1 gap-2">
                        <p className="text-sm font-medium">Username</p>
                        <div className="h-10 bg-muted rounded-md border border-dashed flex items-center px-4">
                            okgoogle13
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const Newsletter: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Subscribe to Newsletter</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stay in the loop</DialogTitle>
                    <DialogDescription>
                        Join 5,000+ career experts and get weekly tips delivered to your inbox.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6 h-20 bg-muted/50 rounded-xl border border-dashed flex items-center justify-center text-muted-foreground italic">
                    [ Email Input Placeholder ]
                </div>
                <DialogFooter>
                    <Button className="w-full">Sign me up</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};
