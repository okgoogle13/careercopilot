import { CheckCircle2, Circle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Placard } from '@/components/ui';
import { useUserStore } from '@/stores/userStore';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

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
    route: '/profile',
    ctaLabel: 'Upload now →',
  },
  {
    id: 'run_ats',
    label: 'Run your first ATS check',
    description: 'See how well your resume matches a target role with real feedback.',
    route: '/analysis',
    ctaLabel: 'Run check →',
  },
  {
    id: 'generate_cover_letter',
    label: 'Generate a tailored cover letter',
    description: 'Produce a personalised cover letter from any job URL in under a minute.',
    route: '/generation',
    ctaLabel: 'Write letter →',
  },
  {
    id: 'create_ksc',
    label: 'Create your first KSC response',
    description: 'Nail Key Selection Criteria with guided STAR-method prompts.',
    route: '/generation',
    ctaLabel: 'Write KSC →',
  },
];

function loadProgress(): Record<string, boolean> {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val) {
      return JSON.parse(val) as Record<string, boolean>;
    }
  } catch {
    // ignore
  }
  return {
    upload_resume: false,
    run_ats: false,
    generate_cover_letter: false,
    create_ksc: false,
  };
}

function saveProgress(prog: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
  } catch {
    // ignore
  }
}

interface OnboardingChecklistProps {
  onDismiss: () => void;
}

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
    // Navigate to target route
    navigate(item.route);
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={KrDarkSpring}
    >
      <Placard
        elevation="raised"
        className="p-6 md:p-8 bg-asphalt-black/45 border-ink-gold/25 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-ink-gold/[0.03] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-mono text-[9px] text-ink-gold uppercase tracking-[0.3em]">
                System Ingest Activation
              </p>
              <h2 className="font-display text-2xl font-bold text-paper-white uppercase tracking-tight mt-1">
                Your Guided Path
              </h2>
              <p className="font-primary text-sm text-concrete-grey opacity-70 mt-1">
                {allComplete
                  ? "All done — you're fully set up! 🎉"
                  : `${completedCount} of ${CHECKLIST_ITEMS.length} complete`}
              </p>
            </div>
            <button
              onClick={onDismiss}
              className="text-concrete-grey/40 hover:text-ink-gold transition-colors"
              aria-label="Dismiss checklist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full bg-white/5 rounded-march overflow-hidden mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / CHECKLIST_ITEMS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-ink-gold shadow-glow-gold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHECKLIST_ITEMS.map((item) => {
              const isDone = progress[item.id];
              return (
                <div
                  key={item.id}
                  className={`flex gap-4 p-4 rounded-placard border transition-all duration-300 ${
                    isDone
                      ? 'border-concrete-grey/10 bg-asphalt-black/20 opacity-60'
                      : 'border-concrete-grey/20 bg-asphalt-black/40 hover:border-ink-gold/20'
                  }`}
                >
                  <button
                    onClick={() => markComplete(item.id)}
                    className="mt-0.5 shrink-0 focus:outline-none"
                    aria-label={isDone ? 'Completed' : 'Mark as complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-ink-gold" />
                    ) : (
                      <Circle className="w-5 h-5 text-concrete-grey/30 hover:text-ink-gold transition-colors" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <h3
                      className={`font-primary text-sm font-semibold transition-colors ${
                        isDone ? 'text-concrete-grey/80 line-through' : 'text-paper-white'
                      }`}
                    >
                      {item.label}
                    </h3>
                    <p className="font-primary text-xs text-concrete-grey/60 leading-relaxed">
                      {item.description}
                    </p>

                    {!isDone && (
                      <button
                        onClick={() => handleCta(item)}
                        className="inline-block mt-3 text-[10px] font-mono text-ink-gold hover:text-paper-white uppercase tracking-widest transition-colors font-bold"
                      >
                        {item.ctaLabel}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Placard>
    </motion.div>
  );
}

export default OnboardingChecklist;
