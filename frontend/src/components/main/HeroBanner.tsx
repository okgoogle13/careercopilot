import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ArrowRight, PlayArrow } from '@mui/icons-material';
import { FeatureHighlights } from './FeatureHighlights';

interface HeroBannerProps {
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
}

export function HeroBanner({ onGetStarted, onWatchDemo }: HeroBannerProps) {
  return (
    <Box className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
      <Container maxWidth="lg">
        {/* Main Hero Content */}
        <Box className="text-center mb-16">
          <Typography
            variant="h1"
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
          >
            Land Your Dream Job with AI
          </Typography>

          <Typography
            variant="h2"
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Create compelling applications, track your progress, and ace your interviews with our
            AI-powered career copilot
          </Typography>

          {/* CTA Buttons */}
          <Box className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="contained"
              size="large"
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
              endIcon={<ArrowRight sx={{ fontSize: 20 }} />}
            >
              Get Started Free
            </Button>

            <Button
              variant="outline"
              size="large"
              onClick={onWatchDemo}
              className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg"
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
