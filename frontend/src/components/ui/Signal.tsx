import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React, { useState } from 'react';
import { Strike } from './Strike';

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

export type SignalVariant = 'filled' | 'outlined' | 'tonal';

/**
 * Signal - KeralaRage kr-solidarity Alert Component
 *
 * Alert/notification component using Kerala Rage kr-solidarity palette and asymmetric shapes.
 * Supports info, success, warning, and error states with filled, outlined, or tonal variants.
 * Archetype: Signal (status indicator)
 */
export function Signal(props: SignalProps) {
  const {
    title,
    severity = 'info',
    variant = 'tonal',
    onClose,
    action,
    icon,
    children,
    className = '',
    fullWidth = true,
  } = props;

  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const icons: Record<SignalSeverity, any> = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const IconComponent = icon || icons[severity];

  const getStyles = () => {
    const styles: React.CSSProperties = {
      borderRadius: 'var(--shape-megaphoneCut01, 42% 58% 45% 55% / 48% 62% 38% 52%)',
      transition: 'all var(--duration-standard) var(--ease-viscous-breeze)',
    };

    // Kerala Rage kr-solidarity semantic color mapping
    const semanticColorMap: Record<SignalSeverity, { bg: string; text: string; border?: string }> =
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

    const colors = semanticColorMap[severity] || semanticColorMap.info;

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

  const renderIcon = () => {
    if (!IconComponent) return null;

    // If it's a function or an object that looks like a component (forwardRef, etc)
    if (
      typeof IconComponent === 'function' ||
      (typeof IconComponent === 'object' && IconComponent !== null && '$$typeof' in IconComponent)
    ) {
      try {
        const Component = IconComponent as React.ComponentType<any>;
        return <Component className="w-5 h-5" />;
      } catch (e) {
        return null;
      }
    }

    // Default to rendering as a node
    return IconComponent;
  };

  return (
    <div
      style={getStyles()}
      className={`
                relative p-4 flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300
                ${fullWidth ? 'w-full' : 'w-auto'}
                ${className}
            `}
      role="status"
      aria-live="polite"
    >
      <div className="flex-shrink-0 mt-0.5">{renderIcon()}</div>

      <div className="flex-grow">
        {title && typeof title === 'string' && (
          <h4 className="font-bold mb-1 font-bloom">{title}</h4>
        )}
        <div className="font-field-note text-sm leading-relaxed">
          {typeof children === 'object' && children !== null && !React.isValidElement(children)
            ? 'Invalid child node'
            : children}
        </div>
      </div>

      {(action || onClose) && (
        <div className="flex-shrink-0 flex items-start gap-2 -mt-1 -mr-1">
          {action}
          {onClose && (
            <Strike
              variant="ghost"
              size="sm"
              onClick={handleClose}
              aria-label="Close alert"
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Strike>
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
