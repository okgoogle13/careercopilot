import { applicationService } from '@/api/applicationService';
import { Strike } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';

export interface ApplicationArchiveActionProps {
  applicationId: string;
  isArchived: boolean;
  onArchive: () => void;
  onRestore: () => void;
}

export const ApplicationArchiveAction = ({
  applicationId,
  isArchived,
  onArchive,
  onRestore,
}: ApplicationArchiveActionProps): React.ReactElement => {
  const archiveApplication = useMutation({
    mutationFn: async () =>
      applicationService.updateApplication(applicationId, { status: 'archived' }),
    onSuccess: () => {
      onArchive();
    },
  });

  const restoreApplication = useMutation({
    mutationFn: async () =>
      applicationService.updateApplication(applicationId, { status: 'applied' }),
    onSuccess: () => {
      onRestore();
    },
  });

  const isPending = archiveApplication.isPending || restoreApplication.isPending;

  return (
    <Strike
      variant={isArchived ? 'secondary' : 'destructive'}
      size="sm"
      className="w-full"
      onClick={() => {
        if (isArchived) {
          restoreApplication.mutate();
        } else {
          archiveApplication.mutate();
        }
      }}
      isLoading={isPending}
    >
      {isArchived ? 'Restore Application' : 'Archive Application'}
    </Strike>
  );
};

export default ApplicationArchiveAction;
