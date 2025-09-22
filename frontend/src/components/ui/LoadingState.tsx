import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Loader2 } from 'lucide-react';

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
    <Box className="flex flex-col items-center justify-center p-8">
      <Box className="mb-4">
        <Loader2
          size={iconSize}
          className="animate-spin text-primary"
        />
      </Box>

      {label && (
        <Typography
          variant="body2"
          color="text.secondary"
          className="text-center"
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}