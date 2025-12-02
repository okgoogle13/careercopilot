/**
 * ELECTRIC ALCHEMIST: ATS ANALYSIS PAGE
 *
 * ATS Analysis page using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Card, Button } from '@/components/ui';
import { ATSAnalysisDashboard } from '@/features/analysis/ATSAnalysisDashboard';
import type { AnalysisResult } from '@/features/analysis/ATSAnalysisDashboard';

const fetchAnalysisData = async (resumeId: string): Promise<AnalysisResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const mockData: AnalysisResult = {
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
        type: 'strength',
        title: 'Strong Experience Match',
        description:
          'Your community services experience aligns perfectly with job requirements',
      },
      {
        type: 'improvement',
        title: 'Add Technical Skills',
        description:
          'Include specific database management and reporting software experience',
      },
      {
        type: 'opportunity',
        title: 'Highlight Leadership',
        description:
          'Emphasize your program coordination and team leadership experience',
      },
    ],
  };

  return mockData;
};

export function ATSAnalysisPage({ resumeId }: { resumeId: string }) {
  const { data, isLoading, isError, error } = useQuery<AnalysisResult, Error>({
    queryKey: ['analysis', resumeId],
    queryFn: () => fetchAnalysisData(resumeId),
  });

  if (isLoading) {
    return (
      <Container size="lg">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="ml-4 text-human text-base">Loading analysis...</p>
        </div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container size="lg">
        <Card variant="default" className="p-6">
          <p className="text-human text-base text-error">
            Error fetching analysis: {error?.message}
          </p>
        </Card>
      </Container>
    );
  }

  if (data) {
    return (
      <Container size="lg">
        <ATSAnalysisDashboard
          data={data}
          onBackToJobAnalysis={() => console.log('Back to Job Analysis')}
          onContinueToTemplates={() => console.log('Continue to Templates')}
        />
      </Container>
    );
  }

  return null;
}

export default ATSAnalysisPage;

