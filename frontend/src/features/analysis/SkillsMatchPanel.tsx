import { Shield } from 'lucide-react';
import type { SkillsGap } from '../../services/aiInterface';

interface SkillsMatchPanelProps {
  skillsGap: SkillsGap;
}

interface ChipListProps {
  items: string[];
  variant: 'matched' | 'missing' | 'adjacent';
}

const CHIP_STYLE: Record<ChipListProps['variant'], string> = {
  matched:
    'bg-secondary-container text-on-secondary-container border border-secondary/30',
  missing:
    'bg-error-container text-on-error-container border border-error/30',
  adjacent:
    'bg-tertiary-container text-on-tertiary-container border border-tertiary/30',
};

function ChipList({ items, variant }: ChipListProps) {
  if (items.length === 0) {
    return (
      <p className="text-body-small text-on-surface-variant italic">None identified</p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className={`inline-flex px-3 py-1 rounded-pebble text-label-small font-bold ${CHIP_STYLE[variant]}`}
          data-testid={`chip-${variant}-${i}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/**
 * SkillsMatchPanel
 *
 * Displays the structured skills-gap analysis:
 *   - A match_score gauge (% of required skills already present)
 *   - Three chip-lists: Matched, Missing, and Adjacent skills
 *
 * Follows the same design-token conventions as ChartPane / ImpactEnhancements.
 */
export function SkillsMatchPanel({ skillsGap }: SkillsMatchPanelProps) {
  const { matched, missing, adjacent, match_score } = skillsGap;

  const scoreColor =
    match_score >= 70
      ? 'text-secondary'
      : match_score >= 40
      ? 'text-tertiary'
      : 'text-error';

  const barColor =
    match_score >= 70
      ? 'bg-secondary'
      : match_score >= 40
      ? 'bg-tertiary'
      : 'bg-error';

  return (
    <div
      className="bg-surface-container rounded-tech p-8 border border-outline-variant shadow-elevation-1"
      data-testid="skills-match-panel"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <h2 className="text-title-large font-bold text-on-surface">Skills Match</h2>
      </div>

      {/* Score gauge */}
      <div className="mb-6 bg-surface-container-low rounded-pebble p-5 border border-outline">
        <div className="flex items-center justify-between mb-2">
          <span className="text-label-medium font-bold text-on-surface-variant uppercase tracking-wider">
            Required Skills Match
          </span>
          <span
            className={`text-display-small font-bold ${scoreColor}`}
            data-testid="match-score"
          >
            {match_score}%
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${match_score}%` }}
            role="progressbar"
            aria-valuenow={match_score}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Three skill chip-lists */}
      <div className="space-y-5">
        {/* Matched */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-label-large font-bold text-on-surface">✅ Matched</span>
            <span className="text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-pebble font-mono font-bold">
              {matched.length}
            </span>
          </div>
          <ChipList items={matched} variant="matched" />
        </div>

        {/* Missing */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-label-large font-bold text-on-surface">❌ Missing</span>
            <span className="text-xs bg-error-container text-on-error-container px-2 py-0.5 rounded-pebble font-mono font-bold">
              {missing.length}
            </span>
          </div>
          <ChipList items={missing} variant="missing" />
        </div>

        {/* Adjacent */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-label-large font-bold text-on-surface">🔄 Adjacent</span>
            <span className="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-pebble font-mono font-bold">
              {adjacent.length}
            </span>
          </div>
          <ChipList items={adjacent} variant="adjacent" />
          <p className="text-body-small text-on-surface-variant mt-2">
            Adjacent skills from your resume that are closely related to missing requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
