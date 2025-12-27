import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
import { LayoutGrid, List, BarChart3 } from 'lucide-react';

const meta: Meta<typeof Tabs> = {
    title: 'Components/UI/Tabs',
    component: Tabs,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    render: () => (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="p-4 border rounded-xl mt-2 bg-card">
                <p className="text-sm text-muted-foreground">Make changes to your account here. Click save when you're done.</p>
            </TabsContent>
            <TabsContent value="password" className="p-4 border rounded-xl mt-2 bg-card">
                <p className="text-sm text-muted-foreground">Change your password here. After saving, you'll be logged out.</p>
            </TabsContent>
            <TabsContent value="settings" className="p-4 border rounded-xl mt-2 bg-card">
                <p className="text-sm text-muted-foreground">Manage your notification settings and privacy preferences.</p>
            </TabsContent>
        </Tabs>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <Tabs defaultValue="grid" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="grid">
                    <LayoutGrid className="w-4 h-4" />
                    Grid
                </TabsTrigger>
                <TabsTrigger value="list">
                    <List className="w-4 h-4" />
                    List
                </TabsTrigger>
                <TabsTrigger value="stats">
                    <BarChart3 className="w-4 h-4" />
                    Stats
                </TabsTrigger>
            </TabsList>
            <TabsContent value="grid" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-muted rounded-xl border border-dashed" />
                    <div className="h-20 bg-muted rounded-xl border border-dashed" />
                </div>
            </TabsContent>
            <TabsContent value="list" className="mt-4">
                <div className="space-y-2">
                    <div className="h-10 bg-muted rounded-xl border border-dashed" />
                    <div className="h-10 bg-muted rounded-xl border border-dashed" />
                </div>
            </TabsContent>
            <TabsContent value="stats" className="mt-4">
                <div className="h-40 bg-muted rounded-xl border border-dashed" />
            </TabsContent>
        </Tabs>
    ),
};
