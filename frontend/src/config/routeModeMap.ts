/**
 * Route-to-Mode Mapping Configuration
 *
<<<<<<< HEAD
 * Defines which pages use Gallery mode (emotional, user-facing)
 * versus Laboratory mode (clinical tools, configuration)
 *
 * Gallery Mode: Landing, Auth, Onboarding, Opportunities, Dashboard, Kanban
 * Laboratory Mode: Analysis, Ingestion, Documents, Settings, Generation tools
=======
 * Defines which pages use KrDark mode (emotional, user-facing)
 * versus KrDark mode (clinical tools, configuration)
 *
 * KrDark Mode: Landing, Auth, Onboarding, Opportunities, Dashboard, Kanban
 * KrDark Mode: Analysis, Ingestion, Documents, Settings, Generation tools
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
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
=======
  // ============== KrDark MODE ROUTES ==============
  // Emotional, user-facing experiences

  // Public landing pages
  { path: '/', mode: 'KrDark' },

  // Authentication flows
  { path: '/login', mode: 'KrDark' },
  { path: '/register', mode: 'KrDark' },

  // Onboarding experience
  { path: '/onboarding', mode: 'KrDark' },

  // Discovery & opportunity viewing
  { path: '/opportunities', mode: 'KrDark' },

  // Dashboard overview
  { path: '/dashboard', mode: 'KrDark' },

  // Application tracking (Kanban view)
  { path: '/tracker', mode: 'KrDark' },

  // Profile viewing (not editing)
  { path: '/profile', mode: 'KrDark', exact: true },

  // ============== KrDark MODE ROUTES ==============
  // Clinical tools, analysis, configuration

  // Analysis & insights dashboard
  { path: '/analysis', mode: 'KrDark' },

  // Data ingestion/import
  { path: '/career/ingest', mode: 'KrDark' },
  { path: '/ingestion', mode: 'KrDark' },

  // Document management & editing
  { path: '/documents', mode: 'KrDark' },

  // Generation tools
  { path: '/ksc-generator', mode: 'KrDark' },
  { path: '/cover-letter-generator', mode: 'KrDark' },

  // Asset library (archive vault)
  { path: '/asset-library', mode: 'KrDark' },

  // Settings & configuration
  { path: '/settings', mode: 'KrDark' },

  // Job queue & background processing
  { path: '/job-queue', mode: 'KrDark' },

  // Design sidekick (orchestration tool)
  { path: '/design-sidekick', mode: 'KrDark' },

  // Development & style guide
  { path: '/style-guide', mode: 'KrDark' },
>>>>>>> restoration-KR-Rage-Figma-v2.0
];

/**
 * Determine the appropriate mode for a given pathname
 * Uses longest-match-first algorithm to handle nested routes correctly
 *
 * Example:
<<<<<<< HEAD
 * getModeForRoute('/documents/upload') → 'laboratory' (matches /documents)
 * getModeForRoute('/unknown') → 'laboratory' (default fallback)
 *
 * @param pathname - Current route pathname
 * @returns AppMode ('gallery' | 'laboratory')
=======
 * getModeForRoute('/documents/upload') → 'KrDark' (matches /documents)
 * getModeForRoute('/unknown') → 'KrDark' (default fallback)
 *
 * @param pathname - Current route pathname
 * @returns AppMode ('KrDark' | 'KrDark')
>>>>>>> restoration-KR-Rage-Figma-v2.0
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

<<<<<<< HEAD
  // Return matched mode or default to laboratory for unknown routes
  return matchedRoute?.mode ?? 'laboratory';
=======
  // Return matched mode or default to KrDark for unknown routes
  return matchedRoute?.mode ?? 'KrDark';
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
