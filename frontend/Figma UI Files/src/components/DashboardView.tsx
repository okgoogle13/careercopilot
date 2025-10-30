import React, { useState } from 'react';
import { WelcomeBanner } from './main/WelcomeBanner';
import { ActionCard } from './main/ActionCard';
import { DocumentCard } from './document/DocumentCard';
import { OnboardingWizard, ProfileCompletionCard } from './onboarding';
import { useProfileCompletion } from '../hooks';
import {
  FileText,
  Target,
  Brain,
  TrendingUp,
  Sparkles,
  Plus,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';

interface DashboardViewProps {
  onCreateDocument?: () => void;
  onViewAnalytics?: () => void;
  onNavigateToOpportunities?: () => void;
  onNavigateToApplications?: () => void;
}

// Mock data for demonstration
const mockDocuments = [
  {
    id: '1',
    document: {
      id: '1',
      title: 'Software Engineer Resume',
      type: 'resume' as const,
      status: 'completed' as const,
      version: '2.1',
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      atsScore: 87,
      tags: ['Tech', 'Senior Level'],
      aiGenerated: true
    }
  },
  {
    id: '2',
    document: {
      id: '2',
      title: 'Google Cover Letter',
      type: 'cover-letter' as const,
      status: 'completed' as const,
      version: '1.0',
      lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      atsScore: 92,
      tags: ['Tech', 'FAANG'],
      aiGenerated: true
    }
  },
  {
    id: '3',
    document: {
      id: '3',
      title: 'Product Manager Resume',
      type: 'resume' as const,
      status: 'draft' as const,
      version: '1.0',
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      atsScore: 78,
      tags: ['Product', 'Mid Level'],
      aiGenerated: false
    }
  }
];

const profileData = {
  totalApplications: 24,
  activeApplications: 8,
  interviewsScheduled: 3,
  lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  recentAchievements: [
    'ATS score improved by 15%',
    'Applied to 3 dream companies',
    'Resume optimized for tech roles'
  ]
};

export function DashboardView({
  onCreateDocument,
  onViewAnalytics,
  onNavigateToOpportunities,
  onNavigateToApplications
}: DashboardViewProps) {
  const {
    profile,
    onboardingStatus,
    isLoading,
    completionPercentage,
    calculateCompletion,
  } = useProfileCompletion();

  const [onboardingOpen, setOnboardingOpen] = useState(
    onboardingStatus.isFirstTimeUser && !onboardingStatus.stepsCompleted.includes('complete')
  );

  const profileCompletion = calculateCompletion();

  const handleEditProfile = () => {
    setOnboardingOpen(true);
  };

  const handleOnboardingComplete = () => {
    setOnboardingOpen(false);
  };

  return (
    <div
      className="flex-1 overflow-auto"
      style={{ background: 'var(--color-background)' }}
    >
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Banner */}
        <WelcomeBanner
          userName="Nishant"
          profileData={profileData}
          onCreateDocument={onCreateDocument}
          onViewAnalytics={onViewAnalytics}
        />

        {/* Profile Completion Card */}
        {completionPercentage < 100 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProfileCompletionCard
                completion={profileCompletion}
                onEditProfile={handleEditProfile}
              />
            </div>
          </div>
        )}

        {/* Quick Actions Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="font-semibold"
              style={{ 
                color: 'var(--on-surface)',
                fontSize: '1.25rem'
              }}
            >
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create Document Action */}
            <ActionCard
              title="Create New Document"
              description="Generate an AI-optimized resume or cover letter tailored to your target role"
              icon={FileText}
              variant="primary"
              status="available"
              priority="high"
              estimatedTime="5-10 min"
              actionText="Start Creating"
              onClick={onCreateDocument}
              aiPowered={true}
              badge={{
                text: "Most Popular",
                variant: "default"
              }}
            />

            {/* Find Opportunities */}
            <ActionCard
              title="Find Job Opportunities"
              description="Discover jobs that match your skills and get AI-powered insights on each role"
              icon={Target}
              variant="tertiary"
              status="available"
              priority="medium"
              estimatedTime="3-5 min"
              actionText="Browse Jobs"
              onClick={onNavigateToOpportunities}
              aiPowered={true}
            />

            {/* Track Applications */}
            <ActionCard
              title="Track Applications"
              description="Monitor your job applications, interview schedules, and follow-up actions"
              icon={TrendingUp}
              variant="secondary"
              status="available"
              priority="medium"
              actionText="View Tracker"
              onClick={onNavigateToApplications}
              metadata={[
                { label: "Active", value: 8 },
                { label: "Pending", value: 3 }
              ]}
            />
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="font-semibold"
              style={{ 
                color: 'var(--on-surface)',
                fontSize: '1.25rem'
              }}
            >
              Recent Documents
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateDocument}
              className="transition-all duration-300"
              style={{
                color: 'var(--primary)',
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc.document}
                onEdit={() => console.log('Edit', doc.id)}
                onDelete={() => console.log('Delete', doc.id)}
                onDownload={() => console.log('Download', doc.id)}
                onView={() => console.log('View', doc.id)}
              />
            ))}
          </div>
        </div>

        {/* Job Search Status Card */}
        <div 
          className="rounded-2xl p-6 border transition-all duration-300 hover:border-opacity-60"
          style={{
            background: 'rgba(30, 30, 35, 0.7)',
            backdropFilter: 'blur(24px)',
            borderColor: 'rgba(167, 139, 250, 0.2)',
            borderWidth: '2px'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(244, 114, 182, 0.2))',
                  boxShadow: '0 0 24px rgba(167, 139, 250, 0.3)'
                }}
              >
                <Brain className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--on-surface)' }}>
                  Job Search Intelligence
                </h3>
                <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  AI-powered insights and recommendations
                </p>
              </div>
            </div>
            <Sparkles className="w-5 h-5" style={{ color: 'var(--tertiary)' }} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="p-4 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--surface-container)',
                borderColor: 'rgba(167, 139, 250, 0.2)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  Applications
                </span>
              </div>
              <p className="font-semibold text-2xl" style={{ color: 'var(--on-surface)' }}>
                {profileData.activeApplications}
              </p>
              <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                Active this month
              </p>
            </div>

            <div 
              className="p-4 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--surface-container)',
                borderColor: 'rgba(244, 114, 182, 0.2)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" style={{ color: 'var(--tertiary)' }} />
                <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  Interviews
                </span>
              </div>
              <p className="font-semibold text-2xl" style={{ color: 'var(--on-surface)' }}>
                {profileData.interviewsScheduled}
              </p>
              <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                Scheduled
              </p>
            </div>

            <div 
              className="p-4 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--surface-container)',
                borderColor: 'rgba(167, 139, 250, 0.2)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  Response Rate
                </span>
              </div>
              <p className="font-semibold text-2xl" style={{ color: 'var(--on-surface)' }}>
                67%
              </p>
              <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                +12% this week
              </p>
            </div>

            <div 
              className="p-4 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--surface-container)',
                borderColor: 'rgba(244, 114, 182, 0.2)'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--tertiary)' }} />
                <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                  Avg ATS Score
                </span>
              </div>
              <p className="font-semibold text-2xl" style={{ color: 'var(--on-surface)' }}>
                85%
              </p>
              <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>
                Excellent
              </p>
            </div>
          </div>
        </div>

        {/* Onboarding Modal */}
        <OnboardingWizard
          open={onboardingOpen}
          onOpenChange={setOnboardingOpen}
          onComplete={handleOnboardingComplete}
          skipAllowed={!onboardingStatus.isFirstTimeUser}
        />
      </div>
    </div>
  );
}
