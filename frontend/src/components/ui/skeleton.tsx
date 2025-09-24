import React from 'react';
import { Skeleton as MuiSkeleton, SkeletonProps as MuiSkeletonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

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
