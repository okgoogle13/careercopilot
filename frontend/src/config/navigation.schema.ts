<<<<<<< HEAD
export type NavigationModeAvailability = 'gallery' | 'laboratory' | 'both';
=======
export type NavigationModeAvailability = 'KrDark' | 'KrDark' | 'both';
>>>>>>> restoration-KR-Rage-Figma-v2.0

export interface NavigationItem {
    id: string;
    label: string;
    route: string;
    modeAvailability: NavigationModeAvailability;
}

export const NAVIGATION_SCHEMA: NavigationItem[] = [
    {
<<<<<<< HEAD
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
=======
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
>>>>>>> restoration-KR-Rage-Figma-v2.0
    },
    {
        id: 'lab-dashboard',
        label: 'Lab',
        route: '/lab',
<<<<<<< HEAD
        modeAvailability: 'laboratory',
=======
        modeAvailability: 'KrDark',
>>>>>>> restoration-KR-Rage-Figma-v2.0
    },
    {
        id: 'lab-analysis',
        label: 'Analysis',
        route: '/lab/analysis',
<<<<<<< HEAD
        modeAvailability: 'laboratory',
=======
        modeAvailability: 'KrDark',
>>>>>>> restoration-KR-Rage-Figma-v2.0
    },
    {
        id: 'overview',
        label: 'Overview',
        route: '/overview',
        modeAvailability: 'both',
    },
];
