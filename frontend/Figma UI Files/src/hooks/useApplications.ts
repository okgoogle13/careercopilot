import { useState, useEffect, useCallback } from 'react';
import {
  Application,
  ApplicationStats,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from '../types/application';
import * as applicationService from '../api/applicationService';

interface UseApplicationsReturn {
  // State
  applications: Application[];
  selectedApplication: Application | null;
  stats: ApplicationStats;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchApplications: () => Promise<void>;
  fetchApplicationById: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  createApplication: (request: CreateApplicationRequest) => Promise<Application>;
  updateApplication: (id: string, request: UpdateApplicationRequest) => Promise<Application>;
  deleteApplication: (id: string) => Promise<void>;
  addTimelineEvent: (
    applicationId: string,
    event: {
      event: string;
      type: 'applied' | 'interview' | 'followup' | 'offer' | 'rejection' | 'note';
      date?: string;
    }
  ) => Promise<Application>;
  attachDocument: (applicationId: string, documentId: string) => Promise<Application>;
  detachDocument: (applicationId: string, documentId: string) => Promise<Application>;
  clearError: () => void;
  clearSelection: () => void;
}

/**
 * Custom hook for managing applications
 * Handles API calls and local state management
 */
export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    applied: 0,
    interviewing: 0,
    offer: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all applications
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch applications';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch single application by ID
  const fetchApplicationById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await applicationService.getApplication(id);
      setSelectedApplication(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch application';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const data = await applicationService.getApplicationStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Don't show error for stats fetch failure
    }
  }, []);

  // Create application
  const createApplication = useCallback(
    async (request: CreateApplicationRequest): Promise<Application> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await applicationService.createApplication(request);
        setApplications((prev) => [response.application, ...prev]);
        await fetchStats(); // Update stats
        return response.application;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create application';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchStats]
  );

  // Update application
  const updateApplication = useCallback(
    async (id: string, request: UpdateApplicationRequest): Promise<Application> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await applicationService.updateApplication(id, request);
        setApplications((prev) => prev.map((app) => (app.id === id ? updated : app)));
        if (selectedApplication?.id === id) {
          setSelectedApplication(updated);
        }
        await fetchStats(); // Update stats
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update application';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedApplication?.id, fetchStats]
  );

  // Delete application
  const deleteApplication = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        await applicationService.deleteApplication(id);
        setApplications((prev) => prev.filter((app) => app.id !== id));
        if (selectedApplication?.id === id) {
          setSelectedApplication(null);
        }
        await fetchStats(); // Update stats
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete application';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedApplication?.id, fetchStats]
  );

  // Add timeline event
  const addTimelineEvent = useCallback(
    async (
      applicationId: string,
      event: {
        event: string;
        type: 'applied' | 'interview' | 'followup' | 'offer' | 'rejection' | 'note';
        date?: string;
      }
    ): Promise<Application> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await applicationService.addTimelineEvent(applicationId, event);
        setApplications((prev) => prev.map((app) => (app.id === applicationId ? updated : app)));
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication(updated);
        }
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add timeline event';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedApplication?.id]
  );

  // Attach document
  const attachDocument = useCallback(
    async (applicationId: string, documentId: string): Promise<Application> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await applicationService.attachDocumentToApplication(
          applicationId,
          documentId
        );
        setApplications((prev) => prev.map((app) => (app.id === applicationId ? updated : app)));
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication(updated);
        }
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to attach document';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedApplication?.id]
  );

  // Detach document
  const detachDocument = useCallback(
    async (applicationId: string, documentId: string): Promise<Application> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await applicationService.detachDocumentFromApplication(
          applicationId,
          documentId
        );
        setApplications((prev) => prev.map((app) => (app.id === applicationId ? updated : app)));
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication(updated);
        }
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to detach document';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [selectedApplication?.id]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedApplication(null);
  }, []);

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [fetchApplications, fetchStats]);

  return {
    applications,
    selectedApplication,
    stats,
    isLoading,
    error,
    fetchApplications,
    fetchApplicationById,
    fetchStats,
    createApplication,
    updateApplication,
    deleteApplication,
    addTimelineEvent,
    attachDocument,
    detachDocument,
    clearError,
    clearSelection,
  };
}
