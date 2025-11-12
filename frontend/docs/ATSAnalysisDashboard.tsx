import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Grid,
  alpha,
} from '@mui/material';
import {
  ArrowLeft,
  Upload,
  CheckCircle as CheckCircleIcon,
  WarningAmber as AlertTriangle,
  Cancel as XCircle,
  Visibility as Eye,
  Download as DownloadIcon,
  Check as CheckIcon,
  Close as XIcon,
  Psychology as Brain,
  BarChart as BarChart3,
  TrackChanges as Target,
  AutoFixHigh as Sparkles,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

interface ATSAnalysisDashboardProps {
  onBack: () => void;
  onNext?: () => void;
}

interface AnalysisResult {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    status: 'good' | 'warning' | 'poor';
    suggestions: string[];
  }[];
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
  formatIssues: string[];
}

const mockAnalysisResult: AnalysisResult = {
  overallScore: 87,
  categories: [
    {
      name: 'Keyword Optimization',
      score: 89,
      status: 'good',
      suggestions: ['Add more social services terminology', 'Include community outreach keywords'],
    },
    {
      name: 'Format & Structure',
      score: 95,
      status: 'good',
      suggestions: ['Excellent formatting consistency'],
    },
    {
      name: 'Content Quality',
      score: 82,
      status: 'good',
      suggestions: ['Quantify client impact with numbers', 'Add more action verbs', 'Include recent volunteer work'],
    },
    {
      name: 'ATS Compatibility',
      score: 83,
      status: 'good',
      suggestions: ['Use standard section headers', 'Reduce special characters', 'Add more relevant certifications'],
    },
  ],
  keywordMatches: {
    matched: [
      'Community Support',
      'Case Management',
      'Crisis Intervention',
      'Mental Health',
      'Client Advocacy',
      'Team Collaboration',
    ],
    missing: [
      'Peer Support',
      'Recovery Programs',
      'Group Facilitation',
      'Documentation',
      'Risk Assessment',
      'Cultural Competency',
    ],
  },
  formatIssues: [
    'Consider adding volunteer experience section',
    'Include relevant certifications prominently',
    'Ensure consistent date formatting',
  ],
};

