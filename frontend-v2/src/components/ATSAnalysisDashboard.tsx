import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Target,
  CheckCircle,
  Warning,
  TrendingUp,
  Description,
  Lightbulb,
} from '@mui/icons-material';

interface ATSScoreCircleProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
}

function ATSScoreCircle({ score, size = 'medium' }: ATSScoreCircleProps) {
  const theme = useTheme();

  const sizeConfig = {
    small: { diameter: 80, strokeWidth: 6 },
    medium: { diameter: 120, strokeWidth: 8 },
    large: { diameter: 192, strokeWidth: 12 }
  };

  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const scoreColor = getScoreColor(score);

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={config.diameter}
        height={config.diameter}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke={theme.palette.divider}
          strokeWidth={config.strokeWidth}
          fill="transparent"
          opacity={0.2}
        />
        <circle
          cx={config.diameter / 2}
          cy={config.diameter / 2}
          r={radius}
          stroke={scoreColor}
          strokeWidth={config.strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'all 1s ease-out',
            filter: `drop-shadow(0 0 8px ${scoreColor}40)`
          }}
        />
      </svg>
      {size === 'large' && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                color: scoreColor,
                fontWeight: 'bold',
                fontSize: '3rem',
                animation: 'pulse 2s infinite'
              }}
            >
              {score}%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              ATS Compatible
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

interface ATSAnalysisDashboardProps {
  onBack?: () => void;
  onNext?: () => void;
}

