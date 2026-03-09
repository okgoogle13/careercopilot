import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
}

/**
 * EmptyState — shared component for empty-data screens (M2 recommendation).
 *
 * Renders an icon, title, description, and optional CTA. Replaces bare-bones
 * "No items found" fallbacks with contextual guidance that explains the purpose
 * of the screen and provides a clear next action.
 *
 * Usage:
 *   <EmptyState
 *     icon={FileText}
 *     title="No documents yet"
 *     description="Your generated documents will appear here."
 *     ctaLabel="Create a cover letter →"
 *     ctaHref="/cover-letter-generator"
 *   />
 */
export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref, onCta }: EmptyStateProps) {
  const navigate = useNavigate();

  const handleCta = () => {
    if (onCta) {
      onCta();
    } else if (ctaHref) {
      navigate(ctaHref);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center rounded-[12px] border border-dashed border-concrete-grey/20 bg-white/[0.01]">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-ink-gold/5 border border-ink-gold/10 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-ink-gold/50" />
      </div>

      {/* Text */}
      <h3 className="font-primary text-base font-semibold text-paper-white mb-2">{title}</h3>
      <p className="font-primary text-sm text-concrete-grey/60 max-w-xs leading-relaxed">
        {description}
      </p>

      {/* CTA */}
      {ctaLabel && (ctaHref || onCta) && (
        <button
          onClick={handleCta}
          className="
            mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-[8px]
            bg-ink-gold/10 border border-ink-gold/20 text-ink-gold
            font-annotation text-[11px] uppercase tracking-widest
            hover:bg-ink-gold/20 transition-colors
          "
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
