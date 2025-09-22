import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-8">
      <CardContent className="text-center">
        <Box className="flex justify-center mb-4">
          <Box className="p-4 bg-gray-100 rounded-full">
            {icon}
          </Box>
        </Box>

        <Typography variant="h6" className="font-semibold mb-2">
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" className="mb-6">
          {description}
        </Typography>

        {action && (
          <Button
            variant="contained"
            onClick={action.onClick}
            className="bg-primary hover:bg-primary/90"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}