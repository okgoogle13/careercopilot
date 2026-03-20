/**
 * route-registry.ts — Phase 2.2
 *
 * The single canonical source of truth for all routes in the application.
 *
 * Rules:
 *   1. Every route reachable from App.tsx MUST have an entry here.
 *   2. App.tsx and routeModeMap.ts MUST derive from this registry — no manual duplication.
 *   3. If a route has a paired screens/ directory, set screenId.
 *   4. Prototype routes (e.g. /kr/*) must be flagged with `prototype: true`.
 *   5. Production routes must source from features/, not components/ or pages/.
 *
 * CI enforcement:
 *   - tools/ci/check-route-integrity.ts validates every entry here.
 *   - tools/ci/check-screen-pairs.ts validates screenId references.
 */

import type { RouteEntry } from './route-registry.types';

export const ROUTE_REGISTRY: RouteEntry[] = [
  // ── Public Routes ──────────────────────────────────────────────
  {
    path: '/',
    name: 'Landing',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    screenId: '01_landing',
    apiDeps: [],
  },
  {
    path: '/login',
    name: 'Login',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    screenId: '02_auth',
    apiDeps: ['authService'],
  },
  {
    path: '/register',
    name: 'Register',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    screenId: '02_auth',
    apiDeps: ['authService'],
  },
  {
    path: '/auth',
    name: 'Auth Redirect',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    isRedirect: true,
    apiDeps: ['authService'],
  },
  {
    path: '/design-sidekick',
    name: 'Design Sidekick',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
  },
  {
    path: '/style-guide',
    name: 'Style Guide',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
  },

  // ── Prototype Routes (/kr/*) — staging only, not production ────
  {
    path: '/kr/landing',
    name: '[Proto] Hero Landing',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    prototype: true,
  },
  {
    path: '/kr/auth',
    name: '[Proto] Auth Modal',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    prototype: true,
  },
  {
    path: '/kr/onboarding',
    name: '[Proto] Onboard Flow',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    prototype: true,
  },
  {
    path: '/kr/analysis',
    name: '[Proto] Analysis Workbench',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    prototype: true,
  },
  {
    path: '/kr/dashboard',
    name: '[Proto] Dashboard Overview',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    prototype: true,
  },

  // ── Migrated Routes (new shell, no legacy sidebar) ──────────────
  {
    path: '/tracker',
    name: 'Application Tracker',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    screenId: '07_kanban',
    apiDeps: ['applicationService'],
  },
  {
    path: '/dashboard-overview',
    name: 'Dashboard Redirect',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    isRedirect: true,
    apiDeps: ['analysisService', 'applicationService'],
  },
  {
    path: '/kanban',
    name: 'Tracker Redirect',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    isRedirect: true,
    apiDeps: ['applicationService'],
  },
  {
    path: '/ingestion',
    name: 'Ingestion Redirect',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    isRedirect: true,
    apiDeps: ['ingestion.service', 'smartIngestionService'],
  },
  {
    path: '/feed',
    name: 'Opportunities Redirect',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    isRedirect: true,
    apiDeps: ['jobService'],
  },
  {
    path: '/studio',
    name: 'KSC Redirect',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    isRedirect: true,
    apiDeps: ['aiServices', 'workflowService'],
  },

  // ── Production Routes ────────────────────────────────────────────
  {
    path: '/dashboard',
    name: 'Dashboard',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    screenId: '11_dashboard',
    apiDeps: ['analysisService', 'applicationService'],
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    screenId: '03_onboarding',
    apiDeps: ['profileService'],
  },
  {
    path: '/welcome',
    name: 'Welcome',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    apiDeps: [],
  },
  {
    path: '/documents',
    name: 'Documents',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    apiDeps: ['documentService'],
  },
  {
    path: '/analysis',
    name: 'Analysis',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    screenId: '05_analysis',
    apiDeps: ['analysisService', 'aiServices'],
  },
  {
    path: '/opportunities',
    name: 'Opportunities',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    screenId: '06_lookout',
    apiDeps: ['jobService'],
  },
  {
    path: '/ksc-generator',
    name: 'KSC Generator',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    screenId: '08_workbench',
    apiDeps: ['aiServices', 'workflowService'],
  },
  {
    path: '/cover-letter-generator',
    name: 'Cover Letter Generator',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    screenId: '09_finalization',
    apiDeps: ['aiServices', 'workflowService'],
  },
  {
    path: '/settings',
    name: 'Settings',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    screenId: '10_settings',
    apiDeps: ['profileService', 'settingsService'],
  },
  {
    path: '/profile',
    name: 'Profile',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    apiDeps: ['profileService'],
  },
  {
    path: '/asset-library',
    name: 'Asset Library',
    auth: true,
    layout: 'protected',
    mode: 'KrDark',
    apiDeps: ['documentService', 'analysisService'],
  },
  {
    path: '/career/ingest',
    name: 'Career Ingestion',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    screenId: '04_ingestion',
    apiDeps: ['ingestion.service', 'smartIngestionService'],
  },
  {
    path: '/job-queue',
    name: 'Job Queue',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    apiDeps: ['jobService', 'aiServices'],
  },
  {
    path: '/apply/quick',
    name: 'Quick Apply',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    apiDeps: ['applicationService', 'aiServices'],
  },
  {
    path: '/editor',
    name: 'Documents Redirect',
    auth: true,
    layout: 'migrated',
    mode: 'KrDark',
    isRedirect: true,
    apiDeps: ['documentService'],
  },
  {
    path: '/test-tokens',
    name: '[Dev] Token Test',
    auth: true,
    layout: 'protected',
    mode: 'KrDark',
    apiDeps: [],
    prototype: true,
  },

  // ── Harvested Prototype Routes (/prototype/*) ────────────────────
  {
    path: '/prototype',
    name: '[Proto] Prototype Index',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
    prototype: true,
  },
  {
    path: '/prototype/apply-quick',
    name: '[Proto] Apply Quick Workspace',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
    prototype: true,
  },
  {
    path: '/prototype/library',
    name: '[Proto] Library Reference',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
    prototype: true,
  },
  {
    path: '/prototype/past-applications',
    name: '[Proto] Past Applications',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
    prototype: true,
  },
  {
    path: '/prototype/profile',
    name: '[Proto] Profile View',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
    prototype: true,
  },
  {
    path: '/prototype/image-studio',
    name: '[Proto] Image Studio',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
    prototype: true,
  },
  {
    path: '/prototype/resume',
    name: '[Proto] Tailored Resume View',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
    prototype: true,
  },
  {
    path: '/prototype/cover-letter',
    name: '[Proto] Cover Letter Metrics',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
    prototype: true,
  },

  // ── Fallback ────────────────────────────────────────────────────
  {
    path: '*',
    name: 'Not Found',
    auth: false,
    layout: 'public',
    mode: 'KrDark',
    apiDeps: [],
  },
];

// ── Derived lookups ─────────────────────────────────────────────
/** All routes by path for O(1) lookup */
export const ROUTE_BY_PATH = new Map(ROUTE_REGISTRY.map((r) => [r.path, r]));

/** Production routes only (no prototypes) */
export const PRODUCTION_ROUTES = ROUTE_REGISTRY.filter((r) => !r.prototype);

/** All unique screenIds that are referenced by routes */
export const ROUTED_SCREEN_IDS = new Set(
  ROUTE_REGISTRY.map((r) => r.screenId).filter(Boolean) as string[]
);
