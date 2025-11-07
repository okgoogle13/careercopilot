import React, { useState } from 'react';
import { Target, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { KanbanBoard } from './kanban/KanbanBoard';
import { AddApplicationModal } from './applications/AddApplicationModal';
import { ApplicationDetailsModal } from './applications/ApplicationDetailsModal';
import { useApplications } from '../hooks/useApplications';
import { CreateApplicationRequest } from '../types/application';
import { AlertCircle } from 'lucide-react';

interface ApplicationsViewProps {
  onAddApplication?: () => void;
}

export function ApplicationsView({ onAddApplication }: ApplicationsViewProps) {
  const {
    applications,
    isLoading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    clearError,
  } = useApplications();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const selectedApplication = selectedApplicationId
    ? applications.find((app) => app.id === selectedApplicationId)
    : undefined;

  const handleAddApplication = async (data: CreateApplicationRequest) => {
    try {
      await createApplication(data);
      setAddModalOpen(false);
    } catch (error) {
      console.error('Failed to create application:', error);
    }
  };

  const handleOpenDetails = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    setSelectedApplicationId(null);
  };

  const handleUpdateApplication = async (updatedData: any) => {
    if (selectedApplicationId) {
      try {
        await updateApplication(selectedApplicationId, {
          notes: updatedData.notes,
        });
      } catch (error) {
        console.error('Failed to update application:', error);
      }
    }
  };

  const handleDeleteApplication = async () => {
    if (selectedApplicationId) {
      try {
        await deleteApplication(selectedApplicationId);
        setDetailsModalOpen(false);
        setSelectedApplicationId(null);
      } catch (error) {
        console.error('Failed to delete application:', error);
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto" style={{ background: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="font-semibold mb-2"
              style={{ color: 'var(--on-surface)', fontSize: '2rem' }}
            >
              Applications
            </h1>
            <p style={{ color: 'var(--on-surface-variant)' }}>
              Track and manage your job applications
            </p>
          </div>
          <Button
            onClick={() => {
              setAddModalOpen(true);
              onAddApplication?.();
            }}
            className="transition-all duration-300"
            style={{
              background: 'var(--primary)',
              color: 'var(--on-primary)',
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Application
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="h-6 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Kanban Board or Empty State */}
        {applications.length > 0 ? (
          <KanbanBoard
            applications={applications}
            onCardClick={handleOpenDetails}
            isLoading={isLoading}
          />
        ) : isLoading ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed"
            style={{
              borderColor: 'rgba(167, 139, 250, 0.3)',
              background: 'rgba(30, 30, 35, 0.4)',
            }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p style={{ color: 'var(--on-surface-variant)' }} className="mt-4">
              Loading applications...
            </p>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed"
            style={{
              borderColor: 'rgba(167, 139, 250, 0.3)',
              background: 'rgba(30, 30, 35, 0.4)',
            }}
          >
            <div
              className="p-6 rounded-full mb-4"
              style={{
                background: 'rgba(167, 139, 250, 0.1)',
              }}
            >
              <Target className="w-12 h-12" style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: 'var(--on-surface)' }}>
              No Applications Yet
            </h3>
            <p style={{ color: 'var(--on-surface-variant)' }} className="mb-4">
              Start tracking your job applications to see them here
            </p>
            <Button
              onClick={() => setAddModalOpen(true)}
              style={{
                background: 'var(--primary)',
                color: 'var(--on-primary)',
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Application
            </Button>
          </div>
        )}
      </div>

      {/* Add Application Modal */}
      <AddApplicationModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onCreateApplication={handleAddApplication}
        existingDocuments={[]} // TODO: Fetch from useDocuments hook
      />

      {/* Application Details Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          open={detailsModalOpen}
          onOpenChange={handleCloseDetails}
          application={selectedApplication}
          onUpdate={handleUpdateApplication}
          onDelete={handleDeleteApplication}
          applicationId={selectedApplicationId || ''}
        />
      )}
    </div>
  );
}
