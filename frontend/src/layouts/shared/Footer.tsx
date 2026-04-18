import { cn } from '../../lib/utils';

export interface FooterProps {
  className?: string;
  compact?: boolean;
}

/**
 * Canonical shared footer for KR Solidarity shells.
 * Keep unopinionated so route shells can adopt it without redefining chrome ownership.
 */
export function Footer({ className, compact = false }: FooterProps) {
  return (
    <footer
      className={cn(
        'border-t bg-[color-mix(in_srgb,var(--kr-color-charcoal-background-base)_92%,transparent)] text-[var(--kr-color-worker-ash-base)]',
        compact ? 'px-4 py-3' : 'px-6 py-4',
        className
      )}
      style={{ borderColor: 'var(--kr-color-concrete-grey-steps-0)' }}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--kr-color-ink-gold-base)]">
          CareerCopilot Solidarity Shell
        </p>
        <p className="text-sm text-[color-mix(in_srgb,var(--kr-color-worker-ash-base)_82%,transparent)]">
          Route truth lives in runtime. Shared chrome follows the canonical shell.
        </p>
      </div>
    </footer>
  );
}
