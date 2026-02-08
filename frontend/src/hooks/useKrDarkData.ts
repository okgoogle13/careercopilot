import { useEffect, useMemo, useState } from 'react';
import { analyticsService } from '../api/analyticsService';

export type KrDarkFeedItemType = 'opportunity' | 'insight' | 'alert';

export interface KrDarkFeedItem {
    id: string;
    type: KrDarkFeedItemType;
    title: string;
    timestamp: string;
    description: string;
    meta?: {
        company?: string;
        matchScore?: number;
    };
}

export function useKrDarkData() {
    const fallback = useMemo<KrDarkFeedItem[]>(
        () => [
            {
                id: 'feed-1',
                type: 'opportunity',
                title: 'Senior Product Designer',
                timestamp: 'Just now',
                description: 'New role aligned with your portfolio focus. Strong match for design systems.',
                meta: { company: 'KeralaRage Labs', matchScore: 92 },
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

    const [feed, setFeed] = useState<KrDarkFeedItem[]>(fallback);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const stats = await analyticsService.getDashboardStats();
                if (!active) return;

                const items: KrDarkFeedItem[] = [];

                for (const job of stats.topMatchingJobs ?? []) {
                    items.push({
                        id: `match-${job.title}-${job.company}`,
                        type: 'opportunity',
                        title: job.title,
                        timestamp: 'Recently',
                        description: 'Top matching role based on your profile signals.',
                        meta: { company: job.company, matchScore: job.matchScore },
                    });
                }

                for (const app of stats.recentApplications ?? []) {
                    items.push({
                        id: `app-${app.id}`,
                        type: 'insight',
                        title: app.title,
                        timestamp: app.date,
                        description: `Recent application update: ${app.status}`,
                        meta: { company: app.company },
                    });
                }

                setFeed(items.length > 0 ? items : fallback);
            } catch (err) {
                if (active) {
                    setError(err as Error);
                    setFeed(fallback);
                }
            } finally {
                if (active) setIsLoading(false);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [fallback]);

    return { feed, isLoading, error };
}
