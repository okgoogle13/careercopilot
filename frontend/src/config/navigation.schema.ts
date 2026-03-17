export type NavigationModeAvailability = 'KrDark' | 'both';

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  modeAvailability: NavigationModeAvailability;
}

export const NAVIGATION_SCHEMA: NavigationItem[] = [
  {
    id: 'KrDark-feed',
    label: 'Feed',
    route: '/opportunities',
    modeAvailability: 'KrDark',
  },
  {
    id: 'KrDark-kanban',
    label: 'Kanban',
    route: '/tracker',
    modeAvailability: 'KrDark',
  },
  {
    id: 'KrDark-landing',
    label: 'Landing',
    route: '/',
    modeAvailability: 'KrDark',
  },
  {
    id: 'lab-dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    modeAvailability: 'KrDark',
  },
  {
    id: 'lab-analysis',
    label: 'Analysis',
    route: '/analysis',
    modeAvailability: 'KrDark',
  },
  {
    id: 'KrDark-ingestion',
    label: 'Ingest',
    route: '/career/ingest',
    modeAvailability: 'KrDark',
  },
  {
    id: 'overview',
    label: 'Overview',
    route: '/job-queue',
    modeAvailability: 'both',
  },
];
