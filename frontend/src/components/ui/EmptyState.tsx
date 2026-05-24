import { Link, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Optional CTA button label */
  ctaLabel?: string;
  /** Route to navigate to when CTA is clicked */
  ctaHref?: string;
  /** Callback alternative to ctaHref */
  onCta?: () => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * EmptyState — shared component for empty-data screens (M2 recommendation).
 *
 * Renders an icon, title, description, and optional CTA using design-system-compliant tokens.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  onCta,
  className = '',
}: EmptyStateProps) {
  const navigate = useNavigate();

  const handleCta = () => {
    if (onCta) {
      onCta();
    } else if (ctaHref) {
      navigate(ctaHref);
    }
  };

  return (
    <div
      className={`rounded-placard border border-dashed border-outline bg-surface-container p-12 text-center ${className}`.trim()}
    >
      <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-march bg-surface-container-high text-outline">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-title-medium font-bold text-on-surface">{title}</h3>
      <p className="mt-2 text-body-medium text-on-surface-variant">{description}</p>
      {ctaLabel &&
        (ctaHref || onCta) &&
        (onCta ? (
          <button
            onClick={handleCta}
            className="mt-5 inline-flex cursor-pointer rounded-march bg-primary-container px-5 py-2 text-sm font-bold text-on-primary-container hover:bg-primary-container/80 transition-colors"
          >
            {ctaLabel}
          </button>
        ) : (
          <Link
            to={ctaHref || ''}
            className="mt-5 inline-flex rounded-march bg-primary-container px-5 py-2 text-sm font-bold text-on-primary-container hover:bg-primary-container/80 transition-colors"
          >
            {ctaLabel}
          </Link>
        ))}
    </div>
  );
}
