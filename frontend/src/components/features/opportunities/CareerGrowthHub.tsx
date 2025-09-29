import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import {
  ArrowLeft,
  AutoAwesome as Sparkles,
  GpsFixed as Target,
  TrendingUp,
  ChatBubble as MessageSquare,
  ArrowRight,
  Book as BookOpen,
  EmojiEvents as Trophy,
  Schedule as Clock,
  Users,
  CheckCircle,
  Add as Plus,
  Star,
  BarChart as BarChart3,
} from '@mui/icons-material';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';

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
    icon: GpsFixed as Target,
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
    icon: ChatBubble as MessageSquare,
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
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="text" size="small" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="outlined" size="small">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AutoAwesome as Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-semibold">Career Growth Hub</h1>
            </div>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
              Track your goals, develop skills, and leverage AI to supercharge your career growth.
            </p>
          </div>

          {/* Enhanced Navigation */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart as BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Goals ({userGoals.length})
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Skills ({userSkills.length})
              </TabsTrigger>
              <TabsTrigger value="ai-tools" className="flex items-center gap-2">
                <AutoAwesome as Sparkles className="w-4 h-4" />
                AI Tools
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {userGoals.filter((g) => g.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Goals</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{userSkills.length}</div>
                  <div className="text-sm text-muted-foreground">Skills Tracking</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-amber-600">
                    {userGoals.filter((g) => g.status === 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(
                      userGoals.reduce((acc, g) => acc + g.progress, 0) / userGoals.length
                    )}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Progress</div>
                </Card>
              </div>

              {/* Recent Activity & Top Goals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {userGoals.slice(0, 3).map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{goal.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Progress: {goal.progress}%
                          </p>
                        </div>
                        <Progress value={goal.progress} className="w-16 h-2" />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Priority Skills
                  </h3>
                  <div className="space-y-3">
                    {userSkills.slice(0, 3).map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={getSkillCategoryColor(skill.category)}>
                              {skill.name}
                            </Badge>
                            {skill.trending && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <TrendingUp className="w-3 h-3 text-green-500" />
                                </TooltipTrigger>
                                <TooltipContent>Trending skill in high demand</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {skill.currentLevel}/{skill.targetLevel}
                          </span>
                        </div>
                        <Progress
                          value={(skill.currentLevel / skill.targetLevel) * 100}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ai-tools" className="space-y-8">
              {/* Feature Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={feature.id}
                      className={`p-8 border-2 ${feature.borderColor} hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-xl group relative overflow-hidden`}
                      onClick={() => onNavigate(feature.id)}
                    >
                      {/* Gemini AI Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary/10 text-primary border-primary/30">
                          <AutoAwesome as Sparkles className="w-3 h-3 mr-1" />
                          AI Powered
                        </Badge>
                      </div>

                      <div className="space-y-6">
                        <div
                          className={`p-4 ${feature.bgColor} rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className={`w-8 h-8 ${feature.color}`} />
                        </div>

                        <div>
                          <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                            Key Features
                          </h4>
                          <ul className="space-y-1">
                            {feature.benefits.map((benefit, index) => (
                              <li key={index} className="text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          className="w-full bg-primary hover:bg-primary/90 group-hover:bg-primary/90"
                          size="large"
                        >
                          Explore {feature.title}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Additional Info */}
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 mt-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <AutoAwesome as Sparkles className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Powered by Advanced AI</h3>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our career growth tools are powered by cutting-edge AI technology that analyzes
                market trends, job requirements, and your unique profile to provide personalized
                career guidance.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
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
