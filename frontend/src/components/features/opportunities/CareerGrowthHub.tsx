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
} from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { Button, Card } from '@mui/material';

import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'skill' | 'career' | 'network' | 'certification';
  progress: number;
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
  milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
  }>;
}

interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'industry';
  currentLevel: number;
  targetLevel: number;
  demandScore: number;
  trending: boolean;
  resources: Array<{
    type: 'course' | 'article' | 'video' | 'book';
    title: string;
    url: string;
    duration?: string;
    rating?: number;
  }>;
}

interface CareerGrowthHubProps {
  onNavigate: (feature: 'job-matching' | 'career-intelligence' | 'interview-prep') => void;
  onBack: () => void;
  userGoals?: Goal[];
  userSkills?: Skill[];
  onAddGoal?: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal?: (goalId: string, updates: Partial<Goal>) => void;
}

// Mock data
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
          <Tabs defaultValue="overview" sx={{
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
            <TabsContent value="overview" sx={{}}>
              {/* Quick Stats */}
              <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
      gap: 4
    }}>
                <Card sx={{
      p: 6,
      textAlign: "center"
    }}>
                  <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2
    }}>
                    <Target sx={{
      color: "blue.500"
    }} />
                  </Box>
                  <Typography sx={{
      typography: "h4",
      fontWeight: 700,
      color: "blue.600"
    }}>
                    {userGoals.filter((g) => g.status === 'active').length}
                  </Typography>
                  <Typography sx={{
      typography: "body1",}}>Active Goals</Typography>
                </Card>
                <Card sx={{
      p: 6,
      textAlign: "center"
    }}>
                  <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2
    }}>
                    <BookOpen sx={{
      color: "green.500"
    }} />
                  </Box>
                  <Typography sx={{
      typography: "h4",
      fontWeight: 700,
      color: "green.600"
    }}>{userSkills.length}</Typography>
                  <Typography sx={{
      typography: "body1",}}>Skills Tracking</Typography>
                </Card>
                <Card sx={{
      p: 6,
      textAlign: "center"
    }}>
                  <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2
    }}>
                    <Trophy sx={{
      color: "amber.500"
    }} />
                  </Box>
                  <Typography sx={{
      typography: "h4",
      fontWeight: 700,
      color: "amber.600"
    }}>
                    {userGoals.filter((g) => g.status === 'completed').length}
                  </Typography>
                  <Typography sx={{
      typography: "body1",}}>Completed</Typography>
                </Card>
                <Card sx={{
      p: 6,
      textAlign: "center"
    }}>
                  <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2
    }}>
                    <TrendingUp sx={{
      color: "purple.500"
    }} />
                  </Box>
                  <Typography sx={{
      typography: "h4",
      fontWeight: 700,
      color: "purple.600"
    }}>
                    {Math.round(
                      userGoals.reduce((acc, g) => acc + g.progress, 0) / userGoals.length
                    )}
                    %
                  </Typography>
                  <Typography sx={{
      typography: "body1",}}>Avg Progress</Typography>
                </Card>
              </Box>

              {/* Recent Activity & Top Goals */}
              <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      gap: 8,
      mt: 8
    }}>
                <Card sx={{
      p: 6
    }}>
                  <Typography variant="h6" sx={{
      fontWeight: 600,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                    <Clock />
                    Recent Activity
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {userGoals.slice(0, 3).map((goal) => (
                      <Box
                        key={goal.id}
                        sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      p: 3,
      bgcolor: "grey.50",
      borderRadius: "0.5rem"
    }}
                      >
                        <Box sx={{
      bgcolor: "blue.100",
      borderRadius: "9999px",
      p: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                          <CheckCircle sx={{
      color: "blue.600"
    }} />
                        </Box>
                        <Box sx={{
      flex: 1
    }}>
                          <Typography sx={{
      fontWeight: 500,
      typography: "body1"
    }}>{goal.title}</Typography>
                          <Typography sx={{
      typography: "body2",}}>
                            Progress: {goal.progress}%
                          </Typography>
                        </Box>
                        <Progress value={goal.progress} sx={{ width: '100px' }} />
                      </Box>
                    ))}
                  </Box>
                </Card>

                <Card sx={{
      p: 6
    }}>
                  <Typography variant="h6" sx={{
      fontWeight: 600,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                    <Star />
                    Priority Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {userSkills.slice(0, 3).map((skill) => (
                      <Box key={skill.id}>
                        <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 1
    }}>
                          <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                            <Badge className={getSkillCategoryColor(skill.category)}>
                              {skill.name}
                            </Badge>
                            {skill.trending && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span>
                                      <TrendingUp sx={{
      color: "green.500"
    }} />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Trending skill in high demand</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </Box>
                          <Typography sx={{
      typography: "body2",}}>
                            {skill.currentLevel}/{skill.targetLevel}
                          </Typography>
                        </Box>
                        <Progress
                          value={(skill.currentLevel / skill.targetLevel) * 100}
                          sx={{ width: '100%' }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Box>
            </TabsContent>

            <TabsContent value="goals" data-testid="tabs-content-goals">
              {/* Goals content here */}
            </TabsContent>

            <TabsContent value="skills" data-testid="tabs-content-skills">
              {/* Skills content here */}
            </TabsContent>

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
      transition: 'all 0.3s',
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
      borderRadius: "9999px",
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
