import React from 'react';
import { Box, Typography, Grid  } from '@mui/material';
import { Bolt, GpsFixed, TrendingUp, EmojiEvents } from '@mui/icons-material';

const features = [
  {
    icon: <Bolt sx={{ fontSize: 24 }} />,
    title: 'AI-Powered Applications',
    description: 'Generate tailored resumes and cover letters in seconds',
  },
  {
    icon: <GpsFixed sx={{ fontSize: 24 }} />,
    title: 'Smart Job Matching',
    description: 'Find opportunities that match your skills and goals',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 24 }} />,
    title: 'Track Progress',
    description: 'Monitor your application success with detailed analytics',
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 24 }} />,
    title: 'Interview Prep',
    description: 'Practice with AI-generated questions and feedback',
  },
];

export function FeatureHighlights() {
  return (
    <Grid2 container spacing={4} className="mt-8">
      {features.map((feature, index) => (
        <Grid2 item xs={12} sm={6} md={3} key={index}>
          <Box className="text-center">
            <Box className="flex justify-center mb-3">
              <Box className="p-3 bg-primary/10 rounded-full text-primary">{feature.icon}</Box>
            </Box>
            <Typography variant="h6" className="font-semibold mb-2">
              {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </Box>
        </Grid2>
      ))}
    </Grid2>
  );
}
