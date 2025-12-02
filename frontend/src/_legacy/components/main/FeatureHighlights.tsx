import { Bolt, EmojiEvents, GpsFixed, TrendingUp } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';

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
    <Grid container spacing={4} sx={{
      mt: 8
    }}>
      {features.map((feature, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Box sx={{
      textAlign: "center"
    }}>
            <Box sx={{
      display: "flex",
      justifyContent: "center",
      mb: 3
    }}>
              <Box sx={{
      p: 3,
      borderRadius: "var(--sys-shape-radius-full)",}}>{feature.icon}</Box>
            </Box>
            <Typography variant="h6" sx={{
      fontWeight: 600,
      mb: 2
    }}>
              {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
