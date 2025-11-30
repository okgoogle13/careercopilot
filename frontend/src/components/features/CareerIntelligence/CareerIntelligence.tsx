import {
  ArrowLeft,
  AutoAwesome as Sparkles,
  TrendingUp,
  GpsFixed as Target,
  MenuBook as BookOpen,
  Error as AlertCircle,
} from '@mui/icons-material';
import { Box, Typography, Button, Card, useTheme } from '@mui/material';
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
        return 'var(--sys-color-error)';
      case 'Medium':
        return 'var(--sys-color-tertiary)';
      case 'Low':
        return 'var(--sys-color-primary)';
      default:
        return 'var(--sys-color-on-surface-variant)';
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
            gap: 'var(--sys-spacing-4)',
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
            Back to Career Hub
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
              Career Intelligence
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              font: 'var(--sys-type-headline-small)',
              color: 'var(--sys-color-on-surface-variant)',
            }}
          >
            Get data-driven insights about your career trajectory and growth
            opportunities.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 'var(--sys-spacing-8)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sys-spacing-8)',
            }}
          >
            <Card
              sx={{
                p: 'var(--sys-spacing-6)',
                borderRadius: 'var(--sys-shape-corner-large)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 'var(--sys-spacing-6)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sys-spacing-3)',
                  }}
                >
                  <Box
                    sx={{
                      p: 'var(--sys-spacing-2)',
                      borderRadius: 'var(--sys-shape-corner-medium)',
                      backgroundColor: 'var(--sys-color-error-container)',
                    }}
                  >
                    <AlertCircle sx={{ color: 'var(--sys-color-error)' }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      font: 'var(--sys-type-headline-small)',
                      fontWeight: 'var(--sys-type-weight-semibold)',
                    }}
                  >
                    Identified Skill Gaps
                  </Typography>
                </Box>
                <Badge
                  sx={{
                    backgroundColor: 'var(--sys-color-tertiary-container)',
                    color: 'var(--sys-color-on-tertiary-container)',
                  }}
                >
                  <Sparkles sx={{ mr: 1, fontSize: '1rem' }} />
                  AI Analysis
                </Badge>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sys-spacing-4)',
                }}
              >
                {skillGaps.map((gap, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 'var(--sys-spacing-4)',
                      border: '1px solid var(--sys-color-outline-variant)',
                      borderRadius: 'var(--sys-shape-corner-medium)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 'var(--sys-spacing-3)',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          font: 'var(--sys-type-title-large)',
                          fontWeight: 'var(--sys-type-weight-medium)',
                        }}
                      >
                        {gap.skill}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--sys-spacing-2)',
                        }}
                      >
                        <Badge
                          variant="outline"
                          sx={{ color: getImportanceColor(gap.importance) }}
                        >
                          {gap.importance} Priority
                        </Badge>
                        <Typography sx={{ font: 'var(--sys-type-body-medium)' }}>
                          {gap.demand}% market demand
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        font: 'var(--sys-type-body-large)',
                        color: 'var(--sys-color-on-surface-variant)',
                        mb: 'var(--sys-spacing-3)',
                      }}
                    >
                      {gap.description}
                    </Typography>

                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          font: 'var(--sys-type-body-medium)',
                          mb: 1,
                        }}
                      >
                        <Typography>Current Level</Typography>
                        <Typography>{gap.currentLevel}%</Typography>
                      </Box>
                      <Progress
                        value={gap.currentLevel}
                        sx={{ width: '100%' }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 'var(--sys-spacing-6)', textAlign: 'center' }}>
                <Button
                  onClick={handleGenerateLearningPath}
                  disabled={isGeneratingPath}
                  sx={{
                    backgroundColor: 'var(--sys-color-primary)',
                    color: 'var(--sys-color-on-primary)',
                    '&:hover': {
                      backgroundColor: 'var(--sys-color-primary-dark)',
                    },
                  }}
                >
                  {isGeneratingPath ? (
                    <>
                      <Sparkles
                        sx={{
                          mr: 'var(--sys-spacing-2)',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      Generating Learning Path...
                    </>
                  ) : (
                    <>
                      <Sparkles sx={{ mr: 'var(--sys-spacing-2)' }} />
                      Generate Learning Path
                    </>
                  )}
                </Button>
              </Box>
            </Card>
            <Card
              sx={{
                p: 'var(--sys-spacing-6)',
                borderRadius: 'var(--sys-shape-corner-large)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sys-spacing-3)',
                  mb: 'var(--sys-spacing-6)',
                }}
              >
                <Box
                  sx={{
                    p: 'var(--sys-spacing-2)',
                    borderRadius: 'var(--sys-shape-corner-medium)',
                    backgroundColor: 'var(--sys-color-primary-container)',
                  }}
                >
                  <Target sx={{ color: 'var(--sys-color-primary)' }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    font: 'var(--sys-type-headline-small)',
                    fontWeight: 'var(--sys-type-weight-semibold)',
                  }}
                >
                  Career Path Opportunities
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sys-spacing-4)',
                }}
              >
                {careerPaths.map((path, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 'var(--sys-spacing-4)',
                      border: '1px solid var(--sys-color-outline-variant)',
                      borderRadius: 'var(--sys-shape-corner-medium)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 'var(--sys-spacing-3)',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          font: 'var(--sys-type-title-large)',
                          fontWeight: 'var(--sys-type-weight-medium)',
                        }}
                      >
                        {path.title}
                      </Typography>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          sx={{
                            font: 'var(--sys-type-body-large)',
                            color: 'var(--sys-color-primary)',
                            fontWeight: 'var(--sys-type-weight-medium)',
                          }}
                        >
                          {path.probability}% probability
                        </Typography>
                        <Typography
                          sx={{
                            font: 'var(--sys-type-body-medium)',
                            color: 'var(--sys-color-on-surface-variant)',
                          }}
                        >
                          {path.timeframe}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 'var(--sys-spacing-3)' }}>
                      <Typography
                        component="span"
                        sx={{
                          font: 'var(--sys-type-body-large)',
                          color: 'var(--sys-color-on-surface-variant)',
                        }}
                      >
                        Salary increase:{' '}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          font: 'var(--sys-type-body-large)',
                          fontWeight: 'var(--sys-type-weight-medium)',
                        }}
                      >
                        {path.salaryIncrease}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          font: 'var(--sys-type-body-medium)',
                          color: 'var(--sys-color-on-surface-variant)',
                          mb: 'var(--sys-spacing-2)',
                        }}
                      >
                        Requirements:
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 'var(--sys-spacing-2)',
                        }}
                      >
                        {path.requirements.map((req, reqIndex) => (
                          <Badge
                            key={reqIndex}
                            variant="secondary"
                            sx={{ font: 'var(--sys-type-label-large)' }}
                          >
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sys-spacing-8)',
            }}
          >
            <Card
              sx={{
                p: 'var(--sys-spacing-6)',
                borderRadius: 'var(--sys-shape-corner-large)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sys-spacing-3)',
                  mb: 'var(--sys-spacing-6)',
                }}
              >
                <Box
                  sx={{
                    p: 'var(--sys-spacing-2)',
                    borderRadius: 'var(--sys-shape-corner-medium)',
                    backgroundColor: 'var(--sys-color-secondary-container)',
                  }}
                >
                  <TrendingUp sx={{ color: 'var(--sys-color-secondary)' }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    font: 'var(--sys-type-headline-small)',
                    fontWeight: 'var(--sys-type-weight-semibold)',
                  }}
                >
                  Market Trends
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sys-spacing-3)',
                }}
              >
                {marketTrends.map((trend, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 'var(--sys-spacing-3)',
                      border: '1px solid var(--sys-color-outline-variant)',
                      borderRadius: 'var(--sys-shape-corner-medium)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 'var(--sys-spacing-2)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 'var(--sys-type-weight-medium)',
                          font: 'var(--sys-type-title-medium)',
                        }}
                      >
                        {trend.trend}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--sys-spacing-2)',
                        }}
                      >
                        <TrendingUp sx={{ color: 'var(--sys-color-primary)' }} />
                        <Typography
                          sx={{
                            font: 'var(--sys-type-body-large)',
                            fontWeight: 'var(--sys-type-weight-medium)',
                            color: 'var(--sys-color-primary)',
                          }}
                        >
                          {trend.growth}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 'var(--sys-spacing-2)' }}>
                      <Badge
                        variant={getImpactBadgeVariant(trend.impact)}
                        sx={{ font: 'var(--sys-type-label-large)' }}
                      >
                        {trend.impact} Impact
                      </Badge>
                    </Box>
                    <Typography
                      sx={{
                        font: 'var(--sys-type-body-medium)',
                        color: 'var(--sys-color-on-surface-variant)',
                      }}
                    >
                      {trend.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
            {showLearningPath && (
              <Card
                sx={{
                  p: 'var(--sys-spacing-6)',
                  borderRadius: 'var(--sys-shape-corner-large)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sys-spacing-3)',
                    mb: 'var(--sys-spacing-4)',
                  }}
                >
                  <Box
                    sx={{
                      p: 'var(--sys-spacing-2)',
                      borderRadius: 'var(--sys-shape-corner-medium)',
                      backgroundColor: 'var(--sys-color-tertiary-container)',
                    }}
                  >
                    <BookOpen sx={{ color: 'var(--sys-color-tertiary)' }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      font: 'var(--sys-type-headline-small)',
                      fontWeight: 'var(--sys-type-weight-semibold)',
                    }}
                  >
                    AI-Generated Learning Path
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--sys-spacing-3)',
                  }}
                >
                  {[
                    {
                      title: 'Phase 1: Foundation (Weeks 1-4)',
                      description: 'Python basics, data types, control structures',
                    },
                    {
                      title: 'Phase 2: Application (Weeks 5-8)',
                      description: 'Pandas for data analysis, basic statistics',
                    },
                    {
                      title: 'Phase 3: Specialization (Weeks 9-12)',
                      description: 'Healthcare data analysis, reporting dashboards',
                    },
                  ].map((phase, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 'var(--sys-spacing-3)',
                        border: '1px solid var(--sys-color-outline-variant)',
                        borderRadius: 'var(--sys-shape-corner-medium)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 'var(--sys-type-weight-medium)',
                          font: 'var(--sys-type-title-medium)',
                          mb: 1,
                        }}
                      >
                        {phase.title}
                      </Typography>
                      <Typography
                        sx={{
                          font: 'var(--sys-type-body-medium)',
                          color: 'var(--sys-color-on-surface-variant)',
                        }}
                      >
                        {phase.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  sx={{ width: '100%', mt: 'var(--sys-spacing-4)' }}
                  variant="outlined"
                >
                  <BookOpen sx={{ mr: 'var(--sys-spacing-2)' }} />
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