import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeMap = {
  sm: 20,
  md: 32,
  lg: 48,
};

export function LoadingState({ size = 'md', label }: LoadingStateProps) {
  const iconSize = sizeMap[size];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Box sx={{ mb: 2 }}>
        <CircularProgress
          size={iconSize}
          sx={{ color: 'primary.main' }}
        />
      </Box>

      {label && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}