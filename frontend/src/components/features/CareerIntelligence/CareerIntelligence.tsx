import {
  ArrowLeft,
  AutoAwesome as Sparkles,
  TrendingUp,
  GpsFixed as Target,
  MenuBook as BookOpen,
  Error as AlertCircle,
} from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import {
  Button,
  Card,
} from '@mui/material';
import { useState } from 'react';

import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';

interface CareerIntelligenceProps {
  onBack: () => void;
}

export function CareerIntelligence({ onBack }: CareerIntelligenceProps) {
  const theme = useTheme();
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
    <Box sx={{
      minHeight: "100vh",
      p: 4
    }}>
      <Box>
        {/* Header */}
        <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 8
    }}>
          <Button variant="text" size="small" onClick={onBack}>
            <ArrowLeft sx={{
      mr: 2
    }} />
            Back to Career Hub
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
            <Typography variant="h3" sx={{
      fontWeight: 600
    }}>Career Intelligence</Typography>
          </Box>
          <Typography variant="h6">
            Get data-driven insights about your career trajectory and growth opportunities.
          </Typography>
        </Box>

        <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
      gap: 8
    }}>
          {/* Left Column - Skill Gaps */}
          <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,}}>
            {/* Skill Gap Analysis */}
            <Card sx={{
      p: 6
    }}>
              <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 6
    }}>
                <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                  <Box sx={{
      p: 2,
      borderRadius: "var(--sys-shape-radius-md)",
      bgcolor: 'red.50'
    }}>
                    <AlertCircle sx={{
      color: "red.500"
    }} />
                  </Box>
                  <Typography variant="h5" sx={{
      fontWeight: 600
    }}>Identified Skill Gaps</Typography>
                </Box>
                <Badge sx={{ bgcolor: 'purple.100', color: 'purple.800' }}>
                  <Sparkles sx={{
      mr: 1,
      fontSize: '1rem'
    }} />
                  AI Analysis
                </Badge>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {skillGaps.map((gap, index) => (
                  <Box key={index} sx={{
      p: 4,
      border: 1,
      borderColor: 'grey.200',
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 3
    }}>
                      <Typography variant="h6" sx={{
      fontWeight: 500
    }}>{gap.skill}</Typography>
                      <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                        <Badge variant="outline" className={getImportanceColor(gap.importance)}>
                          {gap.importance} Priority
                        </Badge>
                        <Typography sx={{
      typography: "body1",}}>
                          {gap.demand}% market demand
                        </Typography>
                      </Box>
                    </Box>

                    <Typography sx={{
      typography: "body1",
      color: 'text.secondary',
      mb: 3
    }}>{gap.description}</Typography>

                    <Box>
                      <Box sx={{
      display: "flex",
      justifyContent: "space-between",
      typography: "body1",
      mb: 1
    }}>
                        <Typography>Current Level</Typography>
                        <Typography>{gap.currentLevel}%</Typography>
                      </Box>
                      <Progress value={gap.currentLevel} sx={{
      width: "100%"
    }} />
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{
      mt: 6,
      textAlign: "center"
    }}>
                <Button
                  onClick={handleGenerateLearningPath}
                  disabled={isGeneratingPath}
                  sx={{
      bgcolor: 'primary.main',
      color: 'common.white',
      '&:hover': { bgcolor: 'primary.dark' }
    }}
                >
                  {isGeneratingPath ? (
                    <>
                      <Sparkles sx={{
      mr: 2,
      animation: 'spin 1s linear infinite'
    }} />
                      Generating Learning Path...
                    </>
                  ) : (
                    <>
                      <Sparkles sx={{
      mr: 2
    }} />
                      Generate Learning Path
                    </>
                  )}
                </Button>
              </Box>
            </Card>

            {/* Career Paths */}
            <Card sx={{
      p: 6
    }}>
              <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                <Box sx={{
      p: 2,
      borderRadius: "var(--sys-shape-radius-md)",
      bgcolor: 'green.50'
    }}>
                  <Target sx={{
      color: "green.500"
    }} />
                </Box>
                <Typography variant="h5" sx={{
      fontWeight: 600
    }}>Career Path Opportunities</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {careerPaths.map((path, index) => (
                  <Box key={index} sx={{
      p: 4,
      border: 1,
      borderColor: 'grey.200',
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 3
    }}>
                      <Typography variant="h6" sx={{
      fontWeight: 500,
    }}>{path.title}</Typography>
                      <Box sx={{
      textAlign: "right"
    }}>
                        <Typography sx={{
      typography: "body1",
      color: "green.500",
      fontWeight: 500
    }}>
                          {path.probability}% probability
                        </Typography>
                        <Typography sx={{
      typography: "body1",
      color: 'text.secondary'
    }}>{path.timeframe}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{
      mb: 3
    }}>
                      <Typography component="span" sx={{
      typography: "body1",
      color: 'text.secondary'
    }}>Salary increase: </Typography>
                      <Typography component="span" sx={{
      typography: "body1",
      fontWeight: 500
    }}>{path.salaryIncrease}</Typography>
                    </Box>

                    <Box>
                      <Typography sx={{
      typography: "body1",
      color: 'text.secondary',
      mb: 2
    }}>Requirements:</Typography>
                      <Box sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}>
                        {path.requirements.map((req, reqIndex) => (
                          <Badge key={reqIndex} variant="secondary" sx={{
      typography: "body2"
    }}>
                            {req}
                          </Badge>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>

          {/* Right Column - Market Trends & Learning Path */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Market Trends */}
            <Card sx={{
      p: 6
    }}>
              <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                <Box sx={{
      p: 2,
      borderRadius: "var(--sys-shape-radius-md)",
      bgcolor: 'blue.50'
    }}>
                  <TrendingUp sx={{
      color: "blue.500"
    }} />
                </Box>
                <Typography variant="h6" sx={{
      fontWeight: 600
    }}>Market Trends</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {marketTrends.map((trend, index) => (
                  <Box key={index} sx={{
      p: 3,
      border: 1,
      borderColor: 'grey.200',
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 2
    }}>
                      <Typography sx={{
      fontWeight: 500,
      typography: "body1"
    }}>{trend.trend}</Typography>
                      <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                        <TrendingUp sx={{
      color: "green.500"
    }} />
                        <Typography sx={{
      typography: "body1",
      fontWeight: 500,
      color: "green.500"
    }}>{trend.growth}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 2
    }}>
                      <Badge variant={getImpactBadgeVariant(trend.impact)} sx={{
      typography: "body2"
    }}>
                        {trend.impact} Impact
                      </Badge>
                    </Box>

                    <Typography sx={{
      typography: "body2",
      color: 'text.secondary'
    }}>{trend.description}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Learning Path (conditionally shown) */}
            {showLearningPath && (
              <Card sx={{
      p: 6,}}>
                <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 4
    }}>
                  <Box sx={{
      p: 2,
      borderRadius: "var(--sys-shape-radius-md)",
      bgcolor: 'secondary.light'
    }}>
                    <BookOpen />
                  </Box>
                  <Typography variant="h6" sx={{
      fontWeight: 600,}}>AI-Generated Learning Path</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{
      p: 3,
      border: 1,
      borderColor: 'grey.200',
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                    <Typography sx={{
      fontWeight: 500,
      typography: "body1",
      mb: 1
    }}>Phase 1: Foundation (Weeks 1-4)</Typography>
                    <Typography sx={{
      typography: "body2",
      color: 'text.secondary'
    }}>
                      Python basics, data types, control structures
                    </Typography>
                  </Box>

                  <Box sx={{
      p: 3,
      border: 1,
      borderColor: 'grey.200',
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                    <Typography sx={{
      fontWeight: 500,
      typography: "body1",
      mb: 1
    }}>Phase 2: Application (Weeks 5-8)</Typography>
                    <Typography sx={{
      typography: "body2",
      color: 'text.secondary'
    }}>
                      Pandas for data analysis, basic statistics
                    </Typography>
                  </Box>

                  <Box sx={{
      p: 3,
      border: 1,
      borderColor: 'grey.200',
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                    <Typography sx={{
      fontWeight: 500,
      typography: "body1",
      mb: 1
    }}>
                      Phase 3: Specialization (Weeks 9-12)
                    </Typography>
                    <Typography sx={{
      typography: "body2",
      color: 'text.secondary'
    }}>
                      Healthcare data analysis, reporting dashboards
                    </Typography>
                  </Box>
                </Box>

                <Button sx={{
      width: "100%",
      mt: 4
    }} variant="outlined">
                  <BookOpen sx={{
      mr: 2
    }} />
                  View Full Learning Plan
                </Button>
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}