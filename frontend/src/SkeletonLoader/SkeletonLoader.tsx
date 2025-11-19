/**
 * Skeleton Loader Component
 * Animated placeholder for loading content
 */

import { Box, Skeleton, Stack, Container } from '@mui/material';
import React from 'react';

import { skeletonAnimation } from '../utils/animations';

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'list' | 'profile' | 'content';
  count?: number;
  fullHeight?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 3,
  fullHeight = false,
}) => {
  const renderCardSkeleton = () => (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        ...skeletonAnimation,
      }}
    >
      <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
    </Box>
  );

  const renderTableSkeleton = () => (
    <Box>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            mb: 2,
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            ...skeletonAnimation,
          }}
        >
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Box>
      ))}
    </Box>
  );

  const renderListSkeleton = () => (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            ...skeletonAnimation,
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={16} width="80%" />
          </Box>
        </Box>
      ))}
    </Stack>
  );

  const renderProfileSkeleton = () => (
    <Box sx={{ ...skeletonAnimation }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="circular" width={64} height={64} sx={{ mr: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={20} width="60%" />
        </Box>
      </Box>
      <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 1, mb: 2 }} />
      <Stack spacing={1}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </Stack>
    </Box>
  );

  const renderContentSkeleton = () => (
    <Box sx={{ ...skeletonAnimation }}>
      <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
      <Stack spacing={1}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="90%" />
      </Stack>
    </Box>
  );

  const getSkeletonContent = () => {
    switch (type) {
      case 'card':
        return Array.from({ length: count }).map((_, i) => (
          <Box key={i} sx={{ mb: 2 }}>
            {renderCardSkeleton()}
          </Box>
        ));
      case 'table':
        return renderTableSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'profile':
        return renderProfileSkeleton();
      case 'content':
        return renderContentSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <Box
      sx={{
        minHeight: fullHeight ? '100vh' : 'auto',
        py: 2,
      }}
      role="status"
      aria-label="Loading content"
      aria-busy={true}
    >
      {type === 'card' ? (
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {getSkeletonContent()}
          </Box>
        </Container>
      ) : (
        <Container maxWidth="lg">{getSkeletonContent()}</Container>
      )}
    </Box>
  );
};
