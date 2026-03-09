import { AlertCircle, RefreshCw } from 'lucide-react';
import { Strike } from '../ui/Strike';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
  className?: string;
}

export function KrErrorAlert({
  message,
  onRetry,
  onDismiss,
  retryLabel = 'Retry',
  className = '',
}: ErrorAlertProps) {
  return (
    <div
      className={`
        mb-6 p-4
        bg-[var(--sys-color-kr-charcoalRed)] text-[var(--sys-color-paperWhite)]
        flex items-start gap-3 shadow-sm
        ${className}
      `}
      style={{ borderRadius: 'var(--shape-alertShard01)' }}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

      <div className="flex-1">
        <p className="font-body font-medium">{message}</p>
      </div>

      {(onRetry || onDismiss) && (
        <div className="flex gap-2 flex-shrink-0">
          {onRetry && (
            <Strike
              variant="secondary"
              size="sm"
              iconLeft={<RefreshCw className="w-4 h-4" />}
              onClick={onRetry}
              className="bg-[var(--sys-color-charcoalBackground)] border-none text-[var(--sys-color-paperWhite)] hover:bg-[var(--sys-color-kr-charcoalRed)]"
            >
              {retryLabel}
            </Strike>
          )}

          {onDismiss && (
            <Strike
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-[var(--sys-color-paperWhite)] hover:bg-[var(--sys-color-charcoalBackground)] hover:text-[var(--sys-color-paperWhite)] border border-transparent"
            >
              Dismiss
            </Strike>
          )}
        </div>
      )}
    </div>
  );
}
