import React, { lazy, Suspense } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';

// Simple Error Boundary implementation
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 1 }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Lazy load heavy components for better performance
const LazyKanbanBoard = lazy(() =>
  import('@/components/KanbanBoard').then(module => ({ default: module.KanbanBoard }))
);

const LazyFilterPanel = lazy(() =>
  import('@/components/FilterPanel').then(module => ({ default: module.FilterPanel }))
);

const LazyAccessibilityDemo = lazy(() =>
  import('@/components/AccessibilityDemo').then(module => ({ default: module.AccessibilityDemo }))
);

const LazyUploadResume = lazy(() =>
  import('@/components/UploadResume').then(module => ({ default: module.UploadResume }))
);

// Performance-optimized loading fallback
function ComponentLoadingFallback({ component }: { component: string }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        minHeight: 200,
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={32} sx={{ color: theme.palette.primary.main }} />
        <Stack spacing={0.5} alignItems="center">
          <Typography variant="body2" fontWeight="500">
            Loading {component}...
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Optimizing for performance
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const componentLifetime = endTime - startTime;

      if (componentLifetime > 5000) { // Component was mounted for more than 5 seconds
        console.debug(`[Performance] ${componentName} was active for ${componentLifetime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}

// Optimized component exports with lazy loading and error boundaries
export const KanbanBoard = React.memo((props: any) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoadingFallback component="Kanban Board" />}>
      <LazyKanbanBoard {...props} />
    </Suspense>
  </ErrorBoundary>
));

export const FilterPanel = React.memo((props: any) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoadingFallback component="Filter Panel" />}>
      <LazyFilterPanel {...props} />
    </Suspense>
  </ErrorBoundary>
));

export const AccessibilityDemo = React.memo((props: any) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoadingFallback component="Accessibility Demo" />}>
      <LazyAccessibilityDemo {...props} />
    </Suspense>
  </ErrorBoundary>
));

export const UploadResume = React.memo((props: any) => (
  <ErrorBoundary>
    <Suspense fallback={<ComponentLoadingFallback component="Upload Resume" />}>
      <LazyUploadResume {...props} />
    </Suspense>
  </ErrorBoundary>
));

// Web Vitals monitoring (placeholder for production implementation)
export function reportWebVitals() {
  if (typeof window !== 'undefined') {
    // Placeholder for Web Vitals reporting
    // In production, you would integrate with services like:
    // - Google Analytics 4
    // - DataDog RUM
    // - New Relic Browser
    // - Sentry Performance Monitoring

    try {
      // Simple performance monitoring without external dependencies
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.debug(`[Performance] ${entry.name}: ${entry.duration}ms`);
        }
      });

      perfObserver.observe({ entryTypes: ['navigation', 'paint'] });
    } catch {
      console.debug('[Performance] Performance monitoring not available');
    }
  }
}

// Image optimization component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export const OptimizedImage = React.memo(({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  priority = false
}: OptimizedImageProps) => {
  const theme = useTheme();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Convert image paths to optimized formats
  const getOptimizedSrc = (originalSrc: string) => {
    // For development, return original
    if (process.env.NODE_ENV === 'development') {
      return originalSrc;
    }

    // In production, prefer WebP/AVIF formats
    const ext = originalSrc.split('.').pop()?.toLowerCase();
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
      // Try WebP first, fallback to original
      return originalSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }

    return originalSrc;
  };

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <Box sx={{ position: 'relative', width, height, ...className }}>
      {!isLoaded && !hasError && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: alpha(theme.palette.action.hover, 0.1),
            borderRadius: 1,
            width,
            height,
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 },
            },
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}

      <Box
        component="img"
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          // Fallback to original format
          if (optimizedSrc !== src) {
            const img = new Image();
            img.src = src;
            img.onload = () => setIsLoaded(true);
            img.onerror = () => setHasError(true);
          }
        }}
        sx={{
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 1 : 0,
          display: hasError ? 'none' : 'block',
        }}
      />

      {hasError && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.action.hover, 0.1),
            color: theme.palette.text.secondary,
            width,
            height,
            borderRadius: 1,
          }}
        >
          <Typography variant="caption">Image unavailable</Typography>
        </Box>
      )}
    </Box>
  );
});

OptimizedImage.displayName = 'OptimizedImage';