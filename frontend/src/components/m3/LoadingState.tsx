
import { Box, Typography, ThemeProvider } from '@mui/material';
import React from 'react';
import { m3Theme } from '../../../styles/m3-theme';
import { M3LoadingSpinner } from './LoadingSpinner';

export interface M3LoadingStateProps {
  message?: string;
  size?: number;
  className?: string;
}

export const M3LoadingState: React.FC<M3LoadingStateProps> = ({
  message = 'Loading...',
  size = 40,
  className,
}) => {
  return (
    <ThemeProvider theme={m3Theme}>
      <Box
        className={className}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 4,
        }}
      >
        <M3LoadingSpinner size={size} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    </ThemeProvider>
  );
};
