import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { ActionCard } from '@/components/dashboard/ActionCard';
import { ProfileCard } from '@/components/dashboard/ProfileCard';
import { CreateProfileCard } from '@/components/dashboard/CreateProfileCard';
import { FileText, Search, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
    const [profiles, setProfiles] = useState([
        {
            id: '1',
            name: 'Nishant Dougall',
            role: 'Community Support Worker',
            activeApplications: 8,
            atsScore: 87,
            lastUpdated: '2 days ago',
            avatarUrl: ''
        },
        {
            id: '2',
            name: 'Senior Developer',
            role: 'React & TypeScript',
            activeApplications: 5,
            atsScore: 92,
            lastUpdated: '1 week ago',
            avatarUrl: ''
        }
    ]);

    const handleCreateDocument = () => console.log('Create Document');
    const handleFindJobs = () => console.log('Find Jobs');
    const handleTrackApps = () => console.log('Track Apps');

    return (
        <AppLayout>
            <div className="min-h-screen bg-surface p-6 md:p-12">
                <div className="mx-auto max-w-[1600px] space-y-8">

                    {/* Header Section */}
                    <WelcomeBanner
                        userName="Nishant"
                        profileData={{
                            totalApplications: 24,
                            activeApplications: 12,
                            interviewsScheduled: 3,
                            lastActivity: new Date(),
                            recentAchievements: ['Resume Optimization Score > 90%', 'Applied to 5 Senior Roles']
                        }}
                        onCreateDocument={handleCreateDocument}
                        onViewAnalytics={() => console.log('View Analytics')}
                    />

                    {/* Quick Actions Grid */}
                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-primary rounded-full" />
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ActionCard
                                title="Create New Document"
                                description="Generate an AI-optimized resume or cover letter tailored to your target role."
                                icon={<FileText />}
                                actionLabel="Start Creating"
                                onAction={handleCreateDocument}
                                variant="primary"
                            />
                            <ActionCard
                                title="Find Job Opportunities"
                                description="Discover jobs that match your skills and get AI-powered insights."
                                icon={<Search />}
                                actionLabel="Browse Jobs"
                                onAction={handleFindJobs}
                                variant="tertiary"
                            />
                            <ActionCard
                                title="Track Applications"
                                description="Monitor your job applications, interviews, and follow-ups."
                                icon={<TrendingUp />}
                                actionLabel="View Tracker"
                                onAction={handleTrackApps}
                                variant="secondary"
                            />
                        </div>
                    </section>

                    {/* Profiles Grid */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
                                <span className="w-2 h-8 bg-secondary rounded-full" />
                                Your Profiles
                            </h2>
                            <Button onClick={handleCreateDocument} variant="ghost" size="sm">
                                View All
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {profiles.map((profile) => (
                                <ProfileCard
                                    key={profile.id}
                                    {...profile}
                                    onEdit={() => console.log('Edit', profile.id)}
                                    onDelete={() => console.log('Delete', profile.id)}
                                />
                            ))}
                            <CreateProfileCard onClick={handleCreateDocument} />
                        </div>
                    </section>

                </div>
            </div>
        </AppLayout>
    );
}
