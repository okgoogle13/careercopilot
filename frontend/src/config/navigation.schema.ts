export type NavigationModeAvailability = 'kr-dark' | 'kr-dark' | 'both';

export interface NavigationItem {
    id: string;
    label: string;
    route: string;
    modeAvailability: NavigationModeAvailability;
}

export const NAVIGATION_SCHEMA: NavigationItem[] = [
    {
        id: 'kr-dark-feed',
        label: 'Feed',
        route: '/kr-dark/feed',
        modeAvailability: 'kr-dark',
    },
    {
        id: 'kr-dark-kanban',
        label: 'Kanban',
        route: '/kr-dark/kanban',
        modeAvailability: 'kr-dark',
    },
    {
        id: 'kr-dark-landing',
        label: 'Landing',
        route: '/kr-dark',
        modeAvailability: 'kr-dark',
    },
    {
        id: 'lab-dashboard',
        label: 'Lab',
        route: '/lab',
        modeAvailability: 'kr-dark',
    },
    {
        id: 'lab-analysis',
        label: 'Analysis',
        route: '/lab/analysis',
        modeAvailability: 'kr-dark',
    },
    {
        id: 'overview',
        label: 'Overview',
        route: '/overview',
        modeAvailability: 'both',
    },
];
