import React from 'react';
import { Sparkles, TrendingUp, Target, Clock } from 'lucide-react';
import { M3Card, M3CardContent } from '../ui/m3-card';
import { M3Button } from '../ui/m3-button';
import { Badge } from '../ui/badge';
import { formatRelativeTime } from '../ui/utils';

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
  className?: string;
}

export function WelcomeBanner({
  userName = "User",
  profileData,
  onCreateDocument,
  onViewAnalytics,
  onStartTour,
  className
}: WelcomeBannerProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMotivationalMessage = () => {
    if (!profileData) return "Ready to accelerate your career journey?";
    
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
    <M3Card variant="default" className={`overflow-hidden ${className}`}>
      <M3CardContent className="p-0">
        {/* Main Banner Section */}
        <div className="relative bg-gradient-to-br from-primary via-primary-container to-secondary p-8 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Welcome Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium opacity-90">
                    {getGreeting()}, {userName}!
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
                  {getMotivationalMessage()}
                </h1>
                
                <p className="text-white/80 text-base max-w-2xl">
                  Your AI-powered career companion is here to help you land your dream job. 
                  Let's review your progress and plan your next moves.
                </p>

                {/* Quick Stats */}
                {profileData && (
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                      <Target className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">
                        {profileData.activeApplications} Active Applications
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                      <TrendingUp className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium text-white">
                        {profileData.totalApplications} Total Applications
                      </span>
                    </div>
                    {profileData.interviewsScheduled > 0 && (
                      <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                        <Clock className="w-4 h-4 text-white" />
                        <span className="text-sm font-medium text-white">
                          {profileData.interviewsScheduled} Interviews Scheduled
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                <M3Button
                  variant="filled"
                  size="large"
                  onClick={onCreateDocument}
                  className="bg-white text-primary hover:bg-white/90"
                  icon={<Sparkles className="w-5 h-5" />}
                >
                  Create New Document
                </M3Button>
                <M3Button
                  variant="outlined"
                  size="large"
                  onClick={onViewAnalytics}
                  className="border-white text-white hover:bg-white/10"
                  icon={<TrendingUp className="w-5 h-5" />}
                >
                  View Analytics
                </M3Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Achievements */}
        <div className="p-6 bg-surface-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div>
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-2">
                {profileData?.lastActivity ? (
                  <div className="text-sm text-muted-foreground">
                    Last active {formatRelativeTime(profileData.lastActivity)}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Welcome back! Ready to make progress today?
                  </div>
                )}
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Resume updated recently
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    New job matches available
                  </Badge>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div>
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-tertiary" />
                Recent Achievements
              </h3>
              <div className="space-y-2">
                {profileData?.recentAchievements ? (
                  profileData.recentAchievements.map((achievement, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-tertiary rounded-full" />
                      {achievement}
                    </div>
                  ))
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Profile setup completed
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      First resume created
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-outline-variant">
            <div className="flex flex-wrap gap-3">
              <M3Button
                variant="text"
                size="small"
                onClick={onStartTour}
                className="text-primary"
              >
                Take a tour
              </M3Button>
              <M3Button
                variant="text"
                size="small"
                className="text-muted-foreground"
              >
                View tips
              </M3Button>
              <M3Button
                variant="text"
                size="small"
                className="text-muted-foreground"
              >
                Settings
              </M3Button>
            </div>
          </div>
        </div>
      </M3CardContent>
    </M3Card>
  );
}