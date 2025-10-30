import { useState, useEffect } from 'react';
import { cn } from './ui/utils';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Loader2,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  Download,
  Sparkles,
  FileText,
} from 'lucide-react';

// Base loading component with Material 3 design principles
interface BaseLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  showLabel?: boolean;
}

// Spinner Loading Component
export function SpinnerLoading({
  size = 'md',
  className = '',
  label = 'Loading...',
  showLabel = true,
}: BaseLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className={cn('flex items-center justify-center gap-3', 'text-muted-foreground', className)}
    >
      <Loader2 className={cn(sizeClasses[size], 'animate-spin text-primary')} />
      {showLabel && <span className={cn(textSizeClasses[size], 'font-medium')}>{label}</span>}
    </div>
  );
}

// Skeleton Loading Components
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <Card className={cn('p-6 space-y-4 glass', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full bg-muted" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4 bg-muted" />
          <Skeleton className="h-3 w-1/2 bg-muted" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full bg-muted" />
        <Skeleton className="h-3 w-4/5 bg-muted" />
        <Skeleton className="h-3 w-3/5 bg-muted" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 bg-muted rounded-md" />
        <Skeleton className="h-8 w-16 bg-muted rounded-md" />
      </div>
    </Card>
  );
}

export function SkeletonList({
  count = 3,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 glass rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full bg-muted" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-2/3 bg-muted" />
            <Skeleton className="h-3 w-1/3 bg-muted" />
          </div>
          <Skeleton className="h-6 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 p-4 glass rounded-lg">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 bg-muted" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4 glass rounded-lg">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-3 bg-muted" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Progress Loading Components
interface ProgressLoadingProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressLoading({
  progress,
  label = 'Loading...',
  showPercentage = true,
  className = '',
}: ProgressLoadingProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {showPercentage && <span className="text-sm text-muted-foreground">{progress}%</span>}
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300 shimmer"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

// State Loading Components
interface StateLoadingProps {
  state: 'loading' | 'success' | 'error' | 'offline' | 'processing' | 'uploading' | 'downloading';
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function StateLoading({ state, message, onRetry, className = '' }: StateLoadingProps) {
  const getStateConfig = () => {
    switch (state) {
      case 'loading':
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin text-primary" />,
          title: 'Loading',
          defaultMessage: 'Please wait while we load your content...',
          color: 'text-primary',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-accent-green" />,
          title: 'Success',
          defaultMessage: 'Operation completed successfully!',
          color: 'text-accent-green',
        };
      case 'error':
        return {
          icon: <XCircle className="h-6 w-6 text-destructive" />,
          title: 'Error',
          defaultMessage: 'Something went wrong. Please try again.',
          color: 'text-destructive',
        };
      case 'offline':
        return {
          icon: <WifiOff className="h-6 w-6 text-muted-foreground" />,
          title: 'Offline',
          defaultMessage: "You're currently offline. Check your connection.",
          color: 'text-muted-foreground',
        };
      case 'processing':
        return {
          icon: <Sparkles className="h-6 w-6 animate-pulse text-brand-purple" />,
          title: 'Processing',
          defaultMessage: 'AI is processing your request...',
          color: 'text-brand-purple',
        };
      case 'uploading':
        return {
          icon: <Upload className="h-6 w-6 animate-bounce text-primary" />,
          title: 'Uploading',
          defaultMessage: 'Uploading your files...',
          color: 'text-primary',
        };
      case 'downloading':
        return {
          icon: <Download className="h-6 w-6 animate-bounce text-primary" />,
          title: 'Downloading',
          defaultMessage: 'Preparing your download...',
          color: 'text-primary',
        };
      default:
        return {
          icon: <Clock className="h-6 w-6 text-muted-foreground" />,
          title: 'Please Wait',
          defaultMessage: 'Processing...',
          color: 'text-muted-foreground',
        };
    }
  };

  const config = getStateConfig();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center space-y-4',
        className
      )}
    >
      <div className="flex flex-col items-center space-y-3">
        {config.icon}
        <div className="space-y-1">
          <h3 className={cn('font-semibold', config.color)}>{config.title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {message || config.defaultMessage}
          </p>
        </div>
      </div>

      {state === 'error' && onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4 focus-glow">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}

      {state === 'offline' && (
        <Badge variant="secondary" className="mt-2">
          <WifiOff className="h-3 w-3 mr-1" />
          No Connection
        </Badge>
      )}
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center space-y-4',
        className
      )}
    >
      {icon && <div className="text-muted-foreground mb-2">{icon}</div>}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
      </div>
      {action && (
        <Button onClick={action.onClick} className="mt-4 focus-glow">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Loading Screen Component (Full page)
interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  progress?: number;
  showProgress?: boolean;
  className?: string;
}

export function LoadingScreen({
  title = 'FML Career Copilot',
  subtitle = 'Preparing your AI-powered career tools...',
  progress,
  showProgress = false,
  className = '',
}: LoadingScreenProps) {
  return (
    <div className={cn('min-h-screen bg-background flex items-center justify-center', className)}>
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        {/* Logo with pulse animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="h-16 w-16 text-primary animate-pulse">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" />
                <circle cx="9" cy="9" r="1" />
                <circle cx="15" cy="9" r="1" />
                <path d="M10 13h4v1h-4z" />
              </svg>
            </div>
            <div className="absolute inset-0 h-16 w-16 text-primary animate-ping opacity-20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gradient-blue">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex justify-center">
          <SpinnerLoading size="md" showLabel={false} />
        </div>

        {showProgress && typeof progress === 'number' && (
          <div className="w-full max-w-xs mx-auto">
            <ProgressLoading progress={progress} label="" showPercentage={true} />
          </div>
        )}

        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-brand-purple/10 text-brand-purple">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by Gemini AI
          </Badge>
        </div>
      </div>
    </div>
  );
}