export function ATSAnalysisDashboard({ onBack, onNext }: ATSAnalysisDashboardProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<number>(0);

  const analysisData = {
    overallScore: 85,
    keywordMatches: 12,
    totalKeywords: 15,
    sections: {
      formatting: 92,
      keywords: 78,
      experience: 88,
      skills: 85
    },
    matchedKeywords: [
      'Community Services', 'Case Management', 'Crisis Intervention',
      'Mental Health Support', 'Program Coordination', 'Client Assessment',
      'Documentation', 'Multidisciplinary Team', 'Advocacy', 'Resource Coordination',
      'Trauma-Informed Care', 'Cultural Competency'
    ],
    missingKeywords: [
      'Data Management', 'Quality Assurance', 'Risk Assessment'
    ],
    insights: [
      {
        type: 'strength' as const,
        title: 'Strong Experience Match',
        description: 'Your community services experience aligns perfectly with job requirements'
      },
      {
        type: 'improvement' as const,
        title: 'Add Technical Skills',
        description: 'Include specific database management and reporting software experience'
      },
      {
        type: 'opportunity' as const,
        title: 'Highlight Leadership',
        description: 'Emphasize your program coordination and team leadership experience'
      }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Button
            variant="text"
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ color: 'text.secondary' }}
          >
            Back to Job Analysis
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={onNext}
          >
            Continue to Templates
          </Button>
        </Stack>

        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            ATS Compatibility Analysis
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Your resume has been analyzed for compatibility with Applicant Tracking Systems.
            Here's how well it matches the job requirements.
          </Typography>
        </Box>

        {/* Main Score Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Overall Score */}
          <Grid item xs={12} lg={4}>
            <Card
              variant="elevation"
              sx={{
                p: 3,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.palette.surface?.container || theme.palette.background.paper} 0%, ${theme.palette.surface?.containerHigh || theme.palette.background.paper} 100%)`,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <CardContent>
                <Stack spacing={3} alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Target color="primary" />
                    <Typography variant="h6" fontWeight="600">
                      Overall ATS Score
                    </Typography>
                  </Stack>

                  <ATSScoreCircle score={analysisData.overallScore} size="large" />

                  <Chip
                    icon={<CheckCircle />}
                    label="Excellent Match"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />

                  <Typography variant="body2" color="text.secondary">
                    Your resume is well-optimized for ATS systems and matches {analysisData.keywordMatches} of {analysisData.totalKeywords} key requirements.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Score Breakdown */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ p: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <TrendingUp color="primary" />
                  <Typography variant="h6" fontWeight="600">
                    Score Breakdown
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  {Object.entries(analysisData.sections).map(([section, score]) => (
                    <Grid item xs={12} sm={6} key={section}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight="500" sx={{ textTransform: 'capitalize' }}>
                            {section.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            sx={{ color: getScoreColor(score) }}
                          >
                            {score}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={score}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: theme.palette.action.hover,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getScoreColor(score),
                              borderRadius: 4,
                              transition: 'transform 1s ease-out'
                            }
                          }}
                        />
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Analysis Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab
              icon={<Description />}
              label="Overview"
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab
              icon={<Target />}
              label="Keywords"
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
            <Tab
              icon={<Lightbulb />}
              label="Insights"
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            />
          </Tabs>

          {/* Tab Panels */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                      <CheckCircle sx={{ color: theme.palette.success.main }} />
                      <Typography variant="h6" fontWeight="600">
                        Strengths
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      {[
                        { title: 'Excellent Formatting', desc: 'Clean structure that ATS can easily parse' },
                        { title: 'Strong Experience Match', desc: 'Your background aligns well with job requirements' },
                        { title: 'Relevant Skills Listed', desc: 'Key competencies are clearly highlighted' }
                      ].map((item, index) => (
                        <Stack direction="row" spacing={2} key={index}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              bgcolor: 'success.main',
                              borderRadius: '50%',
                              mt: 1,
                              flexShrink: 0
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.desc}
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                      <Warning sx={{ color: theme.palette.warning.main }} />
                      <Typography variant="h6" fontWeight="600">
                        Areas for Improvement
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      {[
                        { title: 'Missing Keywords', desc: '3 important terms not found in your resume' },
                        { title: 'Technical Skills Section', desc: 'Could benefit from more specific software mentions' }
                      ].map((item, index) => (
                        <Stack direction="row" spacing={2} key={index}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              bgcolor: 'warning.main',
                              borderRadius: '50%',
                              mt: 1,
                              flexShrink: 0
                            }}
                          />
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600">
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.desc}
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Card sx={{ p: 3 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <Target color="primary" />
                  <Typography variant="h6" fontWeight="600" color="primary">
                    Keyword Analysis
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ color: 'success.main', mb: 2, fontWeight: 600 }}>
                      Matched Keywords ({analysisData.matchedKeywords.length})
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {analysisData.matchedKeywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.success.light + '20',
                            color: 'success.main',
                            border: `1px solid ${theme.palette.success.light}`,
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ color: 'warning.main', mb: 2, fontWeight: 600 }}>
                      Missing Keywords ({analysisData.missingKeywords.length})
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {analysisData.missingKeywords.map((keyword, index) => (
                        <Chip
                          key={index}
                          label={keyword}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.warning.light + '20',
                            color: 'warning.main',
                            border: `1px solid ${theme.palette.warning.light}`,
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {activeTab === 2 && (
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Lightbulb color="secondary" />
                <Typography variant="h6" fontWeight="600" color="secondary">
                  Actionable Insights
                </Typography>
              </Stack>

              {analysisData.insights.map((insight, index) => (
                <Card key={index} sx={{ p: 3 }}>
                  <CardContent>
                    <Stack direction="row" spacing={2}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: insight.type === 'strength' ? 'success.light' + '20' :
                                   insight.type === 'improvement' ? 'warning.light' + '20' :
                                   'info.light' + '20'
                        }}
                      >
                        {insight.type === 'strength' && <CheckCircle sx={{ color: 'success.main' }} />}
                        {insight.type === 'improvement' && <Warning sx={{ color: 'warning.main' }} />}
                        {insight.type === 'opportunity' && <TrendingUp sx={{ color: 'info.main' }} />}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                          {insight.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {insight.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 3,
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBack}
          >
            Back to Job Analysis
          </Button>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Ready to create an optimized resume?
            </Typography>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={onNext}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                fontWeight: 600
              }}
            >
              Choose Template
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}