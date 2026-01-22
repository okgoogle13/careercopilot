import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { M3IconButton } from './M3Button';

export type M3AlertSeverity = 'success' | 'info' | 'warning' | 'error';
export type SignalVariant = 'filled' | 'outlined' | 'tonal';

export interface SignalProps {
    /** Alert severity/type */
    severity?: M3AlertSeverity;

    /** Visual variant */
    variant?: SignalVariant;

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
 * <Signal severity="success">
 *   Your changes have been saved successfully!
 * </Signal>
 * 
 * <Signal
 *   severity="error"
 *   title="Error"
 *   onClose={() => setError(null)}
 * >
 *   Failed to upload file. Please try again.
 * </Signal>
 * 
 * <Signal severity="warning" variant="outlined">
 *   This action cannot be undone.
 * </Signal>
 * ```
 */
export function M3Alert({
    severity = 'info',
    variant = 'tonal',
    title,
    children,
    onClose,
    className = '',
}: SignalProps) {
    // Icon mapping
    const icons: Record<SignalSeverity, React.ComponentType<{ className?: string }>> = {
        success: CheckCircle,
        info: Info,
        warning: AlertTriangle,
        error: AlertCircle,
    };

    const Icon = icons[severity];

    // Northcote Curio Color Configurations
    const getSeverityStyles = (): React.CSSProperties => {
        const styles: React.CSSProperties = {
            borderRadius: 'var(--radius-pebble)',
            transition: 'all var(--duration-standard) var(--ease-viscous-breeze)',
            border: '2px solid',
        };

        const colorMap: Record<SignalSeverity, string> = {
            success: 'secondary', // Coral
            info: 'primary',    // Sage
            warning: 'warning',  // Gold
            error: 'error',      // Crimson
        };

        const baseColor = colorMap[severity];

        if (variant === 'filled') {
            styles.backgroundColor = `var(--ref-palette-${baseColor}-40)`;
            styles.color = `var(--ref-palette-${baseColor}-100)`;
            styles.borderColor = `var(--ref-palette-${baseColor}-50)`;
        } else if (variant === 'tonal') {
            styles.backgroundColor = `var(--ref-palette-${baseColor}-90)`;
            styles.color = `var(--ref-palette-${baseColor}-10)`;
            styles.borderColor = `var(--ref-palette-${baseColor}-80)`;
        } else { // outlined
            styles.backgroundColor = 'transparent';
            styles.color = 'var(--color-parchment)';
            styles.borderColor = `var(--ref-palette-${baseColor}-40)`;
        }

        return styles;
    };

    return (
        <div
            role="alert"
            style={getSeverityStyles()}
            className={`
        p-4
        flex gap-4
        shadow-elevation-1
        ${className}
      `}
        >
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
                <Icon className="w-6 h-6" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {title && (
                    <h4 className="font-bloom text-xl font-bold mb-1">
                        {title}
                    </h4>
                )}
                <div className="font-field-note text-base leading-relaxed opacity-90">
                    {children}
                </div>
            </div>

            {/* Close Button */}
            {onClose && (
                <div className="flex-shrink-0 -mt-1 -mr-1">
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
 */
export function M3AlertTitle({ children }: { children: React.ReactNode }) {
    return (
        <h4 className="font-bloom text-xl font-bold mb-1">
            {children}
        </h4>
    );
}

/**
 * M3AlertDescription - Semantic description component for alerts
 */
export function M3AlertDescription({ children }: { children: React.ReactNode }) {
    return (
        <div className="font-field-note text-base leading-relaxed opacity-90">
            {children}
        </div>
    );
}
