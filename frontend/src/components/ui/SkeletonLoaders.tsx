import { Box, Card } from '@mui/material';
import { keyframes } from '@emotion/react';
import React from 'react';

// Shimmer animation keyframe
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export interface SkeletonProps {
  /**
   * Shape variant of the skeleton
   */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /**
   * Width of the skeleton (number in px or string with units)
   */
  width?: number | string;
  /**
   * Height of the skeleton (number in px or string with units)
   */
  height?: number | string;
  /**
   * Animation style
   */
  animation?: 'pulse' | 'wave' | 'none';
  /**
   * Additional className
   */
  className?: string;
}

const variantStyles = {
  text: {
    height: '1em',
    borderRadius: '4px',
  },
  circular: {
    borderRadius: '50%',
  },
  rectangular: {
    borderRadius: 0,
  },
  rounded: {
    borderRadius: '8px',
  },
};

const shimmerStyles = {
  animation: `${shimmer} 2s infinite linear`,
  backgroundSize: '1000px 100%',
  backgroundImage:
    'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 20%, #e5e7eb 40%, #e5e7eb 100%)',
};

const pulseStyles = {
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
  },
};

/**
 * Skeleton - Base skeleton component with configurable variants
 *
 * @example
 * ```tsx
 * <Skeleton variant="text" width={200} />
 * <Skeleton variant="circular" width={40} height={40} />
 * <Skeleton variant="rectangular" width="100%" height={200} />
 * ```
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'wave',
  className,
}: SkeletonProps) {
  const animationStyles = animation === 'wave' ? shimmerStyles : animation === 'pulse' ? pulseStyles : {};

  return (
    <Box
      className={className}
      sx={{
        backgroundColor: '#e5e7eb',
        width: width || '100%',
        height: height || variantStyles[variant].height || '100%',
        borderRadius: variantStyles[variant].borderRadius,
        ...animationStyles,
      }}
      aria-busy="true"
      aria-label="Loading..."
      role="status"
    />
  );
}

/**
 * SkeletonText - Pre-configured text line skeletons
 *
 * @example
 * ```tsx
 * <SkeletonText lines={3} width="full" />
 * <SkeletonText lines={2} width="medium" />
 * ```
 */
export function SkeletonText({
  lines = 1,
  width = 'full',
  className,
}: {
  lines?: number;
  width?: 'full' | 'medium' | 'short';
  className?: string;
}) {
  const widthMap = {
    full: '100%',
    medium: '80%',
    short: '60%',
  };

  return (
    <Box className={className} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 && lines > 1 ? widthMap.medium : widthMap[width]}
          height={16}
        />
      ))}
    </Box>
  );
}

/**
 * SkeletonCircle - Pre-configured circular skeleton for avatars
 *
 * @example
 * ```tsx
 * <SkeletonCircle size={48} />
 * ```
 */
export function SkeletonCircle({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return <Skeleton variant="circular" width={size} height={size} className={className} />;
}

/**
 * SkeletonButton - Pre-configured button skeleton
 *
 * @example
 * ```tsx
 * <SkeletonButton />
 * <SkeletonButton width={120} />
 * ```
 */
export function SkeletonButton({
  width = 100,
  height = 36,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return <Skeleton variant="rounded" width={width} height={height} className={className} />;
}

/**
 * LoadingProfileCard - Complete profile card skeleton layout
 *
 * @example
 * ```tsx
 * {isLoading ? <LoadingProfileCard /> : <ProfileCard data={data} />}
 * ```
 */
export function LoadingProfileCard() {
  return (
    <Card sx={{ p: 3 }}>
      {/* Avatar + Name */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <SkeletonCircle size={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      </Box>

      {/* Metadata rows */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={40} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={60} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={50} />
        </Box>
      </Box>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton variant="rounded" width="100%" height={36} />
        <Skeleton variant="rounded" width="100%" height={36} />
      </Box>
    </Card>
  );
}

/**
 * LoadingCard - Generic card skeleton
 *
 * @example
 * ```tsx
 * <LoadingCard />
 * ```
 */
export function LoadingCard() {
  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <SkeletonCircle size={40} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={18} />
          <Skeleton variant="text" width="50%" height={14} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={60} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={80} />
        </Box>
      </Box>
    </Card>
  );
}

/**
 * LoadingDashboard - Multiple card skeletons in a grid
 *
 * @example
 * ```tsx
 * {isLoading ? <LoadingDashboard count={3} /> : <Dashboard data={data} />}
 * ```
 */
export function LoadingDashboard({ count = 3 }: { count?: number }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingProfileCard key={index} />
      ))}
    </Box>
  );
}
