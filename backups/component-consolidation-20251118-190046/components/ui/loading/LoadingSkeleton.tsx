import { Skeleton, SkeletonProps, Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

type SkeletonVariant = 'text' | 'rectangular' | 'circular' | 'rounded';

interface LoadingSkeletonProps extends SkeletonProps {
  /**
   * Type of skeleton to display
   * @default 'text'
   */
  variant?: SkeletonVariant;
  /**
   * Number of skeleton items to render
   * @default 1
   */
  count?: number;
  /**
   * Whether to show a shimmer animation
   * @default true
   */
  animation?: 'pulse' | 'wave' | false;
  /**
   * Custom wrapper component
   */
  wrapper?: React.ComponentType<{ children: ReactNode }>;
  /**
   * Additional wrapper props
   */
  wrapperProps?: BoxProps;
}

export const LoadingSkeleton = ({
  variant = 'text',
  count = 1,
  animation = 'pulse',
  wrapper: Wrapper = Box,
  wrapperProps = {},
  ...props
}: LoadingSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <Skeleton
      key={index}
      variant={variant}
      animation={animation}
      {...props}
      sx={{
        bgcolor: 'background.paper',
        ...(variant === 'text' && { transform: 'none' }), // Prevent text skeleton from having a transform
        ...props.sx,
      }}
    />
  ));

  return <Wrapper {...wrapperProps}>{skeletons}</Wrapper>;
};

export default LoadingSkeleton;
