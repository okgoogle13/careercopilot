import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React, { useState } from 'react';
import { Pebble } from './Pebble';

export type SignalSeverity = 'info' | 'success' | 'warning' | 'error';

export interface SignalProps {
  /** Alert title */
  title?: string;

  /** Severity level */
  severity?: 'info' | 'success' | 'warning' | 'error';

  /** Visual variant */
  variant?: 'filled' | 'outlined' | 'tonal';

  /** Whether alert is dismissible */
  onClose?: () => void;

  /** Actions to show in alert */
  action?: React.ReactNode;

  /** Alert icon (overrides default based on severity) */
  icon?: React.ReactNode;

  /** Alert content */
  children: React.ReactNode;

  /** Additional CSS classes */
  className?: string;

  /** Full width alert */
  fullWidth?: boolean;
}

export type M3AlertSeverity = 'info' | 'success' | 'warning' | 'error';
export type SignalVariant = 'filled' | 'outlined' | 'tonal';

/**
 * Signal - KeralaRage kr-solidarity Alert Component
 *
 * Alert/notification component using Kerala Rage kr-solidarity palette and asymmetric shapes.
 * Supports info, success, warning, and error states with filled, outlined, or tonal variants.
 * Archetype: Signal (status indicator)
 */
export function Signal({
  title,
  severity = 'info',
  variant = 'tonal',
  onClose,
  action,
  icon,
  children,
  className = '',
  fullWidth = true,
}: SignalProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const icons: Record<M3AlertSeverity, React.ComponentType<{ className?: string }>> = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const IconComponent = icon || icons[severity];

  const getStyles = () => {
    const styles: React.CSSProperties = {
      borderRadius: 'var(--radius-stone)',
      transition: 'all var(--duration-standard) var(--ease-viscous-breeze)',
    };

    // Kerala Rage kr-solidarity semantic color mapping
    const semanticColorMap: Record<M3AlertSeverity, { bg: string; text: string; border?: string }> =
      {
        info: {
          bg: 'var(--sys-color-signalGreen-base)',
          text: 'var(--sys-color-charcoalBackground-base)',
          border: 'var(--sys-color-signalGreen-base)',
        },
        success: {
          bg: 'var(--sys-color-kr-activistSmokeGreen-base)',
          text: 'var(--sys-color-charcoalBackground-base)',
          border: 'var(--sys-color-kr-activistSmokeGreen-base)',
        },
        warning: {
          bg: 'var(--sys-color-stencilYellow-base)',
          text: 'var(--sys-color-charcoalBackground-base)',
          border: 'var(--sys-color-stencilYellow-base)',
        },
        error: {
          bg: 'var(--sys-color-kr-charcoalRed-base)',
          text: 'var(--sys-color-worker-ash-base)',
          border: 'var(--sys-color-kr-charcoalRed-base)',
        },
      };

    const colors = semanticColorMap[severity];

    if (variant === 'filled') {
      styles.backgroundColor = colors.bg;
      styles.color = colors.text;
    } else if (variant === 'outlined') {
      styles.border = `1px solid ${colors.border}`;
      styles.color = colors.border;
      styles.backgroundColor = 'transparent';
    } else {
      // tonal - lighter background with semantic color text
      styles.backgroundColor = 'var(--sys-color-charcoalBackground-steps-2)';
      styles.color = colors.bg;
      styles.borderLeft = `4px solid ${colors.bg}`;
    }

    return styles;
  };

  return (
    <div
      style={getStyles()}
      className={`
                relative p-4 flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300
                ${fullWidth ? 'w-full' : 'w-auto'}
                ${className}
            `}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">
        {typeof IconComponent === 'function' ? (
          <IconComponent className="w-5 h-5" />
        ) : (
          IconComponent
        )}
      </div>

      <div className="flex-grow">
        {title && <h4 className="font-bold mb-1 font-bloom">{title}</h4>}
        <div className="font-field-note text-sm leading-relaxed">{children}</div>
      </div>

      {(action || onClose) && (
        <div className="flex-shrink-0 flex items-start gap-2 -mt-1 -mr-1">
          {action}
          {onClose && (
            <Pebble
              variant="ghost"
              size="sm"
              onClick={handleClose}
              aria-label="Close alert"
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Pebble>
          )}
        </div>
      )}
    </div>
  );
}

// Component sub-parts for composition
export const SignalTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="font-bold mb-1 font-bloom">{children}</h4>
);

export const SignalDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="font-field-note text-sm leading-relaxed">{children}</div>
);

// Legacy M3 exports for backward compatibility
export { Signal as M3Alert, SignalDescription as M3AlertDescription, SignalTitle as M3AlertTitle };
export type { SignalProps as M3AlertProps };
