import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledEmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  textAlign: 'center',
  gap: theme.spacing(2),
}));

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  return (
    <StyledEmptyState className={className}>
      {icon && <Box sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }}>{icon}</Box>}
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 400 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 2 }}>
          {actionLabel}
        </Button>
      )}
    </StyledEmptyState>
  );
};
