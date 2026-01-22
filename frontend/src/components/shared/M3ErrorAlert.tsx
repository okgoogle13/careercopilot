import { AlertCircle, RefreshCw } from 'lucide-react';
import { Pebble } from '../ui/M3Button';

interface ErrorAlertProps {
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
    retryLabel?: string;
    className?: string;
}

/**
 * M3ErrorAlert - Material 3 compliant error alert component
 * 
 * **Features:**
 * - M3 color tokens (error-container, on-error-container)
 * - Optional retry button for failed API calls
 * - Optional dismiss functionality
 * - Organic pebble shape (rounded-pebble)
 * 
 * @example
 * ```tsx
 * <M3ErrorAlert 
 *   message="Failed to load data" 
 *   onRetry={() => fetchData()}
 *   retryLabel="Try Again"
 * />
 * ```
 */
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
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<RefreshCw className="w-4 h-4" />}
                            onClick={onRetry}
                            className="border-error text-on-error-container hover:bg-error/10"
                        >
                            {retryLabel}
                        </Pebble>
                    )}

                    {onDismiss && (
                        <Pebble
                            variant="text"
                            color="primary"
                            size="small"
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
