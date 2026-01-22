import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { M3IconButton } from './M3Button';

export type M3AlertSeverity = 'success' | 'info' | 'warning' | 'error';
export type M3AlertVariant = 'filled' | 'outlined' | 'tonal';

export interface M3AlertProps {
    /** Alert severity/type */
    severity?: M3AlertSeverity;

    /** Visual variant */
    variant?: M3AlertVariant;

    /** Alert title */
    title?: string;

    /** Alert message */
    children: React.ReactNode;

    /** Show close button */
    onClose?: () => void;

    /** Additional CSS classes */
    className?: string;
}

/**
 * M3Alert - Material Design 3 Compliant Alert Component
 * 
 * Displays important messages with semantic color coding and icons.
 * Features organic M3 shapes and proper accessibility.
 * 
 * **M3 Design Token Usage:**
 * - Shape: `rounded-pebble` (friendly organic)
 * - Colors: M3 semantic color roles (error, warning, info, success→secondary)
 * - Typography: M3 title + body scales
 * - Elevation: Subtle shadow for prominence
 * 
 * **Severity Types:**
 * - `success`: Green/teal - successful operations
 * - `info`: Primary blue/indigo - informational messages
 * - `warning`: Amber - caution/attention needed
 * - `error`: Red - errors/critical issues
 * 
 * **Variants:**
 * - `filled`: Colored background (high emphasis)
 * - `tonal`: Container background (medium emphasis)
 * - `outlined`: Border only (low emphasis)
 * 
 * @example
 * ```tsx
 * <M3Alert severity="success">
 *   Your changes have been saved successfully!
 * </M3Alert>
 * 
 * <M3Alert
 *   severity="error"
 *   title="Error"
 *   onClose={() => setError(null)}
 * >
 *   Failed to upload file. Please try again.
 * </M3Alert>
 * 
 * <M3Alert severity="warning" variant="outlined">
 *   This action cannot be undone.
 * </M3Alert>
 * ```
 */
export function M3Alert({
    severity = 'info',
    variant = 'tonal',
    title,
    children,
    onClose,
    className = '',
}: M3AlertProps) {
    // Icon mapping
    const icons: Record<M3AlertSeverity, React.ComponentType<{ className?: string }>> = {
        success: CheckCircle,
        info: Info,
        warning: AlertTriangle,
        error: AlertCircle,
    };

    const Icon = icons[severity];

    // Color configurations
    const severityConfig: Record<M3AlertSeverity, {
        filled: string;
        tonal: string;
        outlined: string;
        icon: string;
    }> = {
        success: {
            filled: 'bg-secondary text-on-secondary border-secondary',
            tonal: 'bg-secondary-container text-on-secondary-container border-secondary',
            outlined: 'bg-transparent text-on-surface border-secondary',
            icon: 'text-secondary',
        },
        info: {
            filled: 'bg-primary text-on-primary border-primary',
            tonal: 'bg-primary-container text-on-primary-container border-primary',
            outlined: 'bg-transparent text-on-surface border-primary',
            icon: 'text-primary',
        },
        warning: {
            filled: 'bg-warning text-on-warning border-warning',
            tonal: 'bg-warning-container text-on-warning-container border-warning',
            outlined: 'bg-transparent text-on-surface border-warning',
            icon: 'text-warning',
        },
        error: {
            filled: 'bg-error text-on-error border-error',
            tonal: 'bg-error-container text-on-error-container border-error',
            outlined: 'bg-transparent text-on-surface border-error',
            icon: 'text-error',
        },
    };

    const config = severityConfig[severity];
    const colorClasses = config[variant];
    const iconColor = variant === 'outlined' ? config.icon : '';

    return (
        <div
            role="alert"
            className={`
        ${colorClasses}
        rounded-pebble
        border-2
        p-4
        flex gap-3
        shadow-elevation-1
        ${className}
      `}
        >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {title && (
                    <h4
                        className="text-title-large mb-1"
                        style={{
                            fontWeight: 'var(--sys-type-weight-display)',
                            fontVariationSettings: "var(--sys-type-axes-authoritative)",
                        }}
                    >
                        {title}
                    </h4>
                )}
                <div className="text-body-large">
                    {children}
                </div>
            </div>

            {/* Close Button */}
            {onClose && (
                <div className="flex-shrink-0">
                    <M3IconButton
                        icon={<X className="w-4 h-4" />}
                        ariaLabel="Close alert"
                        onClick={onClose}
                        size="small"
                        color={
                            severity === 'success' ? 'secondary' :
                                severity === 'info' ? 'primary' :
                                    severity
                        }
                    />
                </div>
            )}
        </div>
    );
}

/**
 * M3AlertTitle - Semantic title component for alerts
 * 
 * Use when you need more control over alert title styling.
 */
export function M3AlertTitle({ children }: { children: React.ReactNode }) {
    return (
        <h4
            className="text-title-large mb-1"
            style={{
                fontWeight: 'var(--sys-type-weight-display)',
                fontVariationSettings: "var(--sys-type-axes-authoritative)",
            }}
        >
            {children}
        </h4>
    );
}

/**
 * M3AlertDescription - Semantic description component for alerts
 * 
 * Use when you need more control over alert message styling.
 */
export function M3AlertDescription({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-body-large">
            {children}
        </div>
    );
}
