import React, { useState } from 'react';
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
        <div className="flex flex-col gap-8 h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-white">Applications</h1>
                    <p className="text-[#CAC4D0] font-body">Track and manage your job search progress.</p>
                </div>
                <Button className="bg-[#8A9A5B] hover:bg-[#9AB367] text-[#141218] font-bold">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Application
                </Button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-visible">
                <KanbanBoard columns={columns} />
            </div>
        </div>
    );
}
