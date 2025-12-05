import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Container,
  Grid,
  alpha,
  CircularProgress,
} from '@mui/material';
import { ArrowLeft, Sparkles, TrendingUp, TrendingDown, Target, BookOpen, AlertCircle } from 'lucide-react';

export interface CareerIntelligenceProps {
  onBack: () => void;
}

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
    requirements: ['Project Management Certification', 'Leadership Experience', 'Budget Management'],
  },
  {
    title: 'Mental Health Team Leader',
    timeframe: '1-2 years',
    salaryIncrease: '$8,000 - $15,000',
    probability: 92,
    requirements: ['Advanced Mental Health Training', 'Supervision Skills', 'Quality Assurance Experience'],
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

const getImportanceColor = (importance: string) => {
  switch (importance) {
    case 'High':
      return '#FFB4AB';
    case 'Medium':
      return '#FDE047';
    case 'Low':
      return '#86EFAC';
    default:
      return '#94A3B8';
  }
};

export const CareerIntelligence: React.FC<CareerIntelligenceProps> = ({ onBack }) => {
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [showLearningPath, setShowLearningPath] = useState(false);

  const handleGenerateLearningPath = async () => {
    setIsGeneratingPath(true);
    setTimeout(() => {
      setIsGeneratingPath(false);
      setShowLearningPath(true);
    }, 2000);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Button variant="text" startIcon={<ArrowLeft size={16} />} onClick={onBack} sx={{ color: 'text.secondary', mb: 4 }}>
            Back to Career Hub
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Sparkles size={32} color="#A78BFA" />
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", serif',
                  fontWeight: 700,
                }}
              >
                Career Intelligence
              </Typography>
            </Box>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              Get data-driven insights about your career trajectory and growth opportunities.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Skill Gaps & Market Trends */}
          <Grid item xs={12} xl={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Skill Gap Analysis */}
              <Card
                sx={{
                  bgcolor: 'surface.container',
                  border: 1,
                  borderColor: 'outline.variant',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: (theme) => alpha(theme.palette.error.main, 0.12),
                          borderRadius: 2,
                        }}
                      >
                        <AlertCircle size={20} color="#FFB4AB" />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: '"Roboto Flex", "Roboto", serif',
                          fontWeight: 700,
                        }}
                      >
                        Identified Skill Gaps
                      </Typography>
                    </Box>
                    <Chip
                      icon={<Sparkles size={14} />}
                      label="AI Analysis"
                      size="small"
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                        color: 'primary.main',
                        border: 1,
                        borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {skillGaps.map((gap, index) => {
                      const importanceColor = getImportanceColor(gap.importance);
                      return (
                        <Box key={index}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {gap.skill}
                            </Typography>
                            <Chip
                              label={gap.importance}
                              size="small"
                              sx={{
                                bgcolor: (theme) => alpha(importanceColor, 0.12),
                                color: importanceColor,
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            {gap.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                Market Demand: {gap.demand}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={gap.demand}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: (theme) => alpha(importanceColor, 0.2),
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: importanceColor,
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                Your Level: {gap.currentLevel}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={gap.currentLevel}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: 'primary.main',
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={isGeneratingPath ? <CircularProgress size={16} /> : <BookOpen size={16} />}
                    onClick={handleGenerateLearningPath}
                    disabled={isGeneratingPath}
                    sx={{
                      mt: 4,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      py: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    {isGeneratingPath ? 'Generating Path...' : 'Generate Learning Path'}
                  </Button>
                </CardContent>
              </Card>

              {/* Market Trends */}
              <Card
                sx={{
                  bgcolor: 'surface.container',
                  border: 1,
                  borderColor: 'outline.variant',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                        borderRadius: 2,
                      }}
                    >
                      <TrendingUp size={20} color="#86EFAC" />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                      }}
                    >
                      Market Trends
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {marketTrends.map((trend, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {trend.trend}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                              label={trend.growth}
                              size="small"
                              sx={{
                                bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                                color: 'success.main',
                                fontWeight: 600,
                              }}
                            />
                            <Chip
                              label={trend.impact}
                              size="small"
                              variant="outlined"
                              color={trend.impact === 'High' ? 'error' : 'warning'}
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {trend.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Right Column - Career Paths */}
          <Grid item xs={12} xl={4}>
            <Card
              sx={{
                bgcolor: 'surface.container',
                border: 1,
                borderColor: 'outline.variant',
                position: { xl: 'sticky' },
                top: { xl: 24 },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12),
                      borderRadius: 2,
                    }}
                  >
                    <Target size={20} color="#F472B6" />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Roboto Flex", "Roboto", serif',
                      fontWeight: 700,
                    }}
                  >
                    Career Paths
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {careerPaths.map((path, index) => (
                    <Card
                      key={index}
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                        border: 1,
                        borderColor: 'outline.variant',
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                          {path.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip label={path.timeframe} size="small" variant="outlined" />
                          <Chip label={path.salaryIncrease} size="small" color="success" />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Success Probability
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {path.probability}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={path.probability}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: 'primary.main',
                                borderRadius: 3,
                              },
                            }}
                          />
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                          Requirements:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {path.requirements.map((req, reqIndex) => (
                            <Box key={reqIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main',
                                  flexShrink: 0,
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {req}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CareerIntelligence;
