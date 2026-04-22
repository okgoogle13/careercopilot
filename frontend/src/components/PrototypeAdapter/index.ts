/**
 * PrototypeAdapter
 * Centralized export point for all prototype-safe UI components.
 * Prototype features MUST import from this file, not from @/components/ui directly.
 *
 * Only re-exports components that actually exist in this project's ui/ directory.
 */

export * from '@/components/ui/button';
export * from '@/components/ui/KeralaRageButton';
export * from '@/components/ui/Logo';
export * from '@/components/ui/Placard';
export * from '@/components/ui/ScaffoldInput';
export * from '@/components/ui/KrIcon';
export * from '@/components/ui/Separator';
export * from '@/components/ui/EmptyState';
export * from '@/components/ui/metric-card';

/**
 * Prototype-specific utilities
 */
export const PROTOTYPE_BOUNDARY = '__PROTOTYPE_BOUNDARY__';
