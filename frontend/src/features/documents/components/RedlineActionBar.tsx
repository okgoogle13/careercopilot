import { Strike } from '../../../components/ui/Strike';

export interface RedlineActionBarProps {
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function RedlineActionBar({ onSubmit, onCancel, isSubmitting }: RedlineActionBarProps) {
  return (
    <div className="flex items-center justify-end gap-3 mt-6">
      <Strike
        variant="ghost"
        size="md"
        onClick={onCancel}
        disabled={isSubmitting}
        type="button"
      >
        Cancel
      </Strike>
      <Strike
        variant="primary"
        size="md"
        onClick={onSubmit}
        isLoading={isSubmitting}
        disabled={isSubmitting}
        type="button"
      >
        Apply Redlines
      </Strike>
    </div>
  );
}
