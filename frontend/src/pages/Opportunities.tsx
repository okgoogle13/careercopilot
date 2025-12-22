import React, { useState } from 'react';
import { JobMatchCard } from '@/components/opportunities/JobMatchCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Sparkles } from 'lucide-react';

export default function Opportunities() {
    const jobMatches = [
        {
            id: '1',
            title: 'Senior Community Support Worker',
            company: 'Community Care Australia',
            location: 'Brisbane, QLD',
            matchPercentage: 94,
            salaryRange: '$65k - $75k',
            postedDate: '2 days ago',
            description: 'Join our passionate team providing support to individuals with disabilities in community settings.',
            tags: ['Disability Support', 'Case Management', 'Mentoring'],
            isRemote: false,
            isFavorited: false,
        },
        {
            id: '2',
            title: 'Mental Health Peer Worker',
            company: 'Queensland Health',
            location: 'Gold Coast, QLD',
            matchPercentage: 87,
            salaryRange: '$60k - $70k',
            postedDate: '5 days ago',
            description: 'Support individuals with lived experience of mental health challenges in their recovery journey.',
            tags: ['Mental Health', 'Peer Support', 'Group Facilitation'],
            isRemote: true,
            isFavorited: true,
        },
        {
            id: '3',
            title: 'Community Outreach Coordinator',
            company: 'Mental Health Foundation',
            location: 'Sydney, NSW',
            matchPercentage: 82,
            salaryRange: '$55k - $65k',
            postedDate: '1 week ago',
            description: 'Coordinate community programs and build partnerships to support mental health initiatives.',
            tags: ['Program Coordination', 'Stakeholder Engagement', 'Events'],
            isRemote: false,
            isFavorited: false,
        },
    ];

    return (
        <div className="relative">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-2 text-[#E6E1E5] tracking-tight leading-[1.1]">
                        JOB <span className="font-light italic text-[#D0BCFF]">OPPORTUNITIES</span>
                    </h1>
                    <p className="text-[#CAC4D0]">Curated opportunities that match your profile</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search opportunities..." className="pl-9 rounded-full bg-surface-container-high border-transparent" />
                    </div>
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Match List */}
            <div className="grid gap-6">
                {jobMatches.map((job) => (
                    <JobMatchCard
                        key={job.id}
                        {...job}
                        onView={() => console.log('View', job.id)}
                        onSave={() => console.log('Save', job.id)}
                    />
                ))}
            </div>
        </div>
    );
}
