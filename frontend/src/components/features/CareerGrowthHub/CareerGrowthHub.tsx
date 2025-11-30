import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart,
  MenuBook as BookOpen,
  CheckCircle,
  Schedule as Clock,
  MessageSharp as MessageSquare,
  Add as Plus,
  AutoAwesome as Sparkles,
  Star,
  GpsFixed as Target,
  TrendingUp,
  EmojiEvents as Trophy,
  Workspaces as WorkspacesIcon,
  Insights as InsightsIcon,
  ModelTraining as ModelTrainingIcon,
} from '@mui/icons-material';
import { Box, Typography, Card, Button } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { FeatureCard } from './FeatureCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { Badge } from '../../ui/badge';
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Master React Advanced Patterns',
    description: 'Deep dive into advanced React patterns and state management',
    category: 'skill',
    progress: 65,
    targetDate: '2025-03-01',
    status: 'active',
    milestones: [
      { id: '1', title: 'Complete Context API course', completed: true },
      { id: '2', title: 'Build Redux project', completed: true },
      {
        id: '3',
        title: 'Learn React Query',
        completed: false,
        dueDate: '2025-01-15',
      },
      {
        id: '4',
        title: 'Master Zustand',
        completed: false,
        dueDate: '2025-02-01',
      },
    ],
  },
  {
    id: '2',
    title: 'Achieve Senior Developer Role',
    description:
      'Transition to senior developer position with leadership responsibilities',
    category: 'career',
    progress: 40,
    targetDate: '2025-06-01',
    status: 'active',
    milestones: [
      { id: '1', title: 'Complete technical leadership course', completed: false },
      { id: '2', title: 'Mentor 2 junior developers', completed: false },
      { id: '3', title: 'Lead a major project', completed: false },
    ],
  },
];
const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'React.js',
    category: 'technical',
    currentLevel: 8,
    targetLevel: 10,
    demandScore: 95,
    trending: true,
    resources: [
      {
        type: 'course',
        title: 'Advanced React Patterns',
        url: '#',
        duration: '12h',
        rating: 4.8,
      },
      { type: 'article', title: 'React 18 New Features', url: '#', rating: 4.5 },
    ],
  },
  {
    id: '2',
    name: 'Leadership',
    category: 'soft',
    currentLevel: 6,
    targetLevel: 9,
    demandScore: 88,
    trending: false,
    resources: [
      { type: 'book', title: "The Manager's Path", url: '#', rating: 4.7 },
      {
        type: 'course',
        title: 'Technical Leadership',
        url: '#',
        duration: '8h',
        rating: 4.6,
      },
    ],
  },
];
const features = [
  {
    id: 'job-matching' as const,
    title: 'AI Job Matching',
    description:
      'Find roles that perfectly match your skills and experience using advanced AI analysis.',
    icon: Target,
    color: 'var(--sys-color-primary)',
    bgColor: 'var(--sys-color-primary-container)',
    benefits: [
      'Personalized job recommendations',
      'Skill gap analysis',
      'Salary insights',
    ],
  },
  {
    id: 'career-intelligence' as const,
    title: 'Career Intelligence',
    description:
      'Get data-driven insights about your career trajectory and growth opportunities.',
    icon: TrendingUp,
    color: 'var(--sys-color-secondary)',
    bgColor: 'var(--sys-color-secondary-container)',
    benefits: [
      'Career path analysis',
      'Market trend insights',
      'Skill demand forecasting',
    ],
  },
  {
    id: 'interview-prep' as const,
    title: 'Interview Preparation',
    description:
      'Practice with AI-powered mock interviews tailored to your target roles.',
    icon: MessageSquare,
    color: 'var(--sys-color-tertiary)',
    bgColor: 'var(--sys-color-tertiary-container)',
    benefits: [
      'Behavioral question practice',
      'Industry-specific scenarios',
      'Personalized feedback',
    ],
  },
];
export function CareerGrowthHub({
  onNavigate,
  onBack,
  userGoals = mockGoals,
  userSkills = mockSkills,
}: CareerGrowthHubProps) {
  const [value, setValue] = React.useState('overview');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <TooltipProvider>
      <Box
        sx={{
          minHeight: '100vh',
          p: 'var(--sys-spacing-4)',
          backgroundColor: 'var(--sys-color-surface)',
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 'var(--sys-spacing-8)',
            }}
          >
            <Button
              variant="text"
              size="small"
              onClick={onBack}
              sx={{ color: 'var(--sys-color-on-surface)' }}
            >
              <ArrowLeft sx={{ mr: 'var(--sys-spacing-2)' }} />
              Back to Dashboard
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'var(--sys-color-outline)',
                color: 'var(--sys-color-primary)',
              }}
            >
              <Plus sx={{ mr: 'var(--sys-spacing-2)' }} />
              Add Goal
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 'var(--sys-spacing-8)' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--sys-spacing-2)',
                mb: 'var(--sys-spacing-4)',
              }}
            >
              <Sparkles sx={{ color: 'var(--sys-color-primary)' }} />
              <Typography
                variant="h1"
                sx={{
                  font: 'var(--sys-type-display-small)',
                  fontWeight: 'var(--sys-type-weight-bold)',
                  color: 'var(--sys-color-on-surface)',
                }}
              >
                Career Growth Hub
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                font: 'var(--sys-type-headline-small)',
                color: 'var(--sys-color-on-surface-variant)',
              }}
            >
              Track your goals, develop skills, and leverage AI to supercharge
              your career growth.
            </Typography>
          </Box>
          <TabContext value={value}>
            <Tabs
              onChange={handleChange}
              defaultValue="overview"
              sx={{ width: '100%' }}
            >
              <TabsList
                sx={{
                  width: '100%',
                  mb: 'var(--sys-spacing-8)',
                  backgroundColor: 'var(--sys-color-surface-container)',
                }}
              >
                <TabsTrigger
                  value="overview"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sys-spacing-2)',
                  }}
                >
                  <BarChart />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="goals"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sys-spacing-2)',
                  }}
                >
                  <Target />
                  Goals ({userGoals.length})
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sys-spacing-2)',
                  }}
                >
                  <BookOpen />
                  Skills ({userSkills.length})
                </TabsTrigger>
                <TabsTrigger
                  value="ai-tools"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sys-spacing-2)',
                  }}
                >
                  <Sparkles />
                  AI Tools
                </TabsTrigger>
              </TabsList>
              <TabPanel value="overview" data-testid="tabs-content-overview">
                <Typography variant="h6">Overview Content</Typography>
              </TabPanel>
              <TabPanel value="goals" data-testid="tabs-content-goals">
                {userGoals.length > 0 ? (
                  userGoals.map((goal) => (
                    <div key={goal.id}>
                      <Typography variant="h6">{goal.title}</Typography>
                      <Typography>{goal.description}</Typography>
                    </div>
                  ))
                ) : (
                  <Typography>No goals set yet.</Typography>
                )}
              </TabPanel>
              <TabPanel value="skills" data-testid="tabs-content-skills">
                {userSkills.length > 0 ? (
                  userSkills.map((skill) => (
                    <div key={skill.id}>
                      <Typography variant="h6">{skill.name}</Typography>
                    </div>
                  ))
                ) : (
                  <Typography>No skills to display.</Typography>
                )}
              </TabPanel>
              <TabPanel value="ai-tools" data-testid="tabs-content-ai-tools">
                <Box
                  sx={{
                    display: 'flex',
                    gap: 'var(--sys-spacing-2)',
                    flexWrap: 'wrap',
                  }}
                >
                  <FeatureCard
                    title="AI Job Matching"
                    description="Get matched with jobs that fit your skills and goals."
                    icon={<WorkspacesIcon />}
                    onClick={() => onNavigate('job-matching')}
                  />
                  <FeatureCard
                    title="Career Intelligence"
                    description="Gain insights into career paths and salary expectations."
                    icon={<InsightsIcon />}
                    onClick={() => onNavigate('career-intelligence')}
                  />
                  <FeatureCard
                    title="Interview Preparation"
                    description="Practice with AI-powered interview simulations."
                    icon={<ModelTrainingIcon />}
                    onClick={() => onNavigate('interview-prep')}
                  />
                </Box>
              </TabPanel>

              <TabsContent value="ai-tools" sx={{}}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: 'var(--sys-spacing-8)',
                    mb: 'var(--sys-spacing-12)',
                  }}
                >
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <Card
                        key={feature.id}
                        sx={{
                          p: 'var(--sys-spacing-8)',
                          border:
                            '2px solid var(--sys-color-outline-variant)',
                          transition:
                            'all var(--sys-motion-duration-medium2)',
                          '&:hover': {
                            boxShadow: 'var(--sys-elevation-level2)',
                            transform: 'translateY(-4px)',
                            borderColor: 'var(--sys-color-primary)',
                          },
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                        onClick={() => onNavigate(feature.id)}
                      >
                        <Box sx={{ mb: 'var(--sys-spacing-4)', textAlign: 'right' }}>
                          <Badge
                            sx={{
                              backgroundColor:
                                'var(--sys-color-tertiary-container)',
                              color: 'var(--sys-color-on-tertiary-container)',
                            }}
                          >
                            <Sparkles sx={{ mr: 1, fontSize: '1rem' }} />
                            AI Powered
                          </Badge>
                        </Box>
                        <Box
                          sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              p: 'var(--sys-spacing-4)',
                              borderRadius: '1rem',
                              mb: 'var(--sys-spacing-4)',
                              display: 'inline-flex',
                              backgroundColor: feature.bgColor,
                              color: feature.color,
                            }}
                          >
                            <Icon sx={{ fontSize: '2.5rem' }} />
                          </Box>
                          <Box>
                            <Typography
                              variant="h5"
                              sx={{
                                font: 'var(--sys-type-headline-small)',
                                fontWeight: 'var(--sys-type-weight-semibold)',
                                mb: 'var(--sys-spacing-3)',
                              }}
                            >
                              {feature.title}
                            </Typography>
                            <Typography
                              sx={{
                                color: 'var(--sys-color-on-surface-variant)',
                                flexGrow: 1,
                                mb: 'var(--sys-spacing-4)',
                              }}
                            >
                              {feature.description}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              mb: 'var(--sys-spacing-6)',
                              width: '100%',
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 'var(--sys-type-weight-medium)',
                                font: 'var(--sys-type-label-large)',
                                textTransform: 'uppercase',
                                color: 'var(--sys-color-on-surface-variant)',
                                mb: 'var(--sys-spacing-2)',
                              }}
                            >
                              Key Features
                            </Typography>
                            <ul
                              style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--sys-spacing-1.5)',
                              }}
                            >
                              {feature.benefits.map((benefit, index) => (
                                <li
                                  key={index}
                                  style={{
                                    font: 'var(--sys-type-body-large)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--sys-spacing-2)',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius:
                                        'var(--sys-shape-corner-full)',
                                      backgroundColor: feature.color,
                                      opacity: 0.5,
                                    }}
                                  />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </Box>
                          <Button
                            sx={{
                              width: '100%',
                              mt: 'auto',
                              backgroundColor: feature.color,
                              color: 'var(--sys-color-on-primary)',
                              '&:hover': {
                                backgroundColor: feature.color,
                                filter: 'brightness(0.9)',
                              },
                            }}
                            size="large"
                          >
                            Explore {feature.title}
                            <ArrowRight sx={{ ml: 'var(--sys-spacing-2)' }} />
                          </Button>
                        </Box>
                      </Card>
                    );
                  })}
                </Box>
              </TabsContent>
            </Tabs>
          </TabContext>
          <Card
            sx={{
              p: 'var(--sys-spacing-8)',
              mt: 'var(--sys-spacing-8)',
              backgroundColor: 'var(--sys-color-surface-container-low)',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--sys-spacing-2)',
                }}
              >
                <Sparkles sx={{ color: 'var(--sys-color-primary)' }} />
                <Typography
                  variant="h5"
                  sx={{
                    font: 'var(--sys-type-headline-small)',
                    fontWeight: 'var(--sys-type-weight-semibold)',
                  }}
                >
                  Powered by Advanced AI
                </Typography>
              </Box>
              <Typography
                sx={{
                  mt: 'var(--sys-spacing-2)',
                  color: 'var(--sys-color-on-surface-variant)',
                  font: 'var(--sys-type-body-large)',
                }}
              >
                Our career growth tools are powered by cutting-edge AI technology
                that analyzes market trends, job requirements, and your unique
                profile to provide personalized career guidance.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 'var(--sys-spacing-3)',
                  pt: 'var(--sys-spacing-4)',
                }}
              >
                {[
                  'Machine Learning',
                  'Natural Language Processing',
                  'Real-time Data Analysis',
                  'Personalized Recommendations',
                ].map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </TooltipProvider>
  );
}