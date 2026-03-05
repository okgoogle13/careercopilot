import { useState, useCallback } from 'react';
import { CareerDatabase } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { validateFiles } from '@/utils/fileValidation';

interface UseCareerIngestionResult {
  submitDocuments: (files: File[]) => Promise<CareerDatabase>;
  updateCareerDatabase: (data: CareerDatabase) => Promise<CareerDatabase>;
  isLoading: boolean;
  error: string | null;
}

export const useCareerIngestion = (): UseCareerIngestionResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const submitDocuments = useCallback(
    async (files: File[]): Promise<CareerDatabase> => {
      const validation = validateFiles(files, ['.pdf', '.docx', '.txt']);
      if (!validation.valid) {
        setError(validation.error!);
        throw new Error(validation.error!);
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create FormData to send files to Python/FastAPI backend
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });

        // Get auth token if available
        const token = session?.access_token || null;
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
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred during ingestion.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  const updateCareerDatabase = useCallback(
    async (data: CareerDatabase): Promise<CareerDatabase> => {
      setIsLoading(true);
      setError(null);

      try {
        // Get auth token if available
        const token = session?.access_token || null;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/v1/career-database', {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: headers,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Update failed: ${errorText || response.statusText}`);
        }

        const responseData = await response.json();
        return responseData as CareerDatabase;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred during update.';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  return {
    submitDocuments,
    updateCareerDatabase,
    isLoading,
    error,
  };
};
