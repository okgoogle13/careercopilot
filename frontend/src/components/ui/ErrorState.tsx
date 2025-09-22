import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <Box className="flex flex-col items-center justify-center p-8 text-center">
      <Box className="mb-4">
        <Box className="p-4 bg-red-100 rounded-full">
          <AlertCircle size={32} className="text-red-600" />
        </Box>
      </Box>

      <Typography variant="h6" className="font-semibold mb-2">
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" className="mb-6 max-w-md">
        {message}
      </Typography>

      <Button
        variant="outlined"
        onClick={onRetry}
        className="border-primary text-primary hover:bg-primary/10"
      >
        Try Again
      </Button>
    </Box>
  );
}