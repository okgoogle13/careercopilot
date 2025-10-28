import { AutorenewRounded, Refresh, FlashOn, CheckCircle } from '@mui/icons-material';
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
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <AutorenewRounded className={`${sizeClasses[size]} text-primary`} />
      </motion.div>
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
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
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`${sizeClasses[size]} bg-primary rounded-full`}
      />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
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
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            className={`${sizeClasses[size]} bg-primary rounded-full`}
          />
        ))}
      </div>
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
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
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="flex gap-1 items-end">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            className={`${sizeClasses[size]} bg-primary rounded-sm origin-bottom`}
          />
        ))}
      </div>
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  );
};

// Progress Loading
export const ProgressLoading = ({ progress = 0, message, className = '' }: LoadingStateProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{message || 'Loading...'}</span>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
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
      <Card className={`p-6 space-y-4 ${className}`}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full" />
      </Card>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </Card>
    );
  }

  return null;
};

// Shimmer Loading Effect
export const ShimmerLoading = ({ className = '' }: LoadingStateProps) => {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
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
    <div className={`flex flex-col items-center justify-center gap-4 p-6 ${className}`}>
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-purple-200 border-t-purple-600 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <FlashOn className="w-5 h-5 text-purple-600" />
        </motion.div>
      </div>
      <div className="text-center">
        <p className="font-medium text-purple-700">{message}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="w-2 h-2 bg-purple-400 rounded-full"
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
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
      >
        <CheckCircle className="w-6 h-6 text-green-600" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-sm font-medium text-green-700"
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
