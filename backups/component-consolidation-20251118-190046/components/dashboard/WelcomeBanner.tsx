import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  alpha,
} from '@mui/material';
import {
  Sparkles,
  TrendingUp,
  Target,
  Clock,
} from 'lucide-react';

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
    <Card
      sx={{
        overflow: 'hidden',
        borderRadius: 4,
        background: 'transparent',
        backgroundImage: 'none',
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Main Banner Section with Gradient */}
        <Box
          sx={{
            position: 'relative',
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
            p: 6,
            color: 'white',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.1,
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 256,
                height: 256,
                bgcolor: 'white',
                borderRadius: 'var(--sys-shape-radius-full)',
                filter: 'blur(96px)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                width: 192,
                height: 192,
                bgcolor: 'white',
                borderRadius: 'var(--sys-shape-radius-full)',
                filter: 'blur(64px)',
              }}
            />
          </Box>

          {/* Content */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                alignItems: { lg: 'center' },
                justifyContent: { lg: 'space-between' },
                gap: 4,
              }}
            >
              {/* Welcome Content */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Sparkles size={20} color="white" />
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.9,
                      fontWeight: 500,
                      color: 'white',
                    }}
                  >
                    {getGreeting()}, {userName}!
                  </Typography>
                </Box>
                
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'white',
                    fontSize: { xs: '1.75rem', md: '2.125rem' },
                  }}
                >
                  {getMotivationalMessage()}
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    maxWidth: 800,
                    mb: 3,
                  }}
                >
                  Your AI-powered career companion is here to help you land your dream job. 
                  Let's review your progress and plan your next moves.
                </Typography>

                {/* Quick Stats */}
                {profileData && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 4 }}>
                    <Chip
                      icon={<Target size={16} color="white" />}
                      label={`${profileData.activeApplications} Active Applications`}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontWeight: 500,
                        backdropFilter: 'blur(8px)',
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      }}
                    />
                    <Chip
                      icon={<TrendingUp size={16} color="white" />}
                      label={`${profileData.totalApplications} Total Applications`}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontWeight: 500,
                        backdropFilter: 'blur(8px)',
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      }}
                    />
                    {profileData.interviewsScheduled > 0 && (
                      <Chip
                        icon={<Clock size={16} color="white" />}
                        label={`${profileData.interviewsScheduled} Interviews Scheduled`}
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontWeight: 500,
                          backdropFilter: 'blur(8px)',
                          '& .MuiChip-icon': {
                            color: 'white',
                          },
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'row', lg: 'column' },
                  gap: 2,
                  minWidth: { lg: 240 },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Sparkles size={20} />}
                  onClick={onCreateDocument}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    flex: { xs: 1, lg: 'initial' },
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  fullWidth
                >
                  Create New Document
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<TrendingUp size={20} />}
                  onClick={onViewAnalytics}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    flex: { xs: 1, lg: 'initial' },
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      borderWidth: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  fullWidth
                >
                  View Analytics
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Recent Activity & Achievements */}
        <Box
          sx={{
            p: 4,
            bgcolor: 'surface.container',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: 4,
            }}
          >
            {/* Recent Activity */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Clock size={16} color="var(--sys-color-primary)" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {profileData?.lastActivity ? (
                  <Typography variant="body2" color="text.secondary">
                    Last active {formatRelativeTime(profileData.lastActivity)}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Welcome back! Ready to make progress today?
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip label="Resume updated recently" size="small" />
                  <Chip label="New job matches available" size="small" />
                </Box>
              </Box>
            </Box>

            {/* Recent Achievements */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Sparkles size={16} color="var(--sys-color-tertiary)" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Achievements
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {profileData?.recentAchievements ? (
                  profileData.recentAchievements.map((achievement, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'tertiary.main',
                          borderRadius: 'var(--sys-shape-radius-full)',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {achievement}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'primary.main',
                          borderRadius: 'var(--sys-shape-radius-full)',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Profile setup completed
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'secondary.main',
                          borderRadius: 'var(--sys-shape-radius-full)',
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        First resume created
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box
            sx={{
              mt: 4,
              pt: 4,
              borderTop: 1,
              borderColor: 'outline.variant',
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="text"
                size="small"
                onClick={onStartTour}
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Take a tour
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                View tips
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Settings
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;
