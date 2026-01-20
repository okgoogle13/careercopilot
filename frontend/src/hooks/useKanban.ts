import { useMemo } from 'react';

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

    const applications = useMemo<ApplicationItem[]>(
        () => [
            {
                id: 'app-1',
                role: 'Product Designer',
                company: 'Northcote Curio',
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

    return { applications, columns };
}
