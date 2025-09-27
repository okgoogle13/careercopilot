import React from 'react';
import { LinearProgress, LinearProgressProps, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

export interface ProgressProps extends LinearProgressProps {
  value?: number;
  className?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className, ...props }, ref) => {
    return (
      <Box ref={ref} className={className} sx={{ width: '100%' }}>
        <StyledLinearProgress variant="determinate" value={value} {...props} />
      </Box>
    );
  }
);

Progress.displayName = 'Progress';
