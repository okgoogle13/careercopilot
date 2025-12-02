/**
 * ELECTRIC ALCHEMIST: SKELETON VARIANTS
 *
 * Skeleton loading variants using Electric Alchemist design system.
 * Re-exports skeleton components for backward compatibility.
 */

export {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonButton,
} from './Skeleton';

export { CardSkeleton, ListSkeleton, TableSkeleton, FormSkeleton } from './SkeletonLoader';

// Re-export types
export type { SkeletonProps } from './Skeleton';
export type { SkeletonLoaderProps } from './SkeletonLoader';

