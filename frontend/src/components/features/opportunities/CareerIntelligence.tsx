import { useState } from 'react';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ArrowLeft, Sparkles, TrendingUp, Target, BookOpen, AlertCircle } from '@mui/icons-material';
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

interface CareerIntelligenceProps {
  onBack: () => void;
}

export function CareerIntelligence({ onBack }: CareerIntelligenceProps) {
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [showLearningPath, setShowLearningPath] = useState(false);

  const skillGaps = [
    {
      skill: 'Python Programming',
      importance: 'High',
      demand: 85,
      currentLevel: 0,
      description: 'Essential for data analysis roles in community health',
    },
    {
      skill: 'Data Analysis',
      importance: 'High',
      demand: 78,
      currentLevel: 30,
      description: 'Growing requirement for evidence-based program evaluation',
    },
    {
      skill: 'Project Management',
      importance: 'Medium',
      demand: 65,
      currentLevel: 60,
      description: 'Valuable for senior community support positions',
    },
  ];

  const careerPaths = [
    {
      title: 'Program Manager',
      timeframe: '2-3 years',
      salaryIncrease: '$15,000 - $25,000',
      probability: 78,
      requirements: [
        'Project Management Certification',
        'Leadership Experience',
        'Budget Management',
      ],
    },
    {
      title: 'Mental Health Team Leader',
      timeframe: '1-2 years',
      salaryIncrease: '$8,000 - $15,000',
      probability: 92,
      requirements: [
        'Advanced Mental Health Training',
        'Supervision Skills',
        'Quality Assurance Experience',
      ],
    },
    {
      title: 'Community Services Coordinator',
      timeframe: '6-12 months',
      salaryIncrease: '$5,000 - $12,000',
      probability: 95,
      requirements: ['Stakeholder Engagement', 'Grant Writing', 'Community Networks'],
    },
  ];

  const marketTrends = [
    {
      trend: 'Telehealth Integration',
      growth: '+45%',
      impact: 'High',
      description: 'Growing demand for remote support delivery capabilities',
    },
    {
      trend: 'NDIS Service Expansion',
      growth: '+32%',
      impact: 'High',
      description: 'Increased opportunities in disability support services',
    },
    {
      trend: 'Peer Support Programs',
      growth: '+28%',
      impact: 'Medium',
      description: 'Rising recognition of lived experience value',
    },
  ];

  const handleGenerateLearningPath = async () => {
    setIsGeneratingPath(true);
    setTimeout(() => {
      setIsGeneratingPath(false);
      setShowLearningPath(true);
    }, 2000);
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'High':
        return 'text-red-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getImpactBadgeVariant = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="text" size="small" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Career Hub
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-semibold">Career Intelligence</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Get data-driven insights about your career trajectory and growth opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Skill Gaps */}
          <div className="xl:col-span-2 space-y-6">
            {/* Skill Gap Analysis */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Identified Skill Gaps</h3>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Analysis
                </Badge>
              </div>

              <div className="space-y-4">
                {skillGaps.map((gap, index) => (
                  <div key={index} className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{gap.skill}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outlined" className={getImportanceColor(gap.importance)}>
                          {gap.importance} Priority
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {gap.demand}% market demand
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{gap.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Level</span>
                        <span>{gap.currentLevel}%</span>
                      </div>
                      <Progress value={gap.currentLevel} className="w-full" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={handleGenerateLearningPath}
                  disabled={isGeneratingPath}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isGeneratingPath ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      Generating Learning Path...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Learning Path
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Career Paths */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">Career Path Opportunities</h3>
              </div>

              <div className="space-y-4">
                {careerPaths.map((path, index) => (
                  <div key={index} className="p-4 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-lg">{path.title}</h4>
                      <div className="text-right">
                        <div className="text-sm text-green-500 font-medium">
                          {path.probability}% probability
                        </div>
                        <div className="text-sm text-muted-foreground">{path.timeframe}</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm text-muted-foreground">Salary increase: </span>
                      <span className="text-sm font-medium">{path.salaryIncrease}</span>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Requirements:</p>
                      <div className="flex flex-wrap gap-2">
                        {path.requirements.map((req, reqIndex) => (
                          <Badge key={reqIndex} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Market Trends & Learning Path */}
          <div className="space-y-6">
            {/* Market Trends */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold">Market Trends</h3>
              </div>

              <div className="space-y-4">
                {marketTrends.map((trend, index) => (
                  <div key={index} className="p-3 bg-card border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{trend.trend}</h4>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">{trend.growth}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={getImpactBadgeVariant(trend.impact)} className="text-xs">
                        {trend.impact} Impact
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">{trend.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Learning Path (conditionally shown) */}
            {showLearningPath && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">AI-Generated Learning Path</h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-background border border-border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Phase 1: Foundation (Weeks 1-4)</h4>
                    <p className="text-xs text-muted-foreground">
                      Python basics, data types, control structures
                    </p>
                  </div>

                  <div className="p-3 bg-background border border-border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Phase 2: Application (Weeks 5-8)</h4>
                    <p className="text-xs text-muted-foreground">
                      Pandas for data analysis, basic statistics
                    </p>
                  </div>

                  <div className="p-3 bg-background border border-border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">
                      Phase 3: Specialization (Weeks 9-12)
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Healthcare data analysis, reporting dashboards
                    </p>
                  </div>
                </div>

                <Button className="w-full mt-4" variant="outlined">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Full Learning Plan
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
