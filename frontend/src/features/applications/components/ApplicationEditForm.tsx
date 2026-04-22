import { applicationService } from '@/api/applicationService';
import { Strike, ScaffoldInput, ScaffoldArea } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import type { ApplicationEditPayload } from '../trackerTypes';

export interface ApplicationEditFormProps {
  applicationId: string;
  onSave: (data: ApplicationEditPayload) => void;
  initialData?: ApplicationEditPayload;
}

export const ApplicationEditForm = ({
  applicationId,
  onSave,
  initialData,
}: ApplicationEditFormProps): React.ReactElement => {
  const [formState, setFormState] = React.useState<ApplicationEditPayload>({
    jobTitle: initialData?.jobTitle ?? '',
    companyName: initialData?.companyName ?? '',
    jobDescription: initialData?.jobDescription ?? '',
    notes: initialData?.notes ?? '',
  });

  React.useEffect(() => {
    setFormState({
      jobTitle: initialData?.jobTitle ?? '',
      companyName: initialData?.companyName ?? '',
      jobDescription: initialData?.jobDescription ?? '',
      notes: initialData?.notes ?? '',
    });
  }, [initialData]);

  const updateApplication = useMutation({
    mutationFn: async (payload: ApplicationEditPayload) =>
      applicationService.updateApplication(applicationId, payload),
    onSuccess: (_, payload) => {
      onSave(payload);
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        updateApplication.mutate(formState);
      }}
    >
      <ScaffoldInput
        label="Role"
        value={formState.jobTitle ?? ''}
        placeholder="e.g. Senior Case Manager"
        onChange={(event) =>
          setFormState((current) => ({ ...current, jobTitle: event.target.value }))
        }
        fullWidth
      />

      <ScaffoldInput
        label="Company"
        value={formState.companyName ?? ''}
        placeholder="e.g. Community First"
        onChange={(event) =>
          setFormState((current) => ({ ...current, companyName: event.target.value }))
        }
        fullWidth
      />

      <ScaffoldArea
        label="Job description"
        value={formState.jobDescription ?? ''}
        placeholder="Paste the role requirements here..."
        onChange={(event) =>
          setFormState((current) => ({ ...current, jobDescription: event.target.value }))
        }
        fullWidth
        rows={6}
      />

      <ScaffoldArea
        label="Notes"
        value={formState.notes ?? ''}
        placeholder="Reflections on this opportunity..."
        onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
        fullWidth
        rows={4}
      />

      <div className="flex justify-end">
        <Strike
          type="submit"
          size="sm"
          isLoading={updateApplication.isPending}
        >
          Save Changes
        </Strike>
      </div>
    </form>
  );
};

export default ApplicationEditForm;
