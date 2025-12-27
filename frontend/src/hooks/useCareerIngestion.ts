import { useState, useCallback } from 'react';
import { CareerDatabase } from '../types/api';
import { useAuth } from '../context/AuthContext';

interface UseCareerIngestionResult {
    submitDocuments: (files: File[]) => Promise<CareerDatabase>;
    isLoading: boolean;
    error: string | null;
}

export const useCareerIngestion = (): UseCareerIngestionResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const submitDocuments = useCallback(async (files: File[]): Promise<CareerDatabase> => {
        setIsLoading(true);
        setError(null);

        try {
            // Create FormData to send files to Python/FastAPI backend
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            // Get auth token if available
            const token = user?.getIdToken ? await user.getIdToken() : null;
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // Call backend ingestion endpoint
            const response = await fetch('/api/v1/ingest', {
                method: 'POST',
                body: formData,
                headers: headers,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ingestion failed: ${errorText || response.statusText}`);
            }

            const data = await response.json();
            return data as CareerDatabase;

        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred during ingestion.';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    return {
        submitDocuments,
        isLoading,
        error,
    };
};
