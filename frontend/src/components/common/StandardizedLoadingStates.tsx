/**
 * ELECTRIC ALCHEMIST: STANDARDIZED LOADING STATES
 *
 * Various loading state components with design system tokens.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';

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

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const SpinnerLoading = ({ size = 'md', message, className = '' }: LoadingStateProps) => {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={cn(sizeClasses[size], 'text-primary')} />
      </motion.div>
      {message && <span className="text-human text-base text-on-surface">{message}</span>}
    </div>
  );
};

export const PulseLoading = ({ size = 'md', message, className = '' }: LoadingStateProps) => {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={cn(
          sizeClasses[size],
          'rounded-full bg-primary-container'
        )}
      />
      {message && <span className="text-human text-base text-on-surface">{message}</span>}
    </div>
  );
};

export const DotsLoading = ({ size = 'md', message, className = '' }: LoadingStateProps) => {
  const dotSizes = {
    sm: 'w-1.5 h-4',
    md: 'w-2 h-6',
    lg: 'w-3 h-8',
  };
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
            className={cn(dotSizes[size], 'rounded-full bg-primary-container')}
          />
        ))}
      </div>
      {message && <span className="text-human text-base text-on-surface">{message}</span>}
    </div>
  );
};

export const BarsLoading = ({ size = 'md', message, className = '' }: LoadingStateProps) => {
  const barSizes = {
    sm: 'w-1 h-6',
    md: 'w-1.5 h-8',
    lg: 'w-2 h-12',
  };
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="flex gap-1 items-end">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
            className={cn(barSizes[size], 'rounded-sm bg-primary-container')}
          />
        ))}
      </div>
      {message && <span className="text-human text-base text-on-surface">{message}</span>}
    </div>
  );
};

export const ProgressLoading = ({
  progress = 0,
  message,
  className = '',
}: LoadingStateProps) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-human text-base font-medium text-on-surface">
          {message || 'Loading...'}
        </span>
        <span className="text-human text-base text-on-surface-variant">{progress}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
};

export const SkeletonLoading = ({
  variant = 'card',
  className = '',
}: LoadingStateProps & { variant?: 'card' | 'list' | 'profile' }) => {
  if (variant === 'card') {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1">
            <Skeleton variant="text" width="75%" height={20} className="mb-2" />
            <Skeleton variant="text" width="50%" height={16} />
          </div>
        </div>
        <Skeleton variant="rectangular" width="100%" height={100} className="mb-4" />
        <Skeleton variant="text" width="100%" height={16} className="mb-2" />
        <div className="flex gap-2 pt-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </div>
        <Skeleton variant="text" width="100%" height={16} className="mt-4" />
      </Card>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 border border-outline-variant rounded-[8px]"
          >
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1">
              <Skeleton variant="text" width="75%" height={16} className="mb-2" />
              <Skeleton variant="text" width="50%" height={14} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <Card className={cn('p-6', className)}>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton variant="circular" width={80} height={80} />
          <div className="flex-1">
            <Skeleton variant="text" width="60%" height={24} className="mb-2" />
            <Skeleton variant="text" width="40%" height={20} className="mb-2" />
            <Skeleton variant="text" width="30%" height={16} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="90%" height={16} />
          <Skeleton variant="text" width="80%" height={16} />
        </div>
      </Card>
    );
  }

  return null;
};

export const ShimmerLoading = ({ className = '' }: LoadingStateProps) => {
  return (
    <div
      className={cn(
        'overflow-hidden bg-surface-container-low rounded-[8px] relative',
        className
      )}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export const AIProcessingLoading = ({
  message = 'AI is processing...',
  className = '',
}: LoadingStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 p-6', className)}>
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-2 border-primary-container/50 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Zap className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-human text-base font-medium text-primary mb-2">{message}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
              className="w-2 h-2 bg-primary-container rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const SuccessLoading = ({
  message = 'Complete!',
  className = '',
}: LoadingStateProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn('flex flex-col items-center justify-center gap-3', className)}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center"
      >
        <CheckCircle2 className="h-8 w-8 text-on-primary-container" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-human text-base font-medium text-primary"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

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

export default LoadingState;

