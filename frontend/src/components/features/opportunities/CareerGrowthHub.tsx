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
import { Box, Typography, useTheme } from '@mui/material';
import { Button, Card } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { FeatureCard } from './FeatureCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
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
      { id: '3', title: 'Learn React Query', completed: false, dueDate: '2025-01-15' },
      { id: '4', title: 'Master Zustand', completed: false, dueDate: '2025-02-01' },
    ],
  },
  {
    id: '2',
    title: 'Achieve Senior Developer Role',
    description: 'Transition to senior developer position with leadership responsibilities',
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
  {
    id: '3',
    title: 'AWS Solutions Architect Certification',
    description: 'Get certified as AWS Solutions Architect Associate',
    category: 'certification',
    progress: 20,
    targetDate: '2025-04-01',
    status: 'active',
    milestones: [
      { id: '1', title: 'Complete AWS fundamentals', completed: true },
      { id: '2', title: 'Practice labs', completed: false },
      { id: '3', title: 'Take practice exams', completed: false },
      { id: '4', title: 'Schedule certification exam', completed: false },
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
      { type: 'course', title: 'Advanced React Patterns', url: '#', duration: '12h', rating: 4.8 },
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
      { type: 'course', title: 'Technical Leadership', url: '#', duration: '8h', rating: 4.6 },
    ],
  },
  {
    id: '3',
    name: 'TypeScript',
    category: 'technical',
    currentLevel: 7,
    targetLevel: 9,
    demandScore: 92,
    trending: true,
    resources: [
      { type: 'course', title: 'TypeScript Deep Dive', url: '#', duration: '15h', rating: 4.9 },
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
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    benefits: ['Personalized job recommendations', 'Skill gap analysis', 'Salary insights'],
  },
  {
    id: 'career-intelligence' as const,
    title: 'Career Intelligence',
    description: 'Get data-driven insights about your career trajectory and growth opportunities.',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    benefits: ['Career path analysis', 'Market trend insights', 'Skill demand forecasting'],
  },
  {
    id: 'interview-prep' as const,
    title: 'Interview Preparation',
    description: 'Practice with AI-powered mock interviews tailored to your target roles.',
    icon: MessageSquare,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
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
  const theme = useTheme();
  const [value, setValue] = React.useState('overview');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getSkillCategoryColor = (category: Skill['category']) => {
    const colors = {
      technical: 'text-blue-500 bg-blue-50',
      soft: 'text-green-500 bg-green-50',
      industry: 'text-purple-500 bg-purple-50',
    };
    return colors[category] || 'text-gray-500 bg-gray-50';
  };

  return (
    <TooltipProvider>
      <Box sx={{
      minHeight: "100vh",
      p: 4
    }}>
        <Box>
          {/* Header */}
          <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 8
    }}>
            <Button variant="text" size="small" onClick={onBack}>
              <ArrowLeft sx={{
      mr: 2
    }} />
              Back to Dashboard
            </Button>
            <Button variant="outlined" size="small">
              <Plus sx={{
      mr: 2
    }} />
              Add Goal
            </Button>
          </Box>

          <Box sx={{
      textAlign: "center",
      mb: 8
    }}>
            <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      mb: 4
    }}>
              <Sparkles />
              <Typography variant="h2" sx={{
      fontWeight: 600
    }}>Career Growth Hub</Typography>
            </Box>
            <Typography variant="h5">
              Track your goals, develop skills, and leverage AI to supercharge your career growth.
            </Typography>
          </Box>

          {/* Enhanced Navigation */}
          <TabContext value={value}>
            <Tabs onChange={handleChange} defaultValue="overview" sx={{
      width: "100%"
    }}>
              <TabsList sx={{
      width: "100%",
      mb: 8
    }}>
                <TabsTrigger value="overview" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <BarChart />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="goals" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <Target />
                  Goals ({userGoals.length})
                </TabsTrigger>
                <TabsTrigger value="skills" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <BookOpen />
                  Skills ({userSkills.length})
                </TabsTrigger>
                <TabsTrigger value="ai-tools" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <Sparkles />
                  AI Tools
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
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
  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
      gap: 8,
      mb: 12
    }}>
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <Card
                        key={feature.id}
                        sx={{
      p: 8,
      border: 2,
      borderColor: 'grey.200',
      transition: 'all var(--sys-motion-duration-medium2)',
      '&:hover': {
        boxShadow: 6,
        transform: 'translateY(-4px)',
        borderColor: 'primary.main',
      },
      cursor: "pointer",
      display: 'flex',
      flexDirection: 'column'
    }}
                        onClick={() => onNavigate(feature.id)}
                      >
                        {/* Gemini AI Badge */}
                        <Box sx={{ mb: 4, textAlign: 'right' }}>
                          <Badge sx={{ bgcolor: 'purple.100', color: 'purple.800' }}>
                            <Sparkles sx={{
      mr: 1,
      fontSize: '1rem'
    }} />
                            AI Powered
                          </Badge>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                          <Box
                            sx={{
      p: 4,
      borderRadius: "1rem",
      mb: 4,
      display: 'inline-flex',
      bgcolor: feature.bgColor,
      color: feature.color
    }}
                          >
                            <Icon sx={{ fontSize: '2.5rem' }} />
                          </Box>

                          <Box>
                            <Typography variant="h5" sx={{
      fontWeight: 600,
      mb: 3
    }}>{feature.title}</Typography>
                            <Typography sx={{
      color: 'text.secondary',
      flexGrow: 1,
      mb: 4
    }}>
                              {feature.description}
                            </Typography>
                          </Box>

                          <Box sx={{
      mb: 6,
      width: '100%'
    }}>
                            <Typography sx={{
      fontWeight: 500,
      typography: "body1",
      textTransform: "uppercase",
      color: 'text.secondary',
      mb: 2
    }}>
                              Key Features
                            </Typography>
                            <ul sx={{
      listStyle: 'none',
      p: 0,
      m: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5
    }}>
                              {feature.benefits.map((benefit, index) => (
                                <li key={index} sx={{
      typography: "body1",
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                                  <Box sx={{
      width: 6,
      height: 6,
      borderRadius: "var(--sys-shape-radius-full)",
      bgcolor: feature.color,
      opacity: 0.5
    }} />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </Box>

                          <Button
                            sx={{
      width: "100%",
      mt: 'auto',
      bgcolor: feature.color,
      color: 'common.white',
      '&:hover': { bgcolor: feature.color, filter: 'brightness(0.9)' },
    }}
                            size="large"
                          >
                            Explore {feature.title}
                            <ArrowRight sx={{
      ml: 2,}} />
                          </Button>
                        </Box>
                      </Card>
                    );
                  })}
                </Box>
              </TabsContent>
            </Tabs>
          </TabContext>

                    {/* Additional Info */}

                    <Card sx={{

                p: 8,

                mt: 8

              }}>

                      <Box sx={{

                textAlign: "center",}}>

                        <Box sx={{

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                gap: 2

              }}>

                          <Sparkles />

                          <Typography variant="h5" sx={{

                fontWeight: 600

              }}>Powered by Advanced AI</Typography>

                        </Box>

                        <Typography sx={{
                mt: 2,
                color: 'text.secondary'
              }}>

                          Our career growth tools are powered by cutting-edge AI technology that analyzes

                          market trends, job requirements, and your unique profile to provide personalized

                          career guidance.

                        </Typography>

                        <Box sx={{

                display: "flex",

                flexWrap: "wrap",

                justifyContent: "center",

                gap: 3,

                pt: 4

              }}>

                          <Badge variant="secondary">Machine Learning</Badge>

                          <Badge variant="secondary">Natural Language Processing</Badge>

                          <Badge variant="secondary">Real-time Data Analysis</Badge>

                          <Badge variant="secondary">Personalized Recommendations</Badge>

                        </Box>

                      </Box>

                    </Card>
        </Box>
      </Box>
    </TooltipProvider>
  );
}
