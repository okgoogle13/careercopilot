/**
 * Route-to-Mode Mapping Configuration
 *
 * Defines which pages use Gallery mode (emotional, user-facing)
 * versus Laboratory mode (clinical tools, configuration)
 *
 * Gallery Mode: Landing, Auth, Onboarding, Opportunities, Dashboard, Kanban
 * Laboratory Mode: Analysis, Ingestion, Documents, Settings, Generation tools
 */

import type { AppMode } from '../stores/useModeStore';

export interface RouteModeConfig {
  path: string;
  mode: AppMode;
  exact?: boolean; // For exact path matching (future enhancement)
}

/**
 * Complete route-to-mode mapping
 * Sorted by specificity (longest paths first) for matching algorithm
 */
export const ROUTE_MODE_MAP: RouteModeConfig[] = [
  // ============== GALLERY MODE ROUTES ==============
  // Emotional, user-facing experiences

  // Public landing pages
  { path: '/', mode: 'gallery' },

  // Authentication flows
  { path: '/login', mode: 'gallery' },
  { path: '/register', mode: 'gallery' },

  // Onboarding experience
  { path: '/onboarding', mode: 'gallery' },

  // Discovery & opportunity viewing
  { path: '/opportunities', mode: 'gallery' },

  // Dashboard overview
  { path: '/dashboard', mode: 'gallery' },

  // Application tracking (Kanban view)
  { path: '/tracker', mode: 'gallery' },

  // Profile viewing (not editing)
  { path: '/profile', mode: 'gallery', exact: true },

  // ============== LABORATORY MODE ROUTES ==============
  // Clinical tools, analysis, configuration

  // Analysis & insights dashboard
  { path: '/analysis', mode: 'laboratory' },

  // Data ingestion/import
  { path: '/career/ingest', mode: 'laboratory' },
  { path: '/ingestion', mode: 'laboratory' },

  // Document management & editing
  { path: '/documents', mode: 'laboratory' },

  // Generation tools
  { path: '/ksc-generator', mode: 'laboratory' },
  { path: '/cover-letter-generator', mode: 'laboratory' },

  // Asset library (archive vault)
  { path: '/asset-library', mode: 'laboratory' },

  // Settings & configuration
  { path: '/settings', mode: 'laboratory' },

  // Job queue & background processing
  { path: '/job-queue', mode: 'laboratory' },

  // Development & style guide
  { path: '/style-guide', mode: 'laboratory' },
];

/**
 * Determine the appropriate mode for a given pathname
 * Uses longest-match-first algorithm to handle nested routes correctly
 *
 * Example:
 * getModeForRoute('/documents/upload') → 'laboratory' (matches /documents)
 * getModeForRoute('/unknown') → 'laboratory' (default fallback)
 *
 * @param pathname - Current route pathname
 * @returns AppMode ('gallery' | 'laboratory')
 */
export function getModeForRoute(pathname: string): AppMode {
  // Sort routes by path length descending (longest/most specific first)
  const sortedRoutes = [...ROUTE_MODE_MAP].sort(
    (a, b) => b.path.length - a.path.length
  );

  // Find first matching route
  const matchedRoute = sortedRoutes.find((route) => {
    if (route.exact) {
      // Exact match required
      return pathname === route.path;
    }
    // Prefix match (route path is start of pathname)
    return pathname.startsWith(route.path);
  });

  // Return matched mode or default to laboratory for unknown routes
  return matchedRoute?.mode ?? 'laboratory';
}

/**
 * Check if a route should have automatic mode switching enabled
 * Can be extended to exclude specific routes from auto-switching
 *
 * @param pathname - Current route pathname
 * @returns boolean - Whether auto-switching should apply
 */
export function shouldAutoSwitchMode(pathname: string): boolean {
  // List of routes that should NOT trigger auto-switching
  // (can be extended as needed)
  const excludedPaths: string[] = [
    // Future: Add paths like '/admin/*' if manual control needed
  ];

  // Return true if pathname is NOT in excluded list
  return !excludedPaths.some((excluded) => pathname.startsWith(excluded));
}

/**
 * Helper to get all routes for a specific mode
 * Useful for testing and documentation
 *
 * @param mode - Mode to filter routes by
 * @returns Array of route paths for the given mode
 */
export function getRoutesForMode(mode: AppMode): string[] {
  return ROUTE_MODE_MAP.filter((route) => route.mode === mode).map(
    (route) => route.path
  );
}
