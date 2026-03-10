import { motion } from 'framer-motion';
import { CheckCircle2, Circle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Placard } from '@/components/ui';
import { useUserStore } from '@/stores/userStore';

const STORAGE_KEY = 'cc_onboarding_checklist';
/** Single key that stores both progress and dismissed flag. */
export const CHECKLIST_DISMISSED_KEY = 'cc_onboarding_checklist_dismissed';
const MILESTONE_PREFIX = 'cc_milestone_';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  route: string;
  ctaLabel: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'upload_resume',
    label: 'Upload your resume',
    description: 'AI extracts and organises your career history automatically.',
    route: '/career/ingest',
    ctaLabel: 'Upload now →',
  },
  {
    id: 'run_ats',
    label: 'Run your first ATS score',
    description: 'Paste any job ad to see how well your resume matches in seconds.',
    route: '/analysis',
    ctaLabel: 'Score resume →',
  },
  {
    id: 'generate_cover_letter',
    label: 'Generate a tailored cover letter',
    description: 'Produce a personalised cover letter from any job URL in under a minute.',
    route: '/cover-letter-generator',
    ctaLabel: 'Write letter →',
  },
  {
    id: 'create_ksc',
    label: 'Create your first KSC response',
    description: 'Nail Key Selection Criteria with guided STAR-method prompts.',
    route: '/ksc-generator',
    ctaLabel: 'Write KSC →',
  },
];

function loadProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    // Keep only boolean values to match Record<string, boolean>
    return Object.fromEntries(
      Object.entries(parsed).filter(([, v]) => typeof v === 'boolean')
    ) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // silently ignore storage errors
  }
}

interface OnboardingChecklistProps {
  /** Called when the user manually dismisses the checklist. */
  onDismiss?: () => void;
}

/**
 * OnboardingChecklist — activation checklist shown on the Dashboard for new users.
 *
 * Tracks completion in localStorage. Hides automatically once all items are done,
 * or when the user explicitly dismisses it.
 *
 * H3 recommendation from docs/analysis/user-journey-analysis.md
 */
export function OnboardingChecklist({ onDismiss }: OnboardingChecklistProps) {
  const [progress, setProgress] = useState<Record<string, boolean>>(loadProgress);
  const [dismissed, setDismissed] = useState(false);
  const { hasCompletedIngestion, hasMaster } = useUserStore();
  const navigate = useNavigate();

  const completedCount = CHECKLIST_ITEMS.filter((item) => progress[item.id]).length;
  const allComplete = completedCount === CHECKLIST_ITEMS.length;

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    const nextProgress: Record<string, boolean> = {
      ...progress,
      upload_resume: hasCompletedIngestion || hasMaster || progress.upload_resume,
    };

    for (const id of ['run_ats', 'generate_cover_letter', 'create_ksc']) {
      if (!nextProgress[id] && localStorage.getItem(`${MILESTONE_PREFIX}${id}`) === 'true') {
        nextProgress[id] = true;
      }
    }

    const changed = Object.keys(nextProgress).some((key) => nextProgress[key] !== progress[key]);
    if (changed) {
      setProgress(nextProgress);
    }
  }, [hasCompletedIngestion, hasMaster, progress]);

  const markComplete = (id: string) => {
    setProgress((prev) => ({ ...prev, [id]: true }));
  };

  const handleCta = (item: ChecklistItem) => {
    markComplete(item.id);
    navigate(item.route);
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.08, type: 'spring' as const, stiffness: 300, damping: 30 },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      <Placard
        elevation="raised"
        className="p-8 md:p-10 border-ink-gold/20 bg-asphalt-black/40 relative overflow-hidden"
      >
        {/* Subtle gold glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-gold/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <p className="font-annotation text-[10px] text-ink-gold uppercase tracking-[0.4em] opacity-70 mb-1">
                [ ACTIVATION.PROTOCOL ]
              </p>
              <h2 className="font-display text-2xl font-black text-paper-white uppercase tracking-tight">
                Get started
              </h2>
              <p className="font-primary text-sm text-concrete-grey opacity-70 mt-1">
                {allComplete
                  ? "All done — you're fully set up! 🎉"
                  : `${completedCount} of ${CHECKLIST_ITEMS.length} complete`}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-concrete-grey/40 hover:text-concrete-grey transition-colors p-1 flex-shrink-0"
              aria-label="Dismiss getting started checklist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / CHECKLIST_ITEMS.length) * 100}%` }}
              transition={{ duration: 0.6, ease: 'circOut' }}
              className="h-full bg-ink-gold"
            />
          </div>

          {/* Checklist items */}
          <ul className="space-y-4">
            {CHECKLIST_ITEMS.map((item, idx) => {
              const done = Boolean(progress[item.id]);
              return (
                <motion.li
                  key={item.id}
                  custom={idx}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  className={`flex items-start gap-4 p-4 rounded-[8px] border transition-all duration-300 ${
                    done
                      ? 'border-ink-gold/10 bg-ink-gold/5 opacity-60'
                      : 'border-concrete-grey/10 bg-transparent hover:border-ink-gold/20 hover:bg-ink-gold/5'
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-ink-gold" />
                    ) : (
                      <Circle className="w-5 h-5 text-concrete-grey/30" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-primary text-sm font-semibold ${done ? 'text-concrete-grey line-through' : 'text-paper-white'}`}
                    >
                      {item.label}
                    </p>
                    {!done && (
                      <p className="font-primary text-xs text-concrete-grey/60 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  {!done && (
                    <button
                      onClick={() => handleCta(item)}
                      className="flex-shrink-0 font-annotation text-[10px] text-ink-gold uppercase tracking-widest hover:text-paper-white transition-colors whitespace-nowrap"
                    >
                      {item.ctaLabel}
                    </button>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </Placard>
    </motion.div>
  );
}

export default OnboardingChecklist;
