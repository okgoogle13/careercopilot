import { AlertCircle, RefreshCw } from 'lucide-react';
import { Pebble } from '../ui';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
  className?: string;
}

export function M3ErrorAlert({
  message,
  onRetry,
  onDismiss,
  retryLabel = 'Retry',
  className = '',
}: ErrorAlertProps) {
  return (
    <div
      className={`
        mb-6 p-4 rounded-pebble
        bg-error-container text-on-error-container
        border border-error
        flex items-start gap-3
        ${className}
      `}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>

      {(onRetry || onDismiss) && (
        <div className="flex gap-2 flex-shrink-0">
          {onRetry && (
            <Pebble
              variant="secondary"
              size="sm"
              iconLeft={<RefreshCw className="w-4 h-4" />}
              onClick={onRetry}
              className="border-error text-on-error-container hover:bg-error/10"
            >
              {retryLabel}
            </Pebble>
          )}

          {onDismiss && (
            <Pebble
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-on-error-container hover:bg-error/10"
            >
              Dismiss
            </Pebble>
          )}
        </div>
      )}
    </div>
  );
}
