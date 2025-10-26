import type { SkeletonProps as MuiSkeletonProps } from '@mui/material';
import { Skeleton as MuiSkeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledSkeleton = styled(MuiSkeleton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
}));

export interface SkeletonProps extends MuiSkeletonProps {
  className?: string;
}

export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return <StyledSkeleton ref={ref} className={className} {...props} />;
  }
);

Skeleton.displayName = 'Skeleton';
