/**
 * ELECTRIC ALCHEMIST: WELCOME BANNER FEATURE
 *
 * Welcome banner with greeting, stats, and quick actions.
 */

import React from 'react';
import { Sparkles, TrendingUp, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Card } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

interface WelcomeBannerProps {
  userName?: string;
  profileData?: {
    totalApplications: number;
    activeApplications: number;
    interviewsScheduled: number;
    lastActivity: Date | string;
    recentAchievements?: string[];
  };
  onCreateDocument?: () => void;
  onViewAnalytics?: () => void;
  onStartTour?: () => void;
}

const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName = 'User',
  profileData,
  onCreateDocument,
  onViewAnalytics,
  onStartTour,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (!profileData) return 'Ready to accelerate your career journey?';

    const { activeApplications, interviewsScheduled } = profileData;

    if (interviewsScheduled > 0) {
      return `You have ${interviewsScheduled} interview${interviewsScheduled > 1 ? 's' : ''} coming up. You've got this! 🚀`;
    }

    if (activeApplications > 5) {
      return "You're actively pursuing multiple opportunities. Keep the momentum going! 💪";
    }

    if (activeApplications > 0) {
      return "Great progress on your job search. Let's optimize your approach! ⭐";
    }

    return "Ready to kickstart your career journey? Let's build something amazing! ✨";
  };

  return (
    <Card className="overflow-hidden p-0">
      {/* Main Banner Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-container to-secondary p-6 text-on-primary-container">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 right-4 w-64 h-64 bg-white rounded-full blur-24" />
          <div className="absolute bottom-4 left-4 w-48 h-48 bg-white rounded-full blur-16" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Welcome Content */}
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="h-5 w-5" />
                <p className="text-human text-sm opacity-90 font-medium">
                  {getGreeting()}, {userName}!
                </p>
              </div>

              <h1 className="text-hero text-3xl md:text-4xl font-bold mb-2">
                {getMotivationalMessage()}
              </h1>

              <p className="text-human text-base opacity-80 max-w-2xl mb-4">
                Your AI-powered career companion is here to help you land your dream job. Let's
                review your progress and plan your next moves.
              </p>

              {/* Quick Stats */}
              {profileData && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge className="bg-white/10 text-white backdrop-blur-sm border-white/20">
                    <Target className="h-4 w-4 mr-1" />
                    {profileData.activeApplications} Active Applications
                  </Badge>
                  <Badge className="bg-white/10 text-white backdrop-blur-sm border-white/20">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {profileData.totalApplications} Total Applications
                  </Badge>
                  {profileData.interviewsScheduled > 0 && (
                    <Badge className="bg-white/10 text-white backdrop-blur-sm border-white/20">
                      <Clock className="h-4 w-4 mr-1" />
                      {profileData.interviewsScheduled} Interviews Scheduled
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row lg:flex-col gap-2 min-w-[240px]">
              <Button
                onClick={onCreateDocument}
                className="bg-white text-primary hover:bg-white/90 flex-1 lg:flex-initial"
                size="lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create New Document
              </Button>
              <Button
                variant="outline"
                onClick={onViewAnalytics}
                className="border-white text-white hover:bg-white/10 flex-1 lg:flex-initial"
                size="lg"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Achievements */}
      <div className="p-6 bg-surface-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-hero text-base font-semibold text-on-surface">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-1">
              {profileData?.lastActivity ? (
                <p className="text-human text-sm text-on-surface-variant">
                  Last active {formatRelativeTime(profileData.lastActivity)}
                </p>
              ) : (
                <p className="text-human text-sm text-on-surface-variant">
                  Welcome back! Ready to make progress today?
                </p>
              )}
              <div className="flex gap-1 flex-wrap mt-1">
                <Badge variant="outline" size="sm">Resume updated recently</Badge>
                <Badge variant="outline" size="sm">New job matches available</Badge>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Sparkles className="h-4 w-4 text-tertiary" />
              <h3 className="text-hero text-base font-semibold text-on-surface">
                Recent Achievements
              </h3>
            </div>
            <div className="space-y-1.5">
              {profileData?.recentAchievements ? (
                profileData.recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-tertiary" />
                    <p className="text-human text-sm text-on-surface-variant">{achievement}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <p className="text-human text-sm text-on-surface-variant">
                      Profile setup completed
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    <p className="text-human text-sm text-on-surface-variant">
                      First resume created
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-outline-variant">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={onStartTour}>
              Take a tour
            </Button>
            <Button variant="ghost" size="sm">
              View tips
            </Button>
            <Button variant="ghost" size="sm">
              Settings
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeBanner;

