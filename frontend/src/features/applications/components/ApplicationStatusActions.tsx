import { applicationService } from '@/api/applicationService';
import { Strike } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import type { ApplicationStatus } from '@/api/applicationService';

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Mark Applied',
  applied: 'Move To Interviewing',
  interviewing: 'Move To Offer',
  offer: 'Mark Rejected',
  rejected: 'Archive',
  withdrawn: 'Archive',
  archived: 'Restore To Applied',
};

const NEXT_STATUS: Partial<Record<ApplicationStatus, ApplicationStatus>> = {
  draft: 'applied',
  applied: 'interviewing',
  interviewing: 'offer',
  offer: 'rejected',
  rejected: 'archived',
  withdrawn: 'archived',
  archived: 'applied',
};

export interface ApplicationStatusActionsProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  onStatusChange: (newStatus: ApplicationStatus) => void;
}

export const ApplicationStatusActions = ({
  applicationId,
  currentStatus,
  onStatusChange,
}: ApplicationStatusActionsProps): React.ReactElement => {
  const nextStatus = NEXT_STATUS[currentStatus];

  const updateStatus = useMutation({
    mutationFn: async (status: ApplicationStatus) =>
      applicationService.updateApplication(applicationId, { status }),
    onSuccess: (_, status) => {
      onStatusChange(status);
    },
  });

  return (
    <div className="space-y-3">
      <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-concrete-grey">
        Status actions
      </h4>
      <Strike
        size="sm"
        className="w-full"
        onClick={() => {
          if (nextStatus) {
            updateStatus.mutate(nextStatus);
          }
        }}
        isLoading={updateStatus.isPending}
        disabled={!nextStatus}
      >
        {STATUS_LABELS[currentStatus] ?? 'Update Status'}
      </Strike>
    </div>
  );
};

export default ApplicationStatusActions;
