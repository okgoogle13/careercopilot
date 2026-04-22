import { applicationService, type ApplicationStatus } from '@/api/applicationService';
import { Megaphone, StatusBadge } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ApplicationArchiveAction } from './ApplicationArchiveAction';
import { ApplicationEditForm } from './ApplicationEditForm';
import { ApplicationStatusActions } from './ApplicationStatusActions';
import {
  mapStatusToTrackerStage,
  toTrackerApplication,
  type ApplicationEditPayload,
} from '../trackerTypes';

export interface ApplicationDetailPanelProps {
  applicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (applicationId: string, newStatus: ApplicationStatus) => void;
  onArchive?: (applicationId: string) => void;
}

export const ApplicationDetailPanel = ({
  applicationId,
  isOpen,
  onClose,
  onStatusChange,
  onArchive,
}: ApplicationDetailPanelProps): React.ReactElement => {
  const [activeTab, setActiveTab] = React.useState<'timeline' | 'notes' | 'details'>('timeline');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: async () => applicationService.getApplication(applicationId),
    enabled: isOpen,
  });

  const application = data ? toTrackerApplication(data) : null;

  return (
    <Megaphone
      open={isOpen}
      onClose={onClose}
      title={application ? application.jobTitle : 'Application details'}
      maxWidth="2xl"
    >
      {isLoading && (
        <p className="font-mono text-sm text-concrete-grey">Loading application details…</p>
      )}
      {error && !isLoading && (
        <div className="space-y-4">
          <p className="font-mono text-sm text-[var(--sys-color-protestMetalBlue-base)]">
            Failed to load application details.
          </p>
          <button
            className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--sys-color-inkGold-base)]"
            onClick={() => {
              void refetch();
            }}
          >
            Retry
          </button>
        </div>
      )}

      {application && !isLoading && !error && (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-primary italic text-sm text-concrete-grey">
                  {application.companyName}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-concrete-grey/70">
                  {application.locationLabel} • {application.appliedLabel}
                </p>
              </div>
              <StatusBadge
                label={application.status.toUpperCase()}
                variant={application.status === 'rejected' ? 'error' : 'success'}
                showDot
              />
            </div>

            <div className="flex gap-2 border-b border-concrete-grey/10 pb-3">
              {(['timeline', 'notes', 'details'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-2 rounded-scaffold ${
                    activeTab === tab
                      ? 'bg-[var(--sys-color-inkGold-base)] text-[var(--sys-color-charcoalBackground-base)]'
                      : 'text-concrete-grey'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-concrete-grey">
                  Status history
                </p>
                <div className="rounded-placard border border-concrete-grey/10 p-4">
                  <p className="text-sm text-paper-white">
                    Current board stage: {mapStatusToTrackerStage(application.status)}
                  </p>
                  <p className="mt-2 text-sm text-concrete-grey">
                    Applied date: {application.appliedLabel}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <ApplicationEditForm
                applicationId={application.id}
                initialData={{
                  jobTitle: application.jobTitle,
                  companyName: application.companyName,
                  jobDescription: application.jobDescription,
                  notes: application.notes,
                }}
                onSave={(_payload: ApplicationEditPayload) => {
                  void refetch();
                }}
              />
            )}

            {activeTab === 'details' && (
              <div className="space-y-4 rounded-placard border border-concrete-grey/10 p-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-concrete-grey">
                    Description
                  </p>
                  <p className="mt-2 text-sm text-paper-white whitespace-pre-wrap">
                    {application.jobDescription}
                  </p>
                </div>
                {application.notes && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-concrete-grey">
                      Notes
                    </p>
                    <p className="mt-2 text-sm text-paper-white whitespace-pre-wrap">
                      {application.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <ApplicationStatusActions
              applicationId={application.id}
              currentStatus={application.status}
              onStatusChange={(newStatus) => {
                onStatusChange?.(application.id, newStatus);
                void refetch();
              }}
            />
            <ApplicationArchiveAction
              applicationId={application.id}
              isArchived={application.status === 'archived'}
              onArchive={() => {
                onArchive?.(application.id);
                void refetch();
              }}
              onRestore={() => {
                onStatusChange?.(application.id, 'applied');
                void refetch();
              }}
            />
          </div>
        </div>
      )}
    </Megaphone>
  );
};

export default ApplicationDetailPanel;
