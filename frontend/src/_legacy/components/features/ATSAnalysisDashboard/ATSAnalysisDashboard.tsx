import {
  ArrowLeft,
  ArrowRight,
  GpsFixed,
  CheckCircle,
  Error,
  TrendingUp,
  Description,
  Lightbulb,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

import { ATSScoreCircle } from '../../library/ATSScoreCircle';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';

export interface AnalysisResult {
  overallScore: number;
  keywordMatches: number;
  totalKeywords: number;
  sections: {
    [key: string]: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  insights: {
    type: 'strength' | 'improvement' | 'opportunity';
    title: string;
    description: string;
  }[];
}

interface ATSAnalysisDashboardProps {
  data: AnalysisResult;
  onBack?: () => void;
  onNext?: () => void;
  onContinueToTemplates?: () => void;
  onBackToJobAnalysis?: () => void;
}

export function ATSAnalysisDashboard({
  data: analysisData,
  onBack,
  onNext,
  onContinueToTemplates,
  onBackToJobAnalysis,
}: ATSAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'insights'>('overview');

  return (
    <Box sx={{ minHeight: '100vh', p: 6 }}>
      <Box>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 6,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Button
              variant="text"
              onClick={onBackToJobAnalysis}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <ArrowLeft />
              Back to Job Analysis
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button variant="contained" onClick={onContinueToTemplates} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              Continue to Templates
              <ArrowRight />
            </Button>
          </Box>
        </Box>

        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            ATS Compatibility Analysis
          </Typography>
          <Typography variant="h6">
            Your resume has been analyzed for compatibility with Applicant Tracking Systems. Here's how well it matches the job requirements.
          </Typography>
        </Box>

        {/* Main Score Section */}
        <Box sx={{ display: 'grid', gap: 8, mb: 8 }}>
          {/* Overall Score */}
          <Box>
            <Card sx={{ p: 8, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
                <GpsFixed />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Overall ATS Score
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <ATSScoreCircle score={analysisData.overallScore} size="large" />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h1" sx={{ fontWeight: 700 }}>
                    {analysisData.overallScore}%
                  </Typography>
                  <Typography variant="body1">ATS Compatible</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, px: 4, py: 2, borderRadius: '9999px', mb: 4 }}>
                <CheckCircle />
                <Typography sx={{ fontWeight: 500 }}>Excellent Match</Typography>
              </Box>

              <Typography variant="body1">
                Your resume is well-optimized for ATS systems and matches {analysisData.keywordMatches} of {analysisData.totalKeywords} key requirements.
              </Typography>
            </Card>
          </Box>

          {/* Score Breakdown */}
          <Box>
            <Card sx={{ p: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
                <TrendingUp />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Score Breakdown
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gap: 6 }}>
                {Object.entries(analysisData.sections).map(([section, score]) => (
                  <Box key={section}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {score}%
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: '9999px', overflow: 'hidden' }}>
                      <Box sx={{ width: `${score}%`, height: '100%', bgcolor: 'primary.main' }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        </Box>

        {/* Detailed Analysis Tabs */}
        <Box sx={{ mb: 8 }}>
          {/* Tab Navigation */}
          <Box sx={{ display: 'flex', gap: 2, mb: 6, borderBottom: 1, borderColor: 'divider' }}>
            {[
              { id: 'overview', label: 'Overview', icon: Description },
              { id: 'keywords', label: 'Keywords', icon: GpsFixed },
              { id: 'insights', label: 'Insights', icon: Lightbulb },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'contained' : 'text'}
                  onClick={() => setActiveTab(tab.id as any)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Icon />
                  {tab.label}
                </Button>
              );
            })}
          </Box>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <Box sx={{ display: 'grid', gap: 6 }}>
              <Card sx={{ p: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <CheckCircle sx={{ color: 'success.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Strengths
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                  {[
                    { title: 'Excellent Formatting', desc: 'Clean structure that ATS can easily parse' },
                    { title: 'Strong Experience Match', desc: 'Your background aligns well with job requirements' },
                    { title: 'Relevant Skills Listed', desc: 'Key competencies are clearly highlighted' },
                  ].map((item, idx) => (
                    <Box key={idx} component="li" sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: 'success.main', borderRadius: '50%', mt: 1, flexShrink: 0 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
                        <Typography variant="body2">{item.desc}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>

              <Card sx={{ p: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Error sx={{ color: 'warning.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Areas for Improvement
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                  {[
                    { title: 'Missing Keywords', desc: '3 important terms not found in your resume' },
                    { title: 'Technical Skills Section', desc: 'Could benefit from more specific software mentions' },
                  ].map((item, idx) => (
                    <Box key={idx} component="li" sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: 'warning.main', borderRadius: '50%', mt: 1, flexShrink: 0 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
                        <Typography variant="body2">{item.desc}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Box>
          )}

          {activeTab === 'keywords' && (
            <Card sx={{ p: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
                <GpsFixed />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Keyword Analysis
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gap: 6 }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 3, color: 'success.main' }}>
                    Matched Keywords ({analysisData.matchedKeywords.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {analysisData.matchedKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outlined">
                        {keyword}
                      </Badge>
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 3, color: 'warning.main' }}>
                    Missing Keywords ({analysisData.missingKeywords.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {analysisData.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outlined">
                        {keyword}
                      </Badge>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Card>
          )}

          {activeTab === 'insights' && (
            <Box sx={{ display: 'grid', gap: 4 }}>
              {analysisData.insights.map((insight, index) => (
                <Card key={index} sx={{ p: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    <Box>
                      {insight.type === 'strength' && <CheckCircle sx={{ color: 'success.main' }} />}
                      {insight.type === 'improvement' && <Error sx={{ color: 'warning.main' }} />}
                      {insight.type === 'opportunity' && <TrendingUp sx={{ color: 'info.main' }} />}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2">{insight.description}</Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 8, borderTop: 1, borderColor: 'divider' }}>
          <Button variant="outlined" onClick={onBack} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ArrowLeft />
            Back to Job Analysis
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography variant="body1">Ready to create an optimized resume?</Typography>
            <Button variant="contained" onClick={onNext} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              Choose Template
              <ArrowRight />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
