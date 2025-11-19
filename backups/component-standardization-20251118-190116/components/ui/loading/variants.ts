import { Box, BoxProps, Skeleton, SkeletonProps, Stack, SxProps, Theme } from '@mui/material';
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

interface CardSkeletonProps {
  height?: number | string;
  sx?: SxProps<Theme>;
}

interface ListSkeletonProps {
  count?: number;
  itemHeight?: number | string;
  sx?: SxProps<Theme>;
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  sx?: SxProps<Theme>;
}

interface FormSkeletonProps {
  fields?: number;
  sx?: SxProps<Theme>;
}

export const LoadingSkeleton = ({
  variant = 'text',
  count = 1,
  animation = 'pulse',
  wrapper: Wrapper = Box,
  wrapperProps = {},
  ...props
}: LoadingSkeletonProps) => (
  <Wrapper {...wrapperProps}>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} variant={variant} {...props} />
    ))}
  </Wrapper>
);

/**
 * A loading skeleton for a card component
 */
export const CardSkeleton = ({
  height = 200,
  sx = {},
}: CardSkeletonProps) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      ...sx,
    }}
  >
    <Stack spacing={2}>
      <Skeleton variant="rectangular" width="60%" height={24} />
      <Skeleton variant="rectangular" width="100%" height={16} />
      <Skeleton variant="rectangular" width="80%" height={16} />
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={height} sx={{ mt: 2 }} />
    </Stack>
  </Box>
);

/**
 * A loading skeleton for a list of items
 */
export const ListSkeleton = ({
  count = 3,
  itemHeight = 72,
  sx = {},
}: {
  count?: number;
  itemHeight?: number | string;
  sx?: SxProps<Theme>;
}) => (
  <Box sx={{ width: '100%', ...sx }}>
    {Array.from({ length: count }).map((_, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:last-child': {
            borderBottom: 'none',
          },
        }}
      >
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
          <Skeleton width="40%" height={16} />
        </Box>
        <Skeleton width={24} height={24} />
      </Box>
    ))}
  </Box>
);

/**
 * A loading skeleton for a table
 */
export const TableSkeleton = ({
  rows = 5,
  columns = 4,
  sx = {},
}: {
  rows?: number;
  columns?: number;
  sx?: SxProps<Theme>;
}) => (
  <Box sx={{ width: '100%', ...sx }}>
    {/* Header */}
    <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider' }}>
      {Array.from({ length: columns }).map((_, colIndex) => (
        <Box
          key={`header-${colIndex}`}
          sx={{
            flex: 1,
            p: 2,
            fontWeight: 'medium',
            borderRight: '1px solid',
            borderColor: 'divider',
            '&:last-child': {
              borderRight: 'none',
            },
          }}
        >
          <Skeleton width="60%" height={20} />
        </Box>
      ))}
    </Box>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box
        key={`row-${rowIndex}`}
        sx={{
          display: 'flex',
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:last-child': {
            borderBottom: 'none',
          },
        }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Box
            key={`cell-${rowIndex}-${colIndex}`}
            sx={{
              flex: 1,
              p: 2,
              borderRight: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderRight: 'none',
              },
            }}
          >
            <Skeleton width={colIndex % 2 === 0 ? '80%' : '60%'} height={20} />
          </Box>
        ))}
      </Box>
    ))}
  </Box>
);

/**
 * A loading skeleton for a form
 */
export const FormSkeleton = ({
  fields = 4,
  sx = {},
}: {
  fields?: number;
  sx?: SxProps<Theme>;
}) => (
  <Box sx={{ width: '100%', maxWidth: 600, ...sx }}>
    <Stack spacing={3}>
      {Array.from({ length: fields }).map((_, index) => (
        <Box key={index}>
          <Skeleton width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={40} />
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Skeleton variant="rectangular" width={100} height={36} />
        <Skeleton variant="outlined" width={100} height={36} />
      </Box>
    </Stack>
  </Box>
);
