import { Box, Skeleton as MuiSkeleton, SkeletonProps, styled } from '@mui/material';

const StyledSkeleton = styled(MuiSkeleton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)',
  borderRadius: theme.shape.borderRadius,
  '&:after': {
    background: `linear-gradient(90deg, transparent, ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'}, transparent)`,
  },
}));

interface SkeletonLoaderProps extends SkeletonProps {
  count?: number;
  containerClassName?: string;
}

export const Skeleton = ({
  count = 1,
  containerClassName,
  ...props
}: SkeletonLoaderProps) => {
  return (
    <Box className={containerClassName}>
      {[...Array(count)].map((_, index) => (
        <StyledSkeleton
          key={index}
          animation="wave"
          {...props}
          style={{
            ...props.style,
            marginBottom: index < count - 1 ? '0.5rem' : props.style?.marginBottom,
          }}
        />
      ))}
    </Box>
  );
};

// Common skeleton variants
export const CardSkeleton = ({ count = 1 }: { count?: number }) => (
  <Skeleton
    count={count}
    variant="rectangular"
    width="100%"
    height={200}
    sx={{ mb: 2, borderRadius: 2 }}
  />
);

export const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <Box sx={{ width: '100%' }}>
    <Skeleton
      count={lines}
      variant="text"
      width={lines > 1 ? '100%' : '60%'}
      height={24}
    />
  </Box>
);

export const AvatarSkeleton = ({ size = 40 }: { size?: number }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
  />
);
