export type NavigationModeAvailability = 'KrDark' | 'both';

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  modeAvailability: NavigationModeAvailability;
}

export const NAVIGATION_SCHEMA: NavigationItem[] = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    modeAvailability: 'KrDark',
  },
  {
    id: 'nav-profile',
    label: 'Profile',
    route: '/profile',
    modeAvailability: 'KrDark',
  },
  {
    id: 'nav-lookout',
    label: 'Opportunities',
    route: '/lookout',
    modeAvailability: 'KrDark',
  },
  {
    id: 'nav-applications',
    label: 'Applications',
    route: '/applications',
    modeAvailability: 'KrDark',
  },
  {
    id: 'nav-analysis',
    label: 'ATS Scoring',
    route: '/analysis',
    modeAvailability: 'KrDark',
  },
  {
    id: 'nav-docs',
    label: 'My Docs',
    route: '/docs',
    modeAvailability: 'KrDark',
  },
];
