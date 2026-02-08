import { useEffect, useMemo, useState } from 'react';
import { applicationService, type Application } from '../api/applicationService';

export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export interface ApplicationItem {
    id: string;
    role: string;
    company: string;
    location: string;
    updatedAt: string;
    status: ApplicationStatus;
}

export function useKanban() {
    const columns = useMemo<ApplicationStatus[]>(
        () => ['Applied', 'Interview', 'Offer', 'Rejected'],
        []
    );

    const fallback = useMemo<ApplicationItem[]>(
        () => [
            {
                id: 'app-1',
                role: 'Product Designer',
                company: 'kerala-rage kr-solidarity',
                location: 'Remote',
                updatedAt: '2d ago',
                status: 'Applied',
            },
            {
                id: 'app-2',
                role: 'UX Researcher',
                company: 'Aurora Labs',
                location: 'Melbourne',
                updatedAt: '1d ago',
                status: 'Interview',
            },
            {
                id: 'app-3',
                role: 'Design Systems Lead',
                company: 'Glassleaf Studio',
                location: 'Sydney',
                updatedAt: 'Today',
                status: 'Offer',
            },
        ],
        []
    );

    const [applications, setApplications] = useState<ApplicationItem[]>(fallback);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let active = true;

        const mapStatus = (status: Application['status']): ApplicationStatus => {
            switch (status) {
                case 'interview':
                    return 'Interview';
                case 'offer':
                case 'accepted':
                    return 'Offer';
                case 'rejected':
                    return 'Rejected';
                case 'applied':
                case 'draft':
                case 'archived':
                default:
                    return 'Applied';
            }
        };

        const load = async () => {
            try {
                const data = await applicationService.listApplications();
                if (!active) return;

                const mapped = data.map((app) => ({
                    id: app.id,
                    role: app.jobTitle ?? 'Untitled role',
                    company: app.companyName ?? 'Unknown company',
                    location: app.metadata?.location ?? 'Remote',
                    updatedAt: app.updatedAt ?? app.createdAt ?? 'Recently',
                    status: mapStatus(app.status),
                }));

                setApplications(mapped.length > 0 ? mapped : fallback);
            } catch (err) {
                if (active) {
                    setError(err as Error);
                    setApplications(fallback);
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

    return { applications, columns, isLoading, error };
}
