import { applicationService } from '@/api/applicationService';
import { Strike } from '@/components/ui';
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
      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-concrete-grey">
          Role
        </span>
        <input
          className="w-full rounded-scaffold bg-[var(--sys-color-charcoalBackground-steps-1)] border border-[var(--sys-color-concreteGrey-steps-1)] px-3 py-2 text-sm text-paper-white"
          value={formState.jobTitle ?? ''}
          onChange={(event) =>
            setFormState((current) => ({ ...current, jobTitle: event.target.value }))
          }
        />
      </label>

      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-concrete-grey">
          Company
        </span>
        <input
          className="w-full rounded-scaffold bg-[var(--sys-color-charcoalBackground-steps-1)] border border-[var(--sys-color-concreteGrey-steps-1)] px-3 py-2 text-sm text-paper-white"
          value={formState.companyName ?? ''}
          onChange={(event) =>
            setFormState((current) => ({ ...current, companyName: event.target.value }))
          }
        />
      </label>

      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-concrete-grey">
          Job description
        </span>
        <textarea
          className="w-full min-h-28 rounded-scaffold bg-[var(--sys-color-charcoalBackground-steps-1)] border border-[var(--sys-color-concreteGrey-steps-1)] px-3 py-2 text-sm text-paper-white"
          value={formState.jobDescription ?? ''}
          onChange={(event) =>
            setFormState((current) => ({ ...current, jobDescription: event.target.value }))
          }
        />
      </label>

      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-concrete-grey">
          Notes
        </span>
        <textarea
          className="w-full min-h-24 rounded-scaffold bg-[var(--sys-color-charcoalBackground-steps-1)] border border-[var(--sys-color-concreteGrey-steps-1)] px-3 py-2 text-sm text-paper-white"
          value={formState.notes ?? ''}
          onChange={(event) =>
            setFormState((current) => ({ ...current, notes: event.target.value }))
          }
        />
      </label>

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
