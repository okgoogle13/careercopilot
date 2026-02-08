/**
 * Route-to-Mode Mapping Configuration
 *
 * Defines which pages use kr-dark mode (emotional, user-facing)
 * versus kr-dark mode (clinical tools, configuration)
 *
 * kr-dark Mode: Landing, Auth, Onboarding, Opportunities, Dashboard, Kanban
 * kr-dark Mode: Analysis, Ingestion, Documents, Settings, Generation tools
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
  // ============== kr-dark MODE ROUTES ==============
  // Emotional, user-facing experiences

  // Public landing pages
  { path: '/', mode: 'kr-dark' },

  // Authentication flows
  { path: '/login', mode: 'kr-dark' },
  { path: '/register', mode: 'kr-dark' },

  // Onboarding experience
  { path: '/onboarding', mode: 'kr-dark' },

  // Discovery & opportunity viewing
  { path: '/opportunities', mode: 'kr-dark' },

  // Dashboard overview
  { path: '/dashboard', mode: 'kr-dark' },

  // Application tracking (Kanban view)
  { path: '/tracker', mode: 'kr-dark' },

  // Profile viewing (not editing)
  { path: '/profile', mode: 'kr-dark', exact: true },

  // ============== kr-dark MODE ROUTES ==============
  // Clinical tools, analysis, configuration

  // Analysis & insights dashboard
  { path: '/analysis', mode: 'kr-dark' },

  // Data ingestion/import
  { path: '/career/ingest', mode: 'kr-dark' },
  { path: '/ingestion', mode: 'kr-dark' },

  // Document management & editing
  { path: '/documents', mode: 'kr-dark' },

  // Generation tools
  { path: '/ksc-generator', mode: 'kr-dark' },
  { path: '/cover-letter-generator', mode: 'kr-dark' },

  // Asset library (archive vault)
  { path: '/asset-library', mode: 'kr-dark' },

  // Settings & configuration
  { path: '/settings', mode: 'kr-dark' },

  // Job queue & background processing
  { path: '/job-queue', mode: 'kr-dark' },

  // Development & style guide
  { path: '/style-guide', mode: 'kr-dark' },
];

/**
 * Determine the appropriate mode for a given pathname
 * Uses longest-match-first algorithm to handle nested routes correctly
 *
 * Example:
 * getModeForRoute('/documents/upload') → 'kr-dark' (matches /documents)
 * getModeForRoute('/unknown') → 'kr-dark' (default fallback)
 *
 * @param pathname - Current route pathname
 * @returns AppMode ('kr-dark' | 'kr-dark')
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

  // Return matched mode or default to kr-dark for unknown routes
  return matchedRoute?.mode ?? 'kr-dark';
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
