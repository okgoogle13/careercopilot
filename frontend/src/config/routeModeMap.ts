/**
 * Route-to-Mode Mapping Configuration
 *
 * ⚠️  DO NOT EDIT MANUALLY.
 * This map is derived automatically from ROUTE_REGISTRY in route-registry.ts.
 * To change a route's mode, update the `mode` field there.
 */

import { ROUTE_REGISTRY } from './route-registry';
import type { AppMode } from '../stores/useModeStore';

export interface RouteModeConfig {
  path: string;
  mode: AppMode;
  exact?: boolean;
}

/**
 * Route-to-mode mapping derived from ROUTE_REGISTRY.
 * Sorted by path length descending (longest/most specific first).
 */
export const ROUTE_MODE_MAP: RouteModeConfig[] = ROUTE_REGISTRY.map((r) => ({
  path: r.path,
  mode: r.mode,
}));

/**
 * Determine the appropriate mode for a given pathname
 * Uses longest-match-first algorithm to handle nested routes correctly
 *
 * Example:
 * getModeForRoute('/documents/upload') → 'KrDark' (matches /documents)
 * getModeForRoute('/unknown') → 'KrDark' (default fallback)
 *
 * @param pathname - Current route pathname
 * @returns AppMode ('KrDark' | 'KrDark')
 */
export function getModeForRoute(pathname: string): AppMode {
  // Sort routes by path length descending (longest/most specific first)
  const sortedRoutes = [...ROUTE_MODE_MAP].sort((a, b) => b.path.length - a.path.length);

  // Find first matching route
  const matchedRoute = sortedRoutes.find((route) => {
    if (route.exact) {
      // Exact match required
      return pathname === route.path;
    }
    // Prefix match (route path is start of pathname)
    return pathname.startsWith(route.path);
  });

  // Return matched mode or default to KrDark for unknown routes
  return matchedRoute?.mode ?? 'KrDark';
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
  return ROUTE_MODE_MAP.filter((route) => route.mode === mode).map((route) => route.path);
}
