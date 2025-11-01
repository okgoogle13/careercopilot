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
import { Box } from '@mui/material';
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
      <div sx={{
      minHeight: "100vh",
      "bg-background": true,
      p: 4
    }}>
        <div sx={{
      "max-w-7xl": true,
      "mx-auto": true
    }}>
          {/* Header */}
          <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 8
    }}>
            <Button variant="text" size="small" onClick={onBack}>
              <ArrowLeft sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
              Back to Dashboard
            </Button>
            <Button variant="outlined" size="small">
              <Plus sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
              Add Goal
            </Button>
          </div>

          <div sx={{
      textAlign: "center",
      mb: 8
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      mb: 4
    }}>
              <Sparkles sx={{
      "w-8": true,
      "h-8": true,
      "text-primary": true
    }} />
              <h1 sx={{
      typography: h2,
      fontWeight: 600
    }}>Career Growth Hub</h1>
            </div>
            <p sx={{
      "text-muted-foreground": true,
      typography: h5,
      "max-w-3xl": true,
      "mx-auto": true
    }}>
              Track your goals, develop skills, and leverage AI to supercharge your career growth.
            </p>
          </div>

          {/* Enhanced Navigation */}
          <Tabs defaultValue="overview" sx={{
      width: "100%"
    }}>
            <TabsList sx={{
      "grid": true,
      width: "100%",
      "grid-cols-4": true,
      mb: 8
    }}>
              <TabsTrigger value="overview" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <BarChart sx={{
      "w-4": true,
      "h-4": true
    }} />
                Overview
              </TabsTrigger>
              <TabsTrigger value="goals" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <Target sx={{
      "w-4": true,
      "h-4": true
    }} />
                Goals ({userGoals.length})
              </TabsTrigger>
              <TabsTrigger value="skills" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <BookOpen sx={{
      "w-4": true,
      "h-4": true
    }} />
                Skills ({userSkills.length})
              </TabsTrigger>
              <TabsTrigger value="ai-tools" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <Sparkles sx={{
      "w-4": true,
      "h-4": true
    }} />
                AI Tools
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" currentValue="overview" sx={{
      "space-y-8": true
    }}>
              {/* Quick Stats */}
              <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-4": true },
      gap: 4
    }}>
                <Card sx={{
      p: 6,
      textAlign: "center"
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2
    }}>
                    <Target sx={{
      "w-6": true,
      "h-6": true,
      color: "blue.500"
    }} />
                  </div>
                  <div sx={{
      typography: h4,
      fontWeight: 700,
      color: "blue.600"
    }}>
                    {userGoals.filter((g) => g.status === 'active').length}
                  </div>
                  <div sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Active Goals</div>
                </Card>
                <Card sx={{
      p: 6,
      textAlign: "center"
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2
    }}>
                    <BookOpen sx={{
      "w-6": true,
      "h-6": true,
      color: "green.500"
    }} />
                  </div>
                  <div sx={{
      typography: h4,
      fontWeight: 700,
      color: "green.600"
    }}>{userSkills.length}</div>
                  <div sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Skills Tracking</div>
                </Card>
                <Card sx={{
      p: 6,
      textAlign: "center"
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2
    }}>
                    <Trophy sx={{
      "w-6": true,
      "h-6": true,
      color: "amber.500"
    }} />
                  </div>
                  <div sx={{
      typography: h4,
      fontWeight: 700,
      color: "amber.600"
    }}>
                    {userGoals.filter((g) => g.status === 'completed').length}
                  </div>
                  <div sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Completed</div>
                </Card>
                <Card sx={{
      p: 6,
      textAlign: "center"
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2
    }}>
                    <TrendingUp sx={{
      "w-6": true,
      "h-6": true,
      color: "purple.500"
    }} />
                  </div>
                  <div sx={{
      typography: h4,
      fontWeight: 700,
      color: "purple.600"
    }}>
                    {Math.round(
                      userGoals.reduce((acc, g) => acc + g.progress, 0) / userGoals.length
                    )}
                    %
                  </div>
                  <div sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Avg Progress</div>
                </Card>
              </div>

              {/* Recent Activity & Top Goals */}
              <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('md')]: { "grid-cols-2": true },
      gap: 8
    }}>
                <Card sx={{
      p: 6
    }}>
                  <h3 sx={{
      typography: h6,
      fontWeight: 600,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                    <Clock sx={{
      "w-5": true,
      "h-5": true
    }} />
                    Recent Activity
                  </h3>
                  <div sx={{
      "space-y-3": true
    }}>
                    {userGoals.slice(0, 3).map((goal) => (
                      <div
                        key={goal.id}
                        sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      p: 3,
      bgcolor: "gray.50",
      borderRadius: 0.5rem
    }}
                      >
                        <div sx={{
      "w-8": true,
      "h-8": true,
      bgcolor: "blue.100",
      borderRadius: 9999px,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                          <CheckCircle sx={{
      "w-4": true,
      "h-4": true,
      color: "blue.600"
    }} />
                        </div>
                        <div sx={{
      flex: 1
    }}>
                          <p sx={{
      fontWeight: 500,
      typography: body1
    }}>{goal.title}</p>
                          <p sx={{
      typography: body2,
      "text-muted-foreground": true
    }}>
                            Progress: {goal.progress}%
                          </p>
                        </div>
                        <Progress value={goal.progress} sx={{
      "w-16": true,
      "h-2": true
    }} />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card sx={{
      p: 6
    }}>
                  <h3 sx={{
      typography: h6,
      fontWeight: 600,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                    <Star sx={{
      "w-5": true,
      "h-5": true
    }} />
                    Priority Skills
                  </h3>
                  <div sx={{
      "space-y-3": true
    }}>
                    {userSkills.slice(0, 3).map((skill) => (
                      <div key={skill.id} sx={{
      "space-y-2": true
    }}>
                        <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                            <Badge className={getSkillCategoryColor(skill.category)}>
                              {skill.name}
                            </Badge>
                            {skill.trending && (
                              <Tooltip title="Trending skill in high demand">
                                <span>
                                  <TrendingUp sx={{
      "w-3": true,
      "h-3": true,
      color: "green.500"
    }} />
                                </span>
                              </Tooltip>
                            )}
                          </div>
                          <span sx={{
      typography: body2,
      "text-muted-foreground": true
    }}>
                            {skill.currentLevel}/{skill.targetLevel}
                          </span>
                        </div>
                        <Progress
                          value={(skill.currentLevel / skill.targetLevel) * 100}
                          sx={{
      "h-2": true
    }}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ai-tools" currentValue="ai-tools" sx={{
      "space-y-8": true
    }}>
              <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('md')]: { "grid-cols-3": true },
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
      "${feature.borderColor}": true,
      '&:hover': { "border-primary": true },
      cursor: "pointer",
      "transition-all": true,
      "duration-300": true,
      '&:hover': { boxShadow: 5 },
      "group": true,
      "relative": true,
      overflow: "hidden"
    }}
                      onClick={() => onNavigate(feature.id)}
                    >
                      {/* Gemini AI Badge */}
                      <div sx={{
      "absolute": true,
      "top-4": true,
      "right-4": true
    }}>
                        <Badge sx={{
      "bg-primary/10": true,
      "text-primary": true,
      "border-primary/30": true
    }}>
                          <Sparkles sx={{
      "w-3": true,
      "h-3": true,
      mr: 1
    }} />
                          AI Powered
                        </Badge>
                      </div>

                      <div sx={{
      "space-y-6": true
    }}>
                        <div
                          sx={{
      p: 4,
      "${feature.bgColor}": true,
      borderRadius: 1rem,
      "w-fit": true,
      "group-hover:scale-110": true,
      "transition-transform": true,
      "duration-300": true
    }}
                        >
                          <Icon sx={{
      "w-8": true,
      "h-8": true,
      "${feature.color}": true
    }} />
                        </div>

                        <div>
                          <h3 sx={{
      typography: h4,
      fontWeight: 600,
      mb: 3
    }}>{feature.title}</h3>
                          <p sx={{
      "text-muted-foreground": true,
      "leading-relaxed": true
    }}>
                            {feature.description}
                          </p>
                        </div>

                        <div sx={{
      "space-y-2": true
    }}>
                          <h4 sx={{
      fontWeight: 500,
      typography: body1,
      "text-muted-foreground": true,
      textTransform: "uppercase",
      "tracking-wide": true
    }}>
                            Key Features
                          </h4>
                          <ul sx={{
      "space-y-1": true
    }}>
                            {feature.benefits.map((benefit, index) => (
                              <li key={index} sx={{
      typography: body1,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                                <div sx={{
      "w-1.5": true,
      "h-1.5": true,
      "bg-primary": true,
      borderRadius: 9999px
    }} />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          sx={{
      width: "100%",
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true },
      "group-hover:bg-primary/90": true
    }}
                          size="large"
                        >
                          Explore {feature.title}
                          <ArrowRight sx={{
      "w-4": true,
      "h-4": true,
      ml: 2,
      "group-hover:translate-x-1": true,
      "transition-transform": true
    }} />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Additional Info */}
          <Card sx={{
      p: 8,
      "bg-gradient-to-r": true,
      "from-primary/5": true,
      "to-purple-500/5": true,
      "border-primary/20": true,
      mt: 8
    }}>
            <div sx={{
      textAlign: "center",
      "space-y-4": true
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2
    }}>
                <Sparkles sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true
    }} />
                <h3 sx={{
      typography: h5,
      fontWeight: 600
    }}>Powered by Advanced AI</h3>
              </div>
              <p sx={{
      "text-muted-foreground": true,
      "max-w-2xl": true,
      "mx-auto": true
    }}>
                Our career growth tools are powered by cutting-edge AI technology that analyzes
                market trends, job requirements, and your unique profile to provide personalized
                career guidance.
              </p>
              <div sx={{
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
              </div>
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
