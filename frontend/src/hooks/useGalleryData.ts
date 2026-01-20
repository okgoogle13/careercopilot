import { useMemo } from 'react';

export type GalleryFeedItemType = 'opportunity' | 'insight' | 'alert';

export interface GalleryFeedItem {
    id: string;
    type: GalleryFeedItemType;
    title: string;
    timestamp: string;
    description: string;
    meta?: {
        company?: string;
        matchScore?: number;
    };
}

export function useGalleryData() {
    const feed = useMemo<GalleryFeedItem[]>(
        () => [
            {
                id: 'feed-1',
                type: 'opportunity',
                title: 'Senior Product Designer',
                timestamp: 'Just now',
                description: 'New role aligned with your portfolio focus. Strong match for design systems.',
                meta: { company: 'Northcote Labs', matchScore: 92 },
            },
            {
                id: 'feed-2',
                type: 'insight',
                title: 'Portfolio signal improvement',
                timestamp: '12 min ago',
                description: 'Your system coverage increased by 8% after the last component update.',
                meta: { matchScore: 88 },
            },
            {
                id: 'feed-3',
                type: 'alert',
                title: 'ATS keyword drift',
                timestamp: '1 hr ago',
                description: 'Three of your core keywords were removed from the latest resume draft.',
            },
        ],
        []
    );

    return { feed, isLoading: false };
}
