
import { Skeleton, SkeletonProps, Box, BoxProps, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';
import { m3Theme } from '../../../styles/m3-theme';

type SkeletonVariant = 'text' | 'rectangular' | 'circular' | 'rounded';

interface M3LoadingSkeletonProps extends SkeletonProps {
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

export const M3LoadingSkeleton = ({
  variant = 'text',
  count = 1,
  animation = 'pulse',
  wrapper: Wrapper = Box,
  wrapperProps = {},
  ...props
}: M3LoadingSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <Skeleton
      key={index}
      variant={variant}
      animation={animation}
      {...props}
      sx={{
        bgcolor: 'surface.containerHigh',
        ...(variant === 'text' && { transform: 'none' }), // Prevent text skeleton from having a transform
        ...props.sx,
      }}
    />
  ));

  return <ThemeProvider theme={m3Theme}><Wrapper {...wrapperProps}>{skeletons}</Wrapper></ThemeProvider>;
};

export default M3LoadingSkeleton;
