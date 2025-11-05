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
      "bg-background": true,
      p: 6
    }}>
      <div sx={{
      "max-w-6xl": true,
      "mx-auto": true,
      "space-y-8": true
    }}>
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
      "text-muted-foreground": true,
      '&:hover': { "text-foreground": true }
    }}
            >
              <ArrowLeft sx={{
      "w-4": true,
      "h-4": true
    }} />
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
              <ArrowRight sx={{
      "w-4": true,
      "h-4": true
    }} />
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div sx={{
      textAlign: "center",
      "space-y-4": true
    }}>
          <h1 sx={{
      typography: h2,
      fontWeight: 700,
      "text-gradient-aurora": true
    }}>ATS Compatibility Analysis</h1>
          <p sx={{
      typography: h6,
      "text-muted-foreground": true,
      "max-w-2xl": true,
      "mx-auto": true
    }}>
            Your resume has been analyzed for compatibility with Applicant Tracking Systems. Here's
            how well it matches the job requirements.
          </p>
        </div>

        {/* Main Score Section - Enhanced Size */}
        <div sx={{
      "grid": true,
      [theme.breakpoints.up('md')]: { "grid-cols-3": true },
      gap: 8
    }}>
          {/* Overall Score - Made Larger and More Prominent */}
          <div sx={{
      [theme.breakpoints.up('md')]: { "col-span-1": true }
    }}>
            <Card sx={{
      "card-aurora": true,
      p: 8,
      textAlign: "center"
    }}>
              <div sx={{
      "space-y-6": true
    }}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      mb: 4
    }}>
                  <GpsFixed sx={{
      "w-6": true,
      "h-6": true,
      "text-primary": true
    }} />
                  <h2 sx={{
      typography: h5,
      fontWeight: 600
    }}>Overall ATS Score</h2>
                </div>

                {/* Enlarged Score Circle */}
                <div sx={{
      display: "flex",
      justifyContent: "center"
    }}>
                  <div sx={{
      "relative": true
    }}>
                    <ATSScoreCircle
                      score={analysisData.overallScore}
                      size="large"
                      sx={{
      "w-48": true,
      "h-48": true
    }} // Increased from default size
                    />
                    {/* Enhanced pulsing score text overlay */}
                    <div sx={{
      "absolute": true,
      "inset-0": true,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                      <div sx={{
      textAlign: "center"
    }}>
                        <div
                          sx={{
      typography: h1,
      fontWeight: 700,
      "pulsing-score-text": true,
      "${getScoreColor(analysisData.overallScore)}": true
    }}
                        >
                          {analysisData.overallScore}%
                        </div>
                        <div sx={{
      typography: body1,
      "text-muted-foreground": true,
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
      borderRadius: 9999px,
      "${getScoreBgColor(analysisData.overallScore)}": true
    }}
                >
                  <CheckCircle sx={{
      "w-4": true,
      "h-4": true,
      "${getScoreColor(analysisData.overallScore)}": true
    }} />
                  <span sx={{
      fontWeight: 500,
      "${getScoreColor(analysisData.overallScore)}": true
    }}>
                    Excellent Match
                  </span>
                </div>

                <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
                  Your resume is well-optimized for ATS systems and matches{' '}
                  {analysisData.keywordMatches} of {analysisData.totalKeywords} key requirements.
                </p>
              </div>
            </Card>
          </div>

          {/* Score Breakdown */}
          <div sx={{
      [theme.breakpoints.up('md')]: { "col-span-2": true }
    }}>
            <Card sx={{
      "card-surface": true,
      p: 6
    }}>
              <h3 sx={{
      typography: h5,
      fontWeight: 600,
      mb: 6,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <TrendingUp sx={{
      "w-5": true,
      "h-5": true,
      "text-primary": true
    }} />
                Score Breakdown
              </h3>

              <div sx={{
      "grid": true,
      "grid-cols-2": true,
      gap: 6
    }}>
                {Object.entries(analysisData.sections).map(([section, score]) => (
                  <div key={section} sx={{
      "space-y-3": true
    }}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                      <span sx={{
      typography: body1,
      fontWeight: 500,
      textTransform: "capitalize"
    }}>
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span sx={{
      typography: body1,
      fontWeight: 700,
      "${getScoreColor(score)}": true
    }}>{score}%</span>
                    </div>
                    <div sx={{
      width: "100%",
      "bg-muted": true,
      borderRadius: 9999px,
      "h-2": true
    }}>
                      <div
                        sx={{
      "h-2": true,
      borderRadius: 9999px,
      "transition-all": true,
      "duration-1000": true,
      "${": true,
      "score": true,
      ">=": true,
      "80": true,
      "?": true,
      "'bg-green-500'": true,
      ":": true,
      "score": true,
      ">=": true,
      "60": true,
      "?": true,
      "'bg-yellow-500'": true,
      ":": true,
      "'bg-red-500'": true,
      "}": true
    }}
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
        <div sx={{
      "space-y-6": true
    }}>
          {/* Tab Navigation */}
          <div sx={{
      display: "flex",
      "space-x-1": true,
      p: 1,
      "bg-muted": true,
      borderRadius: 0.5rem,
      "w-fit": true
    }}>
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
      borderRadius: 0.375rem,
      typography: body1,
      fontWeight: 500,
      "transition-colors": true,
      "${": true,
      "activeTab": true,
      "===": true,
      "tab.id": true,
      "?": true,
      "'bg-background": true,
      "text-foreground": true,
      "shadow-sm'": true,
      ":": true,
      "'text-muted-foreground": true,
      '&:hover': { "text-foreground'": true },
      "}": true
    }}
                >
                  <Icon sx={{
      "w-4": true,
      "h-4": true
    }} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div sx={{
      "grid": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 6
    }}>
              <Card sx={{
      "card-surface": true,
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
                  <CheckCircle sx={{
      "w-5": true,
      "h-5": true,
      color: "green.500"
    }} />
                  Strengths
                </h3>
                <ul sx={{
      "space-y-3": true
    }}>
                  <li sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <div sx={{
      "w-2": true,
      "h-2": true,
      bgcolor: "green.500",
      borderRadius: 9999px,
      mt: 2,
      flexShrink: 0
    }} />
                    <div>
                      <p sx={{
      fontWeight: 500
    }}>Excellent Formatting</p>
                      <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
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
      "w-2": true,
      "h-2": true,
      bgcolor: "green.500",
      borderRadius: 9999px,
      mt: 2,
      flexShrink: 0
    }} />
                    <div>
                      <p sx={{
      fontWeight: 500
    }}>Strong Experience Match</p>
                      <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
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
      "w-2": true,
      "h-2": true,
      bgcolor: "green.500",
      borderRadius: 9999px,
      mt: 2,
      flexShrink: 0
    }} />
                    <div>
                      <p sx={{
      fontWeight: 500
    }}>Relevant Skills Listed</p>
                      <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
                        Key competencies are clearly highlighted
                      </p>
                    </div>
                  </li>
                </ul>
              </Card>

              <Card sx={{
      "card-surface": true,
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
                  <Error sx={{
      "w-5": true,
      "h-5": true,
      color: "yellow.500"
    }} />
                  Areas for Improvement
                </h3>
                <ul sx={{
      "space-y-3": true
    }}>
                  <li sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
                    <div sx={{
      "w-2": true,
      "h-2": true,
      bgcolor: "yellow.500",
      borderRadius: 9999px,
      mt: 2,
      flexShrink: 0
    }} />
                    <div>
                      <p sx={{
      fontWeight: 500
    }}>Missing Keywords</p>
                      <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
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
      "w-2": true,
      "h-2": true,
      bgcolor: "yellow.500",
      borderRadius: 9999px,
      mt: 2,
      flexShrink: 0
    }} />
                    <div>
                      <p sx={{
      fontWeight: 500
    }}>Technical Skills Section</p>
                      <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
                        Could benefit from more specific software mentions
                      </p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          )}

          {activeTab === 'keywords' && (
            <div sx={{
      "space-y-6": true
    }}>
              {/* Keywords Section with Primary Color */}
              <Card sx={{
      "card-surface": true,
      p: 6
    }}>
                <h3
                  sx={{
      typography: h6,
      fontWeight: 600,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}
                  style={{ color: 'var(--color-primary)' }}
                >
                  <GpsFixed sx={{
      "w-5": true,
      "h-5": true
    }} style={{ color: 'var(--color-primary)' }} />
                  Keyword Analysis
                </h3>

                <div sx={{
      "grid": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
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
      "bg-green-500/10": true,
      color: "green.600",
      "border-green-500/20": true
    }}
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
      "bg-yellow-500/10": true,
      color: "yellow.600",
      "border-yellow-500/20": true
    }}
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
            <div sx={{
      "space-y-4": true
    }}>
              {/* Insights Section with Secondary Color */}
              <h3
                sx={{
      typography: h6,
      fontWeight: 600,
      mb: 4,
      display: "flex",
      alignItems: "center",
      gap: 2
    }}
                style={{ color: 'var(--color-secondary)' }}
              >
                <Lightbulb sx={{
      "w-5": true,
      "h-5": true
    }} style={{ color: 'var(--color-secondary)' }} />
                Actionable Insights
              </h3>

              {analysisData.insights.map((insight, index) => (
                <Card key={index} sx={{
      "card-surface": true,
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
      borderRadius: 0.5rem,
      "${": true,
      "insight.type": true,
      "===": true,
      "'strength'": true,
      "?": true,
      "'bg-green-500/10'": true,
      ":": true,
      "insight.type": true,
      "===": true,
      "'improvement'": true,
      "?": true,
      "'bg-yellow-500/10'": true,
      ":": true,
      "'bg-blue-500/10'": true,
      "}": true
    }}
                    >
                      {insight.type === 'strength' && (
                        <CheckCircle sx={{
      "w-5": true,
      "h-5": true,
      color: "green.500"
    }} />
                      )}
                      {insight.type === 'improvement' && (
                        <Error sx={{
      "w-5": true,
      "h-5": true,
      color: "yellow.500"
    }} />
                      )}
                      {insight.type === 'opportunity' && (
                        <TrendingUp sx={{
      "w-5": true,
      "h-5": true,
      color: "blue.500"
    }} />
                      )}
                    </div>
                    <div>
                      <h4 sx={{
      fontWeight: 600,
      mb: 2
    }}>{insight.title}</h4>
                      <p sx={{
      "text-muted-foreground": true
    }}>{insight.description}</p>
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
      borderTop: 1,
      "border-border": true
    }}>
          <Button variant="outline" onClick={onBack} sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
            <ArrowLeft sx={{
      "w-4": true,
      "h-4": true
    }} />
            Back to Job Analysis
          </Button>

          <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
            <div sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>
              Ready to create an optimized resume?
            </div>
            <Button onClick={onNext} sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      "btn-primary-cta": true
    }}>
              Choose Template
              <ArrowRight sx={{
      "w-4": true,
      "h-4": true
    }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
