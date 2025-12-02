/**
 * ELECTRIC ALCHEMIST: FEATURE HIGHLIGHTS COMPONENT
 *
 * Feature highlights section using Electric Alchemist Design System v4.4.
 */

import React from 'react';
import { Zap, Target, TrendingUp, Award } from 'lucide-react';
import { Grid, Card } from '@/components';

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'AI-Powered Applications',
    description: 'Generate tailored resumes and cover letters in seconds',
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Smart Job Matching',
    description: 'Find opportunities that match your skills and goals',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Track Progress',
    description: 'Monitor your application success with detailed analytics',
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Interview Prep',
    description: 'Practice with AI-generated questions and feedback',
  },
];

export function FeatureHighlights() {
  return (
    <Grid cols={4} gap="md" className="mt-8">
      {features.map((feature, index) => (
        <Card key={index} variant="default" className="text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary-container/20 text-primary">
              {feature.icon}
            </div>
          </div>
          <h3 className="text-hero text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-human text-sm text-on-surface-variant">
            {feature.description}
          </p>
        </Card>
      ))}
    </Grid>
  );
}

export default FeatureHighlights;

