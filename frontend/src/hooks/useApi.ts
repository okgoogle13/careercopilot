import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Application } from '../services/mockData';

// Query Keys
export const QUERY_KEYS = {
    applications: ['applications'],
    documents: ['documents'],
    userStats: ['userStats'],
    kscResponses: ['kscResponses'],
    analysis: ['analysis'],
    userProfile: ['userProfile'],
    opportunities: ['opportunities'],
};

// Generic Hook (Optional wrapper if needed, but direct useQuery is usually better)
export function useApi<T>(queryKey: string[], queryFn: () => Promise<T>) {
    return useQuery({
        queryKey,
        queryFn
    });
}

// Specific Hooks

export function useApplications() {
    return useQuery({
        queryKey: QUERY_KEYS.applications,
        queryFn: api.getApplications
    });
}

export function useUpdateApplicationStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, step }: { id: number | string, step: number }) => api.updateApplicationStatus(id, step),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications });
        }
    });
}

export function useDocuments() {
    return useQuery({
        queryKey: QUERY_KEYS.documents,
        queryFn: api.getDocuments
    });
}

export function useUserStats() {
    return useQuery({
        queryKey: QUERY_KEYS.userStats,
        queryFn: api.getUserStats
    });
}

export function useKSCResponses() {
    return useQuery({
        queryKey: QUERY_KEYS.kscResponses,
        queryFn: api.getKSCResponses
    });
}

export function useGenerateKSC() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { criteria: string, starData?: { situation: string, task: string, action: string, result: string } }) => api.generateKSCResponse(data.criteria, data.starData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kscResponses });
        }
    });
}

export function useAnalysisData() {
    return useQuery({
        queryKey: QUERY_KEYS.analysis,
        queryFn: api.getAnalysisData
    });
}

export function useUserProfile() {
    return useQuery({
        queryKey: QUERY_KEYS.userProfile,
        queryFn: api.getUserProfile
    });
}

export function useOpportunities() {
    return useQuery({
        queryKey: QUERY_KEYS.opportunities,
        queryFn: api.getOpportunities
    });
}
