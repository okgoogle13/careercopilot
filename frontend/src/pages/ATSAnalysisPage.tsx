
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ATSAnalysisDashboard, AnalysisResult } from '../components/features/Analysis/ATSAnalysisDashboard';

// Placeholder for the async function to fetch analysis data
const fetchAnalysisData = async (resumeId: string): Promise<AnalysisResult> => {
  console.log(`Fetching analysis data for resumeId: ${resumeId}`);
  // Simulate a network request delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock data structure matching the AnalysisResult type
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
        description: 'Your community services experience aligns perfectly with job requirements',
      },
      {
        type: 'improvement',
        title: 'Add Technical Skills',
        description: 'Include specific database management and reporting software experience',
      },
      {
        type: 'opportunity',
        title: 'Highlight Leadership',
        description: 'Emphasize your program coordination and team leadership experience',
      },
    ],
  };

  // To test the error state, you can uncomment the following line:
  // throw new Error('Failed to fetch analysis data');

  return mockData;
};


export function ATSAnalysisPage({ resumeId }: { resumeId: string }) {
  const { data, isLoading, isError, error } = useQuery<AnalysisResult, Error>({
    queryKey: ['analysis', resumeId],
    queryFn: () => fetchAnalysisData(resumeId),
  });

  const handleBackToJobAnalysis = () => {
    console.log('Back to Job Analysis clicked');
  };

  const handleContinueToTemplates = () => {
    console.log('Continue to Templates clicked');
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography ml={2}>Loading analysis...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">Error fetching analysis: {error.message}</Typography>
      </Box>
    );
  }

  if (data) {
    return (
      <ATSAnalysisDashboard
        data={data}
        onBackToJobAnalysis={handleBackToJobAnalysis}
        onContinueToTemplates={handleContinueToTemplates}
      />
    );
  }

  return null;
}
