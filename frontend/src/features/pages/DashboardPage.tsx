/**
 * ELECTRIC ALCHEMIST: DASHBOARD PAGE (Proper Typography Sizing)
 *
 * Dashboard page using Electric Alchemist Design System v4.4.
 * Uses proper semantic HTML and typography scale - NOT text-hero for everything!
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  FileText,
  Target,
  TrendingUp,
  Brain,
  Sparkles,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Container, Card, Grid } from '@/components';
import { Button } from '@/components/ui/button';
import { ProfileCard, CreateProfileCard } from '@/components/profile';
import { useAuth } from '@/context/AuthContext';

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
  onNavigateToOpportunities?: () => void;
  onNavigateToApplications?: () => void;
  onViewAnalytics?: () => void;
}

export function DashboardPage({
  isEmpty = false,
  onCreateProfile,
  onEditProfile,
  onNavigateToOpportunities,
  onNavigateToApplications,
  onViewAnalytics,
}: DashboardPageProps) {
  const { user } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'User';

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
  const activeApplications = useMemo(
    () => profiles.reduce((sum, p) => sum + p.applications, 0),
    [profiles]
  );

  const avgAtsScore = useMemo(
    () => (profiles.length > 0
      ? Math.round(profiles.reduce((sum, p) => sum + p.atsScore, 0) / profiles.length)
      : 0),
    [profiles]
  );

  const responseRate = 67; // Mock data

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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-card bg-primary-container/20 mb-4">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Ready to Launch Your Career?</h1>
              <p className="text-human text-lg text-on-surface-variant mb-8 max-w-md mx-auto">
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
    <div className="flex-1 overflow-y-auto bg-surface">
      <Container size="2xl" className="py-6 md:py-12">
        <div className="flex flex-col gap-12">
          {/* Welcome Banner Section */}
          <Card variant="default" className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Welcome back, {userName}!</h1>
                <p className="text-human text-lg text-on-surface-variant mb-4">
                  Ready to accelerate your career journey? Here&apos;s what&apos;s happening with your job search.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" onClick={onCreateProfile} className="px-6">
                    <FileText className="h-4 w-4 mr-2" />
                    Create New Document
                  </Button>
                  {onViewAnalytics && (
                    <Button variant="outline" onClick={onViewAnalytics} className="px-6">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-tertiary" />
              </div>
            </div>
          </Card>

          {/* Quick Actions Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Quick Actions</h2>
            </div>
            <Grid cols={3} gap="lg">
              {/* Create Document Action */}
              <Card variant="default" interactive className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-card bg-primary-container/20">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Create New Document</h3>
                    <p className="text-human text-sm text-on-surface-variant mb-4">
                      Generate an AI-optimized resume or cover letter tailored to your target role
                    </p>
                    <Button variant="default" size="sm" onClick={onCreateProfile} className="w-full">
                      Start Creating
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Find Opportunities */}
              <Card variant="default" interactive className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-card bg-tertiary-container/20">
                    <Target className="h-6 w-6 text-tertiary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Find Job Opportunities</h3>
                    <p className="text-human text-sm text-on-surface-variant mb-4">
                      Discover jobs that match your skills and get AI-powered insights on each role
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onNavigateToOpportunities}
                      className="w-full"
                    >
                      Browse Jobs
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Track Applications */}
              <Card variant="default" interactive className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-card bg-secondary-container/20">
                    <TrendingUp className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Track Applications</h3>
                    <p className="text-human text-sm text-on-surface-variant mb-4">
                      Monitor your job applications, interview schedules, and follow-up actions
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onNavigateToApplications}
                      className="w-full"
                    >
                      View Tracker
                    </Button>
                  </div>
                </div>
              </Card>
            </Grid>
          </div>

          {/* Recent Profiles Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Profiles</h2>
              {onCreateProfile && (
                <Button variant="ghost" size="sm" onClick={onCreateProfile}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Profile
                </Button>
              )}
            </div>
            <Grid cols={3} gap="lg">
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  name={profile.name}
                  role={profile.role}
                  atsScore={profile.atsScore}
                  activeApplications={profile.applications}
                  lastUpdated={profile.lastUpdated}
                  onEdit={() => handleEditProfile(profile)}
                  onDelete={() => handleDeleteProfile(profile.id)}
                />
              ))}
              {onCreateProfile && <CreateProfileCard onCreate={onCreateProfile} />}
            </Grid>
          </div>

          {/* Job Search Intelligence Card */}
          <Card
            variant="default"
            className="p-6 md:p-8 border-2 border-primary/20 hover:border-primary/40 transition-colors"
            style={{
              transitionDuration: 'var(--motion-duration-short2, 200ms)',
              transitionTimingFunction: 'var(--motion-easing-standard, cubic-bezier(0.4, 0, 0.2, 1))',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-card bg-gradient-to-br from-primary-container/20 to-tertiary-container/20">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Job Search Intelligence</h2>
                  <p className="text-human text-sm text-on-surface-variant">
                    AI-powered insights and recommendations
                  </p>
                </div>
              </div>
              <Sparkles className="h-5 w-5 text-tertiary" />
            </div>

            {/* Stats Grid */}
            <Grid cols={4} gap="md">
              <Card variant="default" className="p-4" interactive>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-data">Applications</span>
                </div>
                <div className="text-2xl font-bold mb-1 text-on-surface">{activeApplications}</div>
                <div className="text-data text-xs">Active this month</div>
              </Card>

              <Card variant="default" className="p-4" interactive>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-tertiary" />
                  <span className="text-data">Interviews</span>
                </div>
                <div className="text-2xl font-bold mb-1 text-on-surface">3</div>
                <div className="text-data text-xs">Scheduled</div>
              </Card>

              <Card variant="default" className="p-4" interactive>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-data">Response Rate</span>
                </div>
                <div className="text-2xl font-bold mb-1 text-on-surface">{responseRate}%</div>
                <div className="text-data text-xs">+12% this week</div>
              </Card>

              <Card variant="default" className="p-4" interactive>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-tertiary" />
                  <span className="text-data">Avg ATS Score</span>
                </div>
                <div className="text-2xl font-bold mb-1 text-on-surface">{avgAtsScore}%</div>
                <div className="text-data text-xs">Excellent</div>
              </Card>
            </Grid>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default DashboardPage;
