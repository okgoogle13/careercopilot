import {
  ArrowLeft,
  AutoAwesome as Sparkles,
  TrendingUp,
  GpsFixed as Target,
  MenuBook as BookOpen,
  Error as AlertCircle,
} from '@mui/icons-material';
import { Box } from '@mui/material';
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
import { useState } from 'react';

import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';

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
    <div sx={{
      minHeight: "100vh",
      p: 4
    }}>
      <div sx={{}}>
        {/* Header */}
        <div sx={{
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
            <Sparkles sx={{}} />
            <h1 sx={{
      typography: "h3",
      fontWeight: 600
    }}>Career Intelligence</h1>
          </div>
          <p sx={{
      typography: "h6"
    }}>
            Get data-driven insights about your career trajectory and growth opportunities.
          </p>
        </div>

        <div sx={{
      [theme.breakpoints.up('lg')]: {},
      gap: 8
    }}>
          {/* Left Column - Skill Gaps */}
          <div sx={{
      [theme.breakpoints.up('lg')]: {},}}>
            {/* Skill Gap Analysis */}
            <Card sx={{
      p: 6
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 6
    }}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                  <div sx={{
      p: 2,
      borderRadius: "0.5rem"
    }}>
                    <AlertCircle sx={{
      color: "red.500"
    }} />
                  </div>
                  <h3 sx={{
      typography: "h5",
      fontWeight: 600
    }}>Identified Skill Gaps</h3>
                </div>
                <Badge sx={{}}>
                  <Sparkles sx={{
      mr: 1
    }} />
                  AI Analysis
                </Badge>
              </div>

              <div sx={{}}>
                {skillGaps.map((gap, index) => (
                  <div key={index} sx={{
      p: 4,
      border: 1,
      borderRadius: "0.5rem"
    }}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 3
    }}>
                      <h4 sx={{
      fontWeight: 500
    }}>{gap.skill}</h4>
                      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                        <Badge variant="outline" className={getImportanceColor(gap.importance)}>
                          {gap.importance} Priority
                        </Badge>
                        <span sx={{
      typography: "body1",}}>
                          {gap.demand}% market demand
                        </span>
                      </div>
                    </div>

                    <p sx={{
      typography: "body1",
      mb: 3
    }}>{gap.description}</p>

                    <div sx={{}}>
                      <div sx={{
      display: "flex",
      justifyContent: "space-between",
      typography: "body1"
    }}>
                        <span>Current Level</span>
                        <span>{gap.currentLevel}%</span>
                      </div>
                      <Progress value={gap.currentLevel} sx={{
      width: "100%"
    }} />
                    </div>
                  </div>
                ))}
              </div>

              <div sx={{
      mt: 6,
      textAlign: "center"
    }}>
                <Button
                  onClick={handleGenerateLearningPath}
                  disabled={isGeneratingPath}
                  sx={{
      '&:hover': {}
    }}
                >
                  {isGeneratingPath ? (
                    <>
                      <Sparkles sx={{
      mr: 2,}} />
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
              </div>
            </Card>

            {/* Career Paths */}
            <Card sx={{
      p: 6
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                <div sx={{
      p: 2,
      borderRadius: "0.5rem"
    }}>
                  <Target sx={{
      color: "green.500"
    }} />
                </div>
                <h3 sx={{
      typography: "h5",
      fontWeight: 600
    }}>Career Path Opportunities</h3>
              </div>

              <div sx={{}}>
                {careerPaths.map((path, index) => (
                  <div key={index} sx={{
      p: 4,
      border: 1,
      borderRadius: "0.5rem"
    }}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 3
    }}>
                      <h4 sx={{
      fontWeight: 500,
      typography: "h6"
    }}>{path.title}</h4>
                      <div sx={{
      textAlign: "right"
    }}>
                        <div sx={{
      typography: "body1",
      color: "green.500",
      fontWeight: 500
    }}>
                          {path.probability}% probability
                        </div>
                        <div sx={{
      typography: "body1",}}>{path.timeframe}</div>
                      </div>
                    </div>

                    <div sx={{
      mb: 3
    }}>
                      <span sx={{
      typography: "body1",}}>Salary increase: </span>
                      <span sx={{
      typography: "body1",
      fontWeight: 500
    }}>{path.salaryIncrease}</span>
                    </div>

                    <div>
                      <p sx={{
      typography: "body1",
      mb: 2
    }}>Requirements:</p>
                      <div sx={{
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Market Trends & Learning Path */}
          <div sx={{}}>
            {/* Market Trends */}
            <Card sx={{
      p: 6
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                <div sx={{
      p: 2,
      borderRadius: "0.5rem"
    }}>
                  <TrendingUp sx={{
      color: "blue.500"
    }} />
                </div>
                <h3 sx={{
      typography: "h6",
      fontWeight: 600
    }}>Market Trends</h3>
              </div>

              <div sx={{}}>
                {marketTrends.map((trend, index) => (
                  <div key={index} sx={{
      p: 3,
      border: 1,
      borderRadius: "0.5rem"
    }}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 2
    }}>
                      <h4 sx={{
      fontWeight: 500,
      typography: "body1"
    }}>{trend.trend}</h4>
                      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                        <TrendingUp sx={{
      color: "green.500"
    }} />
                        <span sx={{
      typography: "body1",
      fontWeight: 500,
      color: "green.500"
    }}>{trend.growth}</span>
                      </div>
                    </div>

                    <div sx={{
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
                    </div>

                    <p sx={{
      typography: "body2",}}>{trend.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Learning Path (conditionally shown) */}
            {showLearningPath && (
              <Card sx={{
      p: 6,}}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 4
    }}>
                  <div sx={{
      p: 2,
      borderRadius: "0.5rem"
    }}>
                    <BookOpen sx={{}} />
                  </div>
                  <h3 sx={{
      typography: "h6",
      fontWeight: 600,}}>AI-Generated Learning Path</h3>
                </div>

                <div sx={{}}>
                  <div sx={{
      p: 3,
      border: 1,
      borderRadius: "0.5rem"
    }}>
                    <h4 sx={{
      fontWeight: 500,
      typography: "body1",
      mb: 1
    }}>Phase 1: Foundation (Weeks 1-4)</h4>
                    <p sx={{
      typography: "body2",}}>
                      Python basics, data types, control structures
                    </p>
                  </div>

                  <div sx={{
      p: 3,
      border: 1,
      borderRadius: "0.5rem"
    }}>
                    <h4 sx={{
      fontWeight: 500,
      typography: "body1",
      mb: 1
    }}>Phase 2: Application (Weeks 5-8)</h4>
                    <p sx={{
      typography: "body2",}}>
                      Pandas for data analysis, basic statistics
                    </p>
                  </div>

                  <div sx={{
      p: 3,
      border: 1,
      borderRadius: "0.5rem"
    }}>
                    <h4 sx={{
      fontWeight: 500,
      typography: "body1",
      mb: 1
    }}>
                      Phase 3: Specialization (Weeks 9-12)
                    </h4>
                    <p sx={{
      typography: "body2",}}>
                      Healthcare data analysis, reporting dashboards
                    </p>
                  </div>
                </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}
