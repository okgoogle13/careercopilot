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
        'border-t border-[var(--sys-color-outline-variant)] bg-[color-mix(in_srgb,var(--sys-color-charcoalBackground-base)_92%,transparent)] text-[var(--sys-color-worker-ash-base)]',
        compact ? 'px-4 py-3' : 'px-6 py-4',
        className
      )}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--sys-color-inkGold-base)]">
          CareerCopilot Solidarity Shell
        </p>
        <p className="text-sm text-[color-mix(in_srgb,var(--sys-color-worker-ash-base)_82%,transparent)]">
          Route truth lives in runtime. Shared chrome follows the canonical shell.
        </p>
      </div>
    </footer>
  );
}
