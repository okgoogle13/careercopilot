export type NavigationModeAvailability = 'KrDark' | 'KrDark' | 'both';

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
        route: '/KrDark/feed',
        modeAvailability: 'KrDark',
    },
    {
        id: 'KrDark-kanban',
        label: 'Kanban',
        route: '/KrDark/kanban',
        modeAvailability: 'KrDark',
    },
    {
        id: 'KrDark-landing',
        label: 'Landing',
        route: '/KrDark',
        modeAvailability: 'KrDark',
    },
    {
        id: 'lab-dashboard',
        label: 'Lab',
        route: '/lab',
        modeAvailability: 'KrDark',
    },
    {
        id: 'lab-analysis',
        label: 'Analysis',
        route: '/lab/analysis',
        modeAvailability: 'KrDark',
    },
    {
        id: 'overview',
        label: 'Overview',
        route: '/overview',
        modeAvailability: 'both',
    },
];
