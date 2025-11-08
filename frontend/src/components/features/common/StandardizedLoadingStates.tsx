import { AutorenewRounded, Refresh, FlashOn, CheckCircle } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Card, CardContent, CardHeader, CardActions, Typography, Box } from '@mui/material';
import { motion } from 'motion/react';
import React from 'react';

import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Skeleton } from '../../ui/skeleton';

// Loading state variants
export type LoadingVariant =
  | 'spinner'
  | 'pulse'
  | 'dots'
  | 'bars'
  | 'skeleton'
  | 'card'
  | 'progress'
  | 'shimmer';

interface LoadingStateProps {
  variant?: LoadingVariant;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  progress?: number;
  className?: string;
}

// Basic Spinner Loading
export const SpinnerLoading = ({ size = 'md', message, className = '' }: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,}}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <AutorenewRounded sx={{}} />
      </motion.div>
      {message && <span sx={{
      typography: "body1",}}>{message}</span>}
    </div>
  );
};

// Pulse Loading
export const PulseLoading = ({ size = 'md', message, className = '' }: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,}}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        sx={{
      borderRadius: "9999px"
    }}
      />
      {message && <span sx={{
      typography: "body1",}}>{message}</span>}
    </div>
  );
};

// Dots Loading
export const DotsLoading = ({ size = 'md', message, className = '' }: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'w-1.5 h-4',
    md: 'w-2 h-6',
    lg: 'w-3 h-8',
  };

  return (
    <div sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,}}>
      <div sx={{
      display: "flex",
      gap: 1
    }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            sx={{
      borderRadius: "9999px"
    }}
          />
        ))}
      </div>
      {message && <span sx={{
      typography: "body1",}}>{message}</span>}
    </div>
  );
};

// Bars Loading
export const BarsLoading = ({ size = 'md', message, className = '' }: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'w-1 h-6',
    md: 'w-1.5 h-8',
    lg: 'w-2 h-12',
  };

  return (
    <div sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,}}>
      <div sx={{
      display: "flex",
      gap: 1,
      alignItems: "flex-end"
    }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            sx={{
      borderRadius: "0.125rem",}}
          />
        ))}
      </div>
      {message && <span sx={{
      typography: "body1",}}>{message}</span>}
    </div>
  );
};

// Progress Loading
export const ProgressLoading = ({ progress = 0, message, className = '' }: LoadingStateProps) => {
  return (
    <div sx={{}}>
      <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
        <span sx={{
      typography: "body1",
      fontWeight: 500
    }}>{message || 'Loading...'}</span>
        <span sx={{
      typography: "body1",}}>{progress}%</span>
      </div>
      <Progress value={progress} sx={{}} />
    </div>
  );
};

// Skeleton Loading
export const SkeletonLoading = ({
  variant = 'card',
  className = '',
}: LoadingStateProps & { variant?: 'card' | 'list' | 'profile' }) => {
  if (variant === 'card') {
    return (
      <Card sx={{
      p: 6,}}>
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
          <Skeleton sx={{
      borderRadius: "0.75rem"
    }} />
          <div sx={{
      flex: 1
    }}>
            <Skeleton sx={{
      width: "75%"
    }} />
            <Skeleton sx={{
      width: "50%"
    }} />
          </div>
        </div>
        <Skeleton sx={{
      width: "100%"
    }} />
        <Skeleton sx={{}} />
        <div sx={{
      display: "flex",
      gap: 2,
      pt: 2
    }}>
          <Skeleton sx={{
      borderRadius: "9999px"
    }} />
          <Skeleton sx={{
      borderRadius: "9999px"
    }} />
        </div>
        <Skeleton sx={{
      width: "100%"
    }} />
      </Card>
    );
  }

  if (variant === 'list') {
    return (
      <div sx={{}}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      p: 3,
      border: 1,
      borderRadius: "0.5rem"
    }}>
            <Skeleton sx={{
      borderRadius: "9999px"
    }} />
            <div sx={{
      flex: 1
    }}>
              <Skeleton sx={{
      width: "75%"
    }} />
              <Skeleton sx={{
      width: "50%"
    }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <Card sx={{
      p: 6,}}>
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      mb: 6
    }}>
          <Skeleton sx={{
      borderRadius: "9999px"
    }} />
          <div sx={{
      flex: 1
    }}>
            <Skeleton sx={{}} />
            <Skeleton sx={{}} />
            <Skeleton sx={{}} />
          </div>
        </div>
        <div sx={{}}>
          <Skeleton sx={{
      width: "100%"
    }} />
          <Skeleton sx={{}} />
          <Skeleton sx={{}} />
        </div>
      </Card>
    );
  }

  return null;
};

// Shimmer Loading Effect
export const ShimmerLoading = ({ className = '' }: LoadingStateProps) => {
  return (
    <div sx={{
      overflow: "hidden",
      bgcolor: "gray.200",
      borderRadius: "0.25rem",}}>
      <motion.div
        sx={{}}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

// AI Processing Loading
export const AIProcessingLoading = ({
  message = 'AI is processing...',
  className = '',
}: LoadingStateProps) => {
  return (
    <div sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      p: 6,}}>
      <div sx={{}}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          sx={{
      border: 2,
      borderColor: "purple.200",
      borderRadius: "9999px"
    }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
        >
          <FlashOn sx={{
      color: "purple.600"
    }} />
        </motion.div>
      </div>
      <div sx={{
      textAlign: "center"
    }}>
        <p sx={{
      fontWeight: 500,
      color: "purple.700"
    }}>{message}</p>
        <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      mt: 2
    }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              sx={{
      bgcolor: "purple.400",
      borderRadius: "9999px"
    }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Success Loading (completion state)
export const SuccessLoading = ({ message = 'Complete!', className = '' }: LoadingStateProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,}}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.2, duration: 0.6 }}
        sx={{
      bgcolor: "green.100",
      borderRadius: "9999px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
      >
        <CheckCircle sx={{
      color: "green.600"
    }} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        sx={{
      typography: "body1",
      fontWeight: 500,
      color: "green.700"
    }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

// Main LoadingState component that selects the appropriate variant
export const LoadingState = ({
  variant = 'spinner',
  size = 'md',
  message,
  progress,
  className = '',
}: LoadingStateProps) => {
  const loadingComponents = {
    spinner: SpinnerLoading,
    pulse: PulseLoading,
    dots: DotsLoading,
    bars: BarsLoading,
    skeleton: SkeletonLoading,
    card: (props: any) => <SkeletonLoading {...props} variant="card" />,
    progress: ProgressLoading,
    shimmer: ShimmerLoading,
  };

  const LoadingComponent = loadingComponents[variant];

  return (
    <LoadingComponent size={size} message={message} progress={progress} className={className} />
  );
};

// All components are already exported individually above

export default LoadingState;
