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
    id: 'nav-jobs',
    label: 'Jobs',
    route: '/opportunities',
    modeAvailability: 'KrDark',
  },
  {
    id: 'nav-applications',
    label: 'Applications',
    route: '/tracker',
    modeAvailability: 'KrDark',
  },
  {
    id: 'nav-analysis',
    label: 'Analysis',
    route: '/analysis',
    modeAvailability: 'KrDark',
  },
  {
    id: 'nav-documents',
    label: 'Documents',
    route: '/documents',
    modeAvailability: 'KrDark',
  },
  {
    id: 'nav-profile',
    label: 'Profile',
    route: '/profile',
    modeAvailability: 'KrDark',
  },
];
