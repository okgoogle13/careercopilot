/**
 * route-registry.types.ts
 *
 * Type definitions for the canonical route registry.
 * Every route in App.tsx must be declared here.
 */

import type { AppMode } from '../stores/useModeStore';

/** Layout shell that wraps a route. */
export type RouteLayout = 'public' | 'protected' | 'migrated';

/**
 * A single route entry in the canonical registry.
 * Add `screenId` to link a route to its frontend/src/screens/ directory.
 * Add `apiDeps` to list the backend endpoint tag groups this route depends on.
 */
export interface RouteEntry {
  /** URL path pattern (e.g. '/dashboard', '/apply/quick', '*') */
  path: string;
  /** Display name used in analytics and debugging */
  name: string;
  /** Whether this route requires authentication */
  auth: boolean;
  /** Layout shell */
  layout: RouteLayout;
  /** KrDark/KrDark mode for this route */
  mode: AppMode;
  /**
   * Optional: ID of the paired screens/ directory (e.g. '11_dashboard').
   * If set, the CI screen-pair check will verify that
   * frontend/src/screens/{screenId}/ has both a .wireframe.xml and .tsx.
   */
  screenId?: string;
  /**
   * Optional: backend API tag groups this route depends on.
   * Used by the contract-drift check to validate the frontend has
   * corresponding backend support.
   */
  apiDeps?: string[];
  /**
   * Whether this is a prototype/staging route not intended for production.
   * Prototype routes are excluded from the orphan check.
   */
  prototype?: boolean;
}
