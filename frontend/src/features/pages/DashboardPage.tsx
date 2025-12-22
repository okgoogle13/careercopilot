/**
 * ELECTRIC ALCHEMIST: DASHBOARD PAGE (Proper Typography Sizing)
 *
 * Dashboard page using Electric Alchemist Design System v4.4.
 * Uses proper semantic HTML and typography scale - NOT text-hero for everything!
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
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
import { JobCard } from '@/components/applications/JobCard';
import { CreateProfileCard } from '@/components/dashboard/CreateProfileCard';
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

  // Bio-Glass Motion Configuration
  const glassMotion = {
    whileHover: {
      y: -4,
      scale: 1.01,
      boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.6)"
    },
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      mass: 1
    }
  };

  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`;

  return (
    <div className="flex-1 overflow-y-auto bg-surface relative min-h-screen">
      {/* Background Decoration - Replacing plantImage with a gradient for now */}
      <div className="absolute bottom-0 left-0 right-0 h-[65%] pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 100%, rgba(138, 154, 91, 0.15) 0%, transparent 60%)', // Subtle sage glow
            mixBlendMode: 'screen',
          }}
        />
      </div>

      <Container size="2xl" className="py-6 md:py-12 relative z-10">

        {/* Welcome Banner - Bio-Glass Hero */}
        <div
          className="rounded-[28px] p-12 mb-8 relative overflow-hidden group"
          style={{
            minHeight: '400px',
            background: 'linear-gradient(135deg, var(--surface-container-high) 0%, var(--surface-container) 100%)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="relative z-10">
            <h1 className="mb-3 text-[3.5rem] md:text-[4.5rem] leading-[1.1] text-on-surface tier-display alive-text font-bold">
              GOOD MORNING, <span className="text-primary-lighter">{userName.toUpperCase()}</span>!
            </h1>
            <p className="text-on-surface text-xl max-w-lg tier-body opacity-90">
              You have {activeApplications} active applications and 3 upcoming interviews this week.
            </p>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-64 h-64 text-primary" />
          </div>
        </div>

        {/* Stats Grid - Bio-Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-surface-container rounded-[28px] p-8 flex flex-col items-center justify-center relative overflow-hidden"
            {...glassMotion}
            style={{ backgroundImage: noiseOverlay }}
          >
            <div className="relative z-10 flex flex-col items-center">
              <FileText className="w-12 h-12 text-primary-lighter mb-4" />
              <p className="text-6xl md:text-7xl mb-6 text-on-surface font-bold">{activeApplications}</p>
              <p className="text-on-surface-variant text-sm uppercase tracking-wider font-bold">Active Applications</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-surface-container rounded-[28px] p-8 flex flex-col items-center justify-center relative overflow-hidden"
            {...glassMotion}
            style={{ backgroundImage: noiseOverlay }}
          >
            <div className="relative z-10 flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <p className="text-6xl md:text-7xl mb-6 text-on-surface font-bold">2</p>
              <p className="text-on-surface-variant text-sm uppercase tracking-wider font-bold">Offers Received</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-surface-container rounded-[28px] p-8 flex flex-col items-center justify-center relative overflow-hidden"
            {...glassMotion}
            style={{ backgroundImage: noiseOverlay }}
          >
            <div className="relative z-10 flex flex-col items-center">
              <TrendingUp className="w-12 h-12 text-tertiary mb-4" />
              <p className="text-6xl md:text-7xl mb-6 text-on-surface font-bold">45</p>
              <p className="text-on-surface-variant text-sm uppercase tracking-wider font-bold">Connections</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Button
            variant="outline"
            onClick={onCreateProfile}
            className="bg-black/50 backdrop-blur-[10px] text-on-surface border-white/5 shadow-inner py-6 px-8 rounded-full text-base hover:bg-black/60 transition-all gap-3 h-auto"
          >
            <Plus className="w-5 h-5" />
            Create New Document
          </Button>

          {onViewAnalytics && (
            <Button
              variant="outline"
              onClick={onViewAnalytics}
              className="bg-black/50 backdrop-blur-[10px] text-on-surface border-white/5 shadow-inner py-6 px-8 rounded-full text-base hover:bg-black/60 transition-all h-auto"
            >
              View Analytics
            </Button>
          )}

          {/* "Gummy Bear" Connect Button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.85, rotate: -2 }}
            onClick={onNavigateToOpportunities}
            transition={{ type: "spring", stiffness: 300, damping: 8 }}
            className="relative overflow-hidden rounded-full px-8 py-4 font-bold text-[#141218] ml-auto h-auto"
            style={{
              background: 'linear-gradient(180deg, #8A9A5B 0%, #6D7E44 100%)',
              boxShadow: 'inset 0px 6px 4px rgba(255, 255, 255, 0.4), inset 0px -6px 4px rgba(0, 0, 0, 0.2), 0px 8px 20px rgba(138, 154, 91, 0.5)'
            }}
          >
            <div className="absolute top-2 left-4 right-4 h-3 bg-white/30 rounded-full blur-[1px]" />
            <span className="relative z-10 flex items-center gap-2">
              <Target className="w-5 h-5" strokeWidth={3} />
              BROWSE JOBS
            </span>
          </motion.button>
        </div>

        {/* Your Application Profiles - Using JobCard Bricks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-on-surface uppercase tracking-tight">
              Your Application <span className="text-primary">Profiles</span>
            </h3>
            {onCreateProfile && (
              <Button variant="ghost" onClick={onCreateProfile}>
                View All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <JobCard
                key={profile.id}
                id={profile.id}
                title={profile.name} // Using profile name as Main Title
                company={profile.role} // Using role as Subtitle/Company
                location="Remote" // Placeholder or add to Profile interface
                aiMatchScore={profile.atsScore}
                status={profile.status}
                postedDate={profile.lastUpdated}
                onClick={() => onEditProfile?.(profile)}
                className="bg-surface-container border-none shadow-none hover:shadow-xl transition-all"
                variant="default"
              />
            ))}

            {/* Add New Profile Card Brick */}
            <CreateProfileCard onClick={onCreateProfile} />
          </div>
        </div>

      </Container>
    </div>
  );
}

export default DashboardPage;
