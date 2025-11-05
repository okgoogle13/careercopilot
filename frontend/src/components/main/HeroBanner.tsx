import { ArrowRight, PlayArrow } from '@mui/icons-material';
import { Box, Typography, Button, Container } from '@mui/material';
import React from 'react';

import { FeatureHighlights } from './FeatureHighlights';

interface HeroBannerProps {
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
}

export function HeroBanner({ onGetStarted, onWatchDemo }: HeroBannerProps) {
  return (
    <Box sx={{
      "bg-gradient-to-br": true,
      "from-primary/5": true,
      "to-primary/10": true,
      py: 20
    }}>
      <Container maxWidth="lg">
        {/* Main Hero Content */}
        <Box sx={{
      textAlign: "center",
      mb: 16
    }}>
          <Typography
            variant="h1"
            sx={{
      typography: h2,
      [theme.breakpoints.up('sm')]: { typography: h1 },
      fontWeight: 700,
      mb: 6,
      "bg-gradient-to-r": true,
      "from-primary": true,
      "to-primary/80": true,
      "bg-clip-text": true,
      "text-transparent": true
    }}
          >
            Land Your Dream Job with AI
          </Typography>

          <Typography
            variant="h2"
            sx={{
      typography: h5,
      [theme.breakpoints.up('sm')]: { typography: h4 },
      color: "gray.600",
      mb: 8,
      "max-w-3xl": true,
      "mx-auto": true
    }}
          >
            Create compelling applications, track your progress, and ace your interviews with our
            AI-powered career copilot
          </Typography>

          {/* CTA Buttons */}
          <Box sx={{
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up('xs')]: { flexDirection: "row" },
      gap: 4,
      justifyContent: "center",
      alignItems: "center"
    }}>
            <Button
              variant="contained"
              size="large"
              onClick={onGetStarted}
              sx={{
      "bg-primary": true,
      '&:hover': { "bg-primary/90": true },
      px: 8,
      py: 3,
      typography: h6
    }}
              endIcon={<ArrowRight sx={{ fontSize: 20 }} />}
            >
              Get Started Free
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={onWatchDemo}
              sx={{
      "border-primary": true,
      "text-primary": true,
      '&:hover': { "bg-primary/10": true },
      px: 8,
      py: 3,
      typography: h6
    }}
              startIcon={<PlayArrow sx={{ fontSize: 20 }} />}
            >
              Watch Demo
            </Button>
          </Box>
        </Box>

        {/* Feature Highlights */}
        <FeatureHighlights />
      </Container>
    </Box>
  );
}
