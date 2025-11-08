import {
  ArrowLeft,
  ArrowRight,
  GpsFixed,
  CheckCircle,
  Error,
  TrendingUp,
  Description,
  People,
  Lightbulb,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import React, { useState } from 'react';

import { ATSScoreCircle } from '../../library/ATSScoreCircle';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';

interface ATSAnalysisDashboardProps {
  onBack?: () => void;
  onNext?: () => void;
}

export function ATSAnalysisDashboard({ onBack, onNext }: ATSAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'insights'>('overview');

  // Mock data - in real app this would come from props or API
  const analysisData = {
    overallScore: 85,
    keywordMatches: 12,
    totalKeywords: 15,
    sections: {
      formatting: 92,
      keywords: 78,
      experience: 88,
      skills: 85,
    },
    matchedKeywords: [
      'Community Services',
      'Case Management',
      'Crisis Intervention',
      'Mental Health Support',
      'Program Coordination',
      'Client Assessment',
      'Documentation',
      'Multidisciplinary Team',
      'Advocacy',
      'Resource Coordination',
      'Trauma-Informed Care',
      'Cultural Competency',
    ],
    missingKeywords: ['Data Management', 'Quality Assurance', 'Risk Assessment'],
    insights: [
      {
        type: 'strength' as const,
        title: 'Strong Experience Match',
        description: 'Your community services experience aligns perfectly with job requirements',
      },
      {
        type: 'improvement' as const,
        title: 'Add Technical Skills',
        description: 'Include specific database management and reporting software experience',
      },
      {
        type: 'opportunity' as const,
        title: 'Highlight Leadership',
        description: 'Emphasize your program coordination and team leadership experience',
      },
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10';
    if (score >= 60) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <div sx={{
      minHeight: "100vh",
      p: 6
    }}>
      <div sx={{}}>
        {/* Header */}
        <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
            <Button
              variant="link"
              onClick={onBack}
              sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      '&:hover': {}
    }}
            >
              <ArrowLeft sx={{}} />
              Back to Job Analysis
            </Button>
          </div>
          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
            <Button variant="default" onClick={onNext} sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
              Continue to Templates
              <ArrowRight sx={{}} />
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div sx={{
      textAlign: "center",}}>
          <h1 sx={{
      typography: "h2",
      fontWeight: 700,}}>ATS Compatibility Analysis</h1>
          <p sx={{
      typography: "h6",}}>
            Your resume has been analyzed for compatibility with Applicant Tracking Systems. Here's
            how well it matches the job requirements.
          </p>
        </div>

        {/* Main Score Section - Enhanced Size */}
        <div sx={{
      [theme.breakpoints.up('md')]: {},
      gap: 8
    }}>
          {/* Overall Score - Made Larger and More Prominent */}
          <div sx={{
      [theme.breakpoints.up('md')]: {}
    }}>
            <Card sx={{
      p: 8,
      textAlign: "center"
    }}>
              <div sx={{}}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      mb: 4
    }}>
                  <GpsFixed sx={{}} />
                  <h2 sx={{
      typography: "h5",
      fontWeight: 600
    }}>Overall ATS Score</h2>
                </div>

                {/* Enlarged Score Circle */}
                <div sx={{
      display: "flex",
      justifyContent: "center"
    }}>
                  <div sx={{}}>
                    <ATSScoreCircle
                      score={analysisData.overallScore}
                      size="large"
                      sx={{}} // Increased from default size
                    />
                    {/* Enhanced pulsing score text overlay */}
                    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                      <div sx={{
      textAlign: "center"
    }}>
                        <div
                          sx={{
      typography: "h1",
      fontWeight: 700,}}
                        >
                          {analysisData.overallScore}%
                        </div>
                        <div sx={{
      typography: "body1",
      mt: 1
    }}>ATS Compatible</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 2,
      px: 4,
      py: 2,
      borderRadius: "9999px",}}
                >
                  <CheckCircle sx={{}} />
                  <span sx={{
      fontWeight: 500,}}>
                    Excellent Match
                  </span>
                </div>

                <p sx={{
      typography: "body1",}}>
                  Your resume is well-optimized for ATS systems and matches{' '}
                  {analysisData.keywordMatches} of {analysisData.totalKeywords} key requirements.
                </p>
              </div>
            </Card>
          </div>

          {/* Score Breakdown */}
          <div sx={{
      [theme.breakpoints.up('md')]: {}
    }}>
            <Card sx={{
      p: 6
    }}>
              <h3 sx={{
      typography: "h5",
      fontWeight: 600,
      mb: 6,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <TrendingUp sx={{}} />
                Score Breakdown
              </h3>

              <div sx={{
      gap: 6
    }}>
                {Object.entries(analysisData.sections).map(([section, score]) => (
                  <div key={section} sx={{}}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                      <span sx={{
      typography: "body1",
      fontWeight: 500,
      textTransform: "capitalize"
    }}>
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span sx={{
      typography: "body1",
      fontWeight: 700,}}>{score}%</span>
                    </div>
                    <div sx={{
      width: "100%",
      borderRadius: "9999px",}}>
                      <div
                        sx={{
      borderRadius: "9999px",}}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Detailed Analysis Tabs */}
        <div sx={{}}>
          {/* Tab Navigation */}
          <div sx={{
      display: "flex",
      p: 1,
      borderRadius: "0.5rem",}}>
            {[
              { id: 'overview', label: 'Overview', icon: Description },
              { id: 'keywords', label: 'Keywords', icon: GpsFixed },
              { id: 'insights', label: 'Insights', icon: Lightbulb },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      px: 4,
      py: 2,
      borderRadius: "0.375rem",
      typography: "body1",
      fontWeight: 500,
      '&:hover': {},}}
                >
                  <Icon sx={{}} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 6
    }}>
              <Card sx={{
      p: 6
    }}>
                <h3 sx={{
      typography: "h6",
      fontWeight: 600,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <CheckCircle sx={{
      color: "green.500"
    }} />
                  Strengths
                </h3>
                <ul sx={{}}>
                  <li sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <div sx={{
      bgcolor: "green.500",
      borderRadius: "9999px",
      mt: 2,
      flexShrink: 0
    }} />
                    <div>
                      <p sx={{
      fontWeight: 500
    }}>Excellent Formatting</p>
                      <p sx={{
      typography: "body1",}}>
                        Clean structure that ATS can easily parse
                      </p>
                    </div>
                  </li>
                  <li sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <div sx={{
      bgcolor: "green.500",
      borderRadius: "9999px",
      mt: 2,
      flexShrink: 0
    }} />
                    <div>
                      <p sx={{
      fontWeight: 500
    }}>Strong Experience Match</p>
                      <p sx={{
      typography: "body1",}}>
                        Your background aligns well with job requirements
                      </p>
                    </div>
                  </li>
                  <li sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <div sx={{
      bgcolor: "green.500",
      borderRadius: "9999px",
      mt: 2,
      flexShrink: 0
    }} />
                    <div>
                      <p sx={{
      fontWeight: 500
    }}>Relevant Skills Listed</p>
                      <p sx={{
      typography: "body1",}}>
                        Key competencies are clearly highlighted
                      </p>
                    </div>
                  </li>
                </ul>
              </Card>

              <Card sx={{
      p: 6
    }}>
                <h3 sx={{
      typography: "h6",
      fontWeight: 600,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                  <Error sx={{
      color: "yellow.500"
    }} />
                  Areas for Improvement
                </h3>
                <ul sx={{}}>
                  <li sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <div sx={{
      bgcolor: "yellow.500",
      borderRadius: "9999px",
      mt: 2,
      flexShrink: 0
    }} />
                    <div>
                      <p sx={{
      fontWeight: 500
    }}>Missing Keywords</p>
                      <p sx={{
      typography: "body1",}}>
                        3 important terms not found in your resume
                      </p>
                    </div>
                  </li>
                  <li sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <div sx={{
      bgcolor: "yellow.500",
      borderRadius: "9999px",
      mt: 2,
      flexShrink: 0
    }} />
                    <div>
                      <p sx={{
      fontWeight: 500
    }}>Technical Skills Section</p>
                      <p sx={{
      typography: "body1",}}>
                        Could benefit from more specific software mentions
                      </p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          )}

          {activeTab === 'keywords' && (
            <div sx={{}}>
              {/* Keywords Section with Primary Color */}
              <Card sx={{
      p: 6
    }}>
                <h3
                  sx={{
      typography: "h6",
      fontWeight: 600,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}
                  style={{ color: 'var(--color-primary)' }}
                >
                  <GpsFixed sx={{}} style={{ color: 'var(--color-primary)' }} />
                  Keyword Analysis
                </h3>

                <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 6
    }}>
                  <div>
                    <h4 sx={{
      fontWeight: 500,
      color: "green.600",
      mb: 3
    }}>
                      Matched Keywords ({analysisData.matchedKeywords.length})
                    </h4>
                    <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}>
                      {analysisData.matchedKeywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          sx={{
      color: "green.600",}}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 sx={{
      fontWeight: 500,
      color: "yellow.600",
      mb: 3
    }}>
                      Missing Keywords ({analysisData.missingKeywords.length})
                    </h4>
                    <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}>
                      {analysisData.missingKeywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          sx={{
      color: "yellow.600",}}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'insights' && (
            <div sx={{}}>
              {/* Insights Section with Secondary Color */}
              <h3
                sx={{
      typography: "h6",
      fontWeight: 600,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}
                style={{ color: 'var(--color-secondary)' }}
              >
                <Lightbulb sx={{}} style={{ color: 'var(--color-secondary)' }} />
                Actionable Insights
              </h3>

              {analysisData.insights.map((insight, index) => (
                <Card key={index} sx={{
      p: 6
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 4
    }}>
                    <div
                      sx={{
      p: 2,
      borderRadius: "0.5rem",}}
                    >
                      {insight.type === 'strength' && (
                        <CheckCircle sx={{
      color: "green.500"
    }} />
                      )}
                      {insight.type === 'improvement' && (
                        <Error sx={{
      color: "yellow.500"
    }} />
                      )}
                      {insight.type === 'opportunity' && (
                        <TrendingUp sx={{
      color: "blue.500"
    }} />
                      )}
                    </div>
                    <div>
                      <h4 sx={{
      fontWeight: 600,
      mb: 2
    }}>{insight.title}</h4>
                      <p sx={{}}>{insight.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pt: 8,
      borderTop: 1,}}>
          <Button variant="outline" onClick={onBack} sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
            <ArrowLeft sx={{}} />
            Back to Job Analysis
          </Button>

          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
            <div sx={{
      typography: "body1",}}>
              Ready to create an optimized resume?
            </div>
            <Button onClick={onNext} sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,}}>
              Choose Template
              <ArrowRight sx={{}} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