export const ATSAnalysisDashboard: React.FC<ATSAnalysisDashboardProps> = ({ onBack, onNext }) => {
  const [analysisResult] = useState<AnalysisResult>(mockAnalysisResult);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'primary.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  const getScoreBg = (score: number) => (theme: any) => {
    if (score >= 80) return alpha(theme.palette.primary.main, 0.1);
    if (score >= 60) return alpha(theme.palette.warning.main, 0.1);
    return alpha(theme.palette.error.main, 0.1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle size={16} color="#A78BFA" />;
      case 'warning':
        return <AlertTriangle size={16} color="#FDE047" />;
      case 'poor':
        return <XCircle size={16} color="#FFB4AB" />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 3, md: 6 },
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button
              variant="text"
              startIcon={<ArrowLeft size={16} />}
              onClick={onBack}
              sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
            >
              Back
            </Button>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                ATS Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered resume optimization insights
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<Upload size={16} />}>
              Upload Resume
            </Button>
            <Button variant="outlined" startIcon={<Eye size={16} />}>
              View Original
            </Button>
            <Button variant="outlined" startIcon={<Download size={16} />}>
              Download Report
            </Button>
            {onNext && (
              <Button variant="aurora" onClick={onNext}>
                Choose Template
              </Button>
            )}
          </Box>
        </Box>

        {/* Overall Score Hero Section */}
        <Card
          variant="glass"
          sx={{
            p: 6,
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(
                theme.palette.tertiary.main,
                0.05
              )})`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    borderRadius: 3,
                    boxShadow: (theme) => theme.customShadows.glowPrimary,
                  }}
                >
                  <Brain size={24} color="#A78BFA" />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      background: (theme) =>
                        `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    AI Analysis Complete
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your resume has been optimized for ATS systems
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 3 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '4rem', md: '8rem' },
                    fontWeight: 700,
                    lineHeight: 0.9,
                    color: 'primary.main',
                    animation: 'glow-pulse 2s ease-in-out infinite',
                  }}
                >
                  {analysisResult.overallScore}%
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  ATS Score
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={analysisResult.overallScore}
                sx={{
                  height: 24,
                  borderRadius: 3,
                  mb: 2,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              />
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                {analysisResult.overallScore >= 80
                  ? 'Excellent! Your resume is highly optimized for ATS systems.'
                  : analysisResult.overallScore >= 60
                  ? 'Good foundation with room for strategic improvements.'
                  : 'Needs optimization to pass ATS filtering effectively.'}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: 192,
                  height: 192,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 4,
                  borderColor: (theme) =>
                    analysisResult.overallScore >= 80
                      ? alpha(theme.palette.primary.main, 0.3)
                      : analysisResult.overallScore >= 60
                      ? alpha(theme.palette.warning.main, 0.3)
                      : alpha(theme.palette.error.main, 0.3),
                  bgcolor: getScoreBg(analysisResult.overallScore),
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <BarChart3 size={64} color="#A78BFA" style={{ marginBottom: 8 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Optimization
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: (theme) =>
                      `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'glow-pulse 2s ease-in-out infinite',
                  }}
                >
                  <Sparkles size={20} color="white" />
                </Box>
              </Box>
              <Chip
                label="AI Analyzed"
                sx={{
                  mt: 2,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  border: 1,
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                }}
              />
            </Box>
          </Box>
        </Card>

        <Grid container spacing={3}>
          {/* Stats Overview */}
          <Grid item xs={12} lg={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card variant="glass" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Target size={16} color="#A78BFA" />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      background: (theme) =>
                        `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Keywords
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                    border: 1,
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Community Support Worker
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last analyzed: 2 hours ago
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 2,
                        border: 1,
                        borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {analysisResult.keywordMatches.matched.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Matched
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        textAlign: 'center',
                        p: 2,
                        bgcolor: (theme) => alpha(theme.palette.error.main, 0.05),
                        borderRadius: 2,
                        border: 1,
                        borderColor: (theme) => alpha(theme.palette.error.main, 0.1),
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
                        {analysisResult.keywordMatches.missing.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Missing
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              <Card variant="glass" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <TrendingUp size={16} color="#F472B6" />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: 'tertiary.main',
                    }}
                  >
                    Actions
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Brain size={16} />}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    }}
                  >
                    Optimize for Job
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Eye size={16} />}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      borderColor: (theme) => alpha(theme.palette.secondary.main, 0.2),
                    }}
                  >
                    Generate Cover Letter
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Download size={16} />}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      borderColor: (theme) => alpha(theme.palette.tertiary.main, 0.2),
                    }}
                  >
                    Export Optimized
                  </Button>
                </Box>
              </Card>
            </Box>
          </Grid>

          {/* Detailed Analysis */}
          <Grid item xs={12} lg={9}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card variant="glass" sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                  <BarChart3 size={20} color="#A78BFA" />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      background: (theme) =>
                        `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Category Breakdown
                  </Typography>
                </Box>
                <Grid container spacing={4}>
                  {analysisResult.categories.map((category, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {getStatusIcon(category.status)}
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {category.name}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${category.score}%`}
                            sx={{
                              bgcolor: getScoreBg(category.score),
                              color: getScoreColor(category.score),
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={category.score}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            mb: 2,
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {category.suggestions.map((suggestion, suggestionIndex) => (
                            <Box key={suggestionIndex} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  bgcolor: 'primary.main',
                                  borderRadius: '50%',
                                  mt: 1,
                                  flexShrink: 0,
                                }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {suggestion}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>

              <Card variant="glass" sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                  <Target size={20} color="#A78BFA" />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      background: (theme) =>
                        `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.tertiary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Keyword Analysis
                  </Typography>
                </Box>
                <Grid container spacing={4}>
                  {/* Matched Keywords */}
                  <Grid item xs={12} lg={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, pb: 2, borderBottom: 1, borderColor: (theme) => alpha(theme.palette.primary.main, 0.2) }}>
                      <CheckCircle size={20} color="#A78BFA" />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        Matched ({analysisResult.keywordMatches.matched.length})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 320, overflowY: 'auto' }}>
                      {analysisResult.keywordMatches.matched.map((keyword, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                            border: 1,
                            borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                            transition: 'all 0.3s',
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <Check size={16} color="#A78BFA" style={{ flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {keyword}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>

                  {/* Missing Keywords */}
                  <Grid item xs={12} lg={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, pb: 2, borderBottom: 1, borderColor: (theme) => alpha(theme.palette.error.main, 0.2) }}>
                      <XCircle size={20} color="#FFB4AB" />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                        Missing ({analysisResult.keywordMatches.missing.length})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 320, overflowY: 'auto' }}>
                      {analysisResult.keywordMatches.missing.map((keyword, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: (theme) => alpha(theme.palette.error.main, 0.05),
                            border: 1,
                            borderColor: (theme) => alpha(theme.palette.error.main, 0.1),
                            transition: 'all 0.3s',
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                            },
                          }}
                        >
                          <X size={16} color="#FFB4AB" style={{ flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                            {keyword}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ATSAnalysisDashboard;
