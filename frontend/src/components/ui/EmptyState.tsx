import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-placard border border-dashed border-outline bg-surface-container p-12 text-center ${className}`.trim()}
    >
      <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-march bg-surface-container-high text-outline">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-title-medium font-bold text-on-surface">{title}</h3>
      <p className="mt-2 text-body-medium text-on-surface-variant">{description}</p>
      {ctaLabel && ctaHref && (
        <Link
          to={ctaHref}
          className="mt-5 inline-flex rounded-march bg-primary-container px-5 py-2 text-sm font-bold text-on-primary-container"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
