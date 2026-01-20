export type NavigationModeAvailability = 'gallery' | 'laboratory' | 'both';

export interface NavigationItem {
    id: string;
    label: string;
    route: string;
    modeAvailability: NavigationModeAvailability;
}

export const NAVIGATION_SCHEMA: NavigationItem[] = [
    {
        id: 'gallery-feed',
        label: 'Feed',
        route: '/gallery/feed',
        modeAvailability: 'gallery',
    },
    {
        id: 'gallery-kanban',
        label: 'Kanban',
        route: '/gallery/kanban',
        modeAvailability: 'gallery',
    },
    {
        id: 'gallery-landing',
        label: 'Landing',
        route: '/gallery',
        modeAvailability: 'gallery',
    },
    {
        id: 'lab-dashboard',
        label: 'Lab',
        route: '/lab',
        modeAvailability: 'laboratory',
    },
    {
        id: 'lab-analysis',
        label: 'Analysis',
        route: '/lab/analysis',
        modeAvailability: 'laboratory',
    },
    {
        id: 'overview',
        label: 'Overview',
        route: '/overview',
        modeAvailability: 'both',
    },
];
