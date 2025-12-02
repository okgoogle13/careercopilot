/**
 * ELECTRIC ALCHEMIST: DASHBOARD PAGE (Enhanced & Optimized)
 *
 * Dashboard page using Electric Alchemist Design System v4.4.
 * PERFORMANCE OPTIMIZED: Memoized calculations and callbacks
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  FileText,
  Briefcase,
  TrendingUp,
  MoreVertical,
  Edit,
  Download,
  Share,
  Trash2,
  Brain,
} from 'lucide-react';
import { Container, Card, Button, Badge, Avatar, Progress, Grid } from '@/components';
import { ProfileCard, CreateProfileCard } from '@/components/profile';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  name: string;
  role: string;
  lastUpdated: string;
  atsScore: number;
  status: 'active' | 'draft' | 'pending';
  applications: number;
  avatarColor?: string;
}

interface DashboardPageProps {
  isEmpty?: boolean;
  onCreateProfile?: () => void;
  onEditProfile?: (profile: Profile) => void;
  onNavigateToCareerGrowth?: () => void;
  onNavigateToSettings?: () => void;
}

export function DashboardPage({
  isEmpty = false,
  onCreateProfile,
  onEditProfile,
  onNavigateToCareerGrowth,
  onNavigateToSettings,
}: DashboardPageProps) {
  const [profiles, setProfiles] = useState<Profile[]>(
    isEmpty
      ? []
      : [
          {
            id: '1',
            name: 'Nishant Dougall',
            role: 'Community Support Worker',
            lastUpdated: '2 days ago',
            atsScore: 87,
            status: 'active',
            applications: 8,
            avatarColor: 'primary',
          },
          {
            id: '2',
            name: 'Senior Developer',
            role: 'React & TypeScript',
            lastUpdated: '1 week ago',
            atsScore: 92,
            status: 'active',
            applications: 5,
            avatarColor: 'secondary',
          },
        ]
  );

  // Memoize expensive calculations
  const totalApplications = useMemo(
    () => profiles.reduce((sum, p) => sum + p.applications, 0),
    [profiles]
  );

  const avgAtsScore = useMemo(
    () => (profiles.length > 0
      ? Math.round(profiles.reduce((sum, p) => sum + p.atsScore, 0) / profiles.length)
      : 0),
    [profiles]
  );

  // Memoize handlers to prevent unnecessary re-renders
  const handleDeleteProfile = useCallback((id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleEditProfile = useCallback(
    (profile: Profile) => {
      onEditProfile?.(profile);
    },
    [onEditProfile]
  );

  if (isEmpty || profiles.length === 0) {
    return (
      <Container size="lg">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
          <Card variant="default" className="max-w-lg p-12">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-container/20 mb-4">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-hero text-3xl font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ready to Launch Your Career?
              </h1>
              <p className="text-human text-base text-on-surface-variant mb-8 max-w-md mx-auto">
                Create your first AI-optimized resume or cover letter to start landing more
                interviews.
              </p>
            </div>
            <Button variant="default" size="lg" onClick={onCreateProfile} className="px-8">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Document
            </Button>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container size="2xl">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-hero text-3xl font-semibold mb-2">Career Dashboard</h1>
              <p className="text-human text-base text-on-surface-variant">
                Manage your job search with AI-powered insights
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <Grid cols={4} gap="md" className="mb-8">
          <Card variant="default" className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-hero text-2xl font-bold">{profiles.length}</h2>
            </div>
            <p className="text-data text-sm text-on-surface-variant">Total Profiles</p>
          </Card>

          <Card variant="default" className="p-6">
            <div className="flex items-center mb-4">
              <Briefcase className="h-5 w-5 text-tertiary mr-2" />
              <h2 className="text-hero text-2xl font-bold">{totalApplications}</h2>
            </div>
            <p className="text-data text-sm text-on-surface-variant">Applications</p>
          </Card>

          <Card variant="default" className="p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-secondary mr-2" />
              <h2 className="text-hero text-2xl font-bold">{avgAtsScore}%</h2>
            </div>
            <p className="text-data text-sm text-on-surface-variant">Avg ATS Score</p>
          </Card>

          <Card variant="default" className="p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-hero text-2xl font-bold">12%</h2>
            </div>
            <p className="text-data text-sm text-on-surface-variant">Response Rate</p>
          </Card>
        </Grid>

        {/* Profiles Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-hero text-xl font-semibold">Your Profiles</h2>
          </div>
          <Grid cols={3} gap="lg">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                name={profile.name}
                role={profile.role}
                atsScore={profile.atsScore}
                applications={profile.applications}
                lastUpdated={profile.lastUpdated}
                onEdit={() => handleEditProfile(profile)}
                onDelete={() => handleDeleteProfile(profile.id)}
              />
            ))}
            <CreateProfileCard onCreate={onCreateProfile} />
          </Grid>
        </div>
      </div>
    </Container>
  );
}

export default DashboardPage;
