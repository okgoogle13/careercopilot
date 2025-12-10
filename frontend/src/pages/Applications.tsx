import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { KanbanBoard, KanbanColumn } from '@/components/applications/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Applications() {
    // Mock Data
    const initialColumns: KanbanColumn[] = [
        {
            id: 'wishlist',
            title: 'Wishlist',
            status: 'Wishlist',
            items: [
                { id: '1', title: 'Senior Frontend Engineer', company: 'Google', location: 'Mountain View, CA', aiMatchScore: 92, status: 'Wishlist', postedDate: '2 days ago' },
                { id: '2', title: 'Product Designer', company: 'Airbnb', location: 'San Francisco, CA', aiMatchScore: 88, status: 'Wishlist', postedDate: '1 week ago' },
            ]
        },
        {
            id: 'applied',
            title: 'Applied',
            status: 'Applied',
            items: [
                { id: '3', title: 'Full Stack Developer', company: 'Netflix', location: 'Remote', aiMatchScore: 95, status: 'Applied', postedDate: '3 days ago' },
            ]
        },
        {
            id: 'interview',
            title: 'Interview',
            status: 'Interview',
            items: []
        },
        {
            id: 'offer',
            title: 'Offer',
            status: 'Offer',
            items: []
        },
        {
            id: 'rejected',
            title: 'Rejected',
            status: 'Rejected',
            items: []
        }
    ];

    const [columns, setColumns] = useState(initialColumns);

    return (
        <AppLayout>
            <div className="min-h-screen bg-surface p-6 md:p-8 flex flex-col h-full">
                <div className="mx-auto w-full max-w-[1800px] flex-1 flex flex-col gap-8">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-foreground">Applications</h1>
                            <p className="text-muted-foreground font-body">Track and manage your job search progress.</p>
                        </div>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Application
                        </Button>
                    </div>

                    {/* Kanban Board */}
                    <div className="flex-1 overflow-hidden">
                        <KanbanBoard columns={columns} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
