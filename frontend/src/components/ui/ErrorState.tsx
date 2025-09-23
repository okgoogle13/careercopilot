import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ p: 2, backgroundColor: 'error.lighter', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ErrorOutline sx={{ fontSize: 32, color: 'error.main' }} />
        </Box>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '28rem' }}>
        {message}
      </Typography>

      <Button
        variant="outlined"
        onClick={onRetry}
        sx={{
          borderColor: 'primary.main',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.light',
            opacity: 0.1
          }
        }}
      >
        Try Again
      </Button>
    </Box>
  );
}