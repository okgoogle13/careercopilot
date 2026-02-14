import type { Meta, StoryObj } from '@storybook/react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from './sheet';
import { Button } from '../shadcn-button/button';
import { Menu, Settings, User, Bell } from 'lucide-react';

const meta: Meta<typeof Sheet> = {
    title: 'Components/UI/Sheet',
    component: Sheet,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const RightLayout: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open Settings</Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                    <SheetDescription>
                        Manage your career preferences and notification settings.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4 px-4">
                    <Button variant="ghost" className="justify-start gap-2">
                        <User className="h-4 w-4" /> Account
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2">
                        <Bell className="h-4 w-4" /> Notifications
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2">
                        <Settings className="h-4 w-4" /> Privacy
                    </Button>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" className="w-full">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const LeftNavigation: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                    <SheetTitle>CareerCopilot</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-8 px-4">
                    <Button variant="secondary" className="justify-start">Dashboard</Button>
                    <Button variant="ghost" className="justify-start">Opportunities</Button>
                    <Button variant="ghost" className="justify-start">Analysis</Button>
                    <Button variant="ghost" className="justify-start">KSC Generator</Button>
                </nav>
            </SheetContent>
        </Sheet>
    ),
};

export const BottomSheet: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Quick Actions</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle>Quick Actions</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-2 gap-4 p-8">
                    <Button className="h-20 flex flex-col gap-2">
                        <Plus className="h-6 w-6" /> Create Note
                    </Button>
                    <Button className="h-20 flex flex-col gap-2" variant="secondary">
                        <Settings className="h-6 w-6" /> Preferences
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    ),
};
const Plus = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
