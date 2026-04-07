/**
 * ApplyQuick — P3 Harvest
 * Upgraded quick-apply workspace: dual-panel layout (input + live preview),
 * step guide, and result display with artifact export.
 * KR Solidarity v6.0 compliant — semantic tokens only.
 */
import { Button, Input, Textarea } from '@careercopilot/ui';
import type { AnalyzeJobFromUrlResponse } from '@/types/masterResume';
import { JobAnalysisResultsPanel } from '@/features/applications/components/JobAnalysisResultsPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Zap, Target, Sparkles, LayoutDashboard } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workflowService } from '@/api/workflowService';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

// ─── Step guide cards (shown before analysis) ─────────────────────────────────

interface StepCardProps {
  number: string;
  Icon: React.ElementType;
  label: string;
  desc: string;
}

function StepCard({ number, Icon, label, desc }: StepCardProps) {
  return (
    <div
      className="p-5 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-outline-variant)] flex items-start gap-4"
      style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
    >
      <div
        className="w-9 h-9 flex items-center justify-center shrink-0 bg-[var(--sys-color-solidarityRed-base)] font-black text-[var(--sys-color-paperWhite-base)] text-sm"
        style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
      >
        {number}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Icon
            size={16}
            className="text-[var(--sys-color-inkGold-base)]"
          />
          <h4 className="font-bold text-[var(--sys-color-paperWhite-base)] uppercase tracking-wide text-sm">
            {label}
          </h4>
        </div>
        <p className="text-sm text-[var(--sys-color-worker-ash-base)]">{desc}</p>
      </div>
    </div>
  );
}

// ─── Page component ────────────────────────────────────────────────────────────

export function ApplyQuick() {
  const navigate = useNavigate();
  const [jobUrl, setJobUrl] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeJobFromUrlResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const jdPreview = useMemo(() => {
    const text = jobDescription.trim();
    if (!text) return 'Live JD preview will appear here as you type.';
    return text;
  }, [jobDescription]);

  const canAnalyze = (jobUrl.trim() || jobDescription.trim()) && !loading;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setError(null);
    setLoading(true);
    try {
      const payload = await workflowService.quickApply({
        jobDescription: jobDescription || 'No description provided.',
        jobUrl: jobUrl.trim() || undefined,
        jobTitle: jobTitle.trim() || undefined,
        companyName: companyName.trim() || undefined,
      });
      setResult(payload as AnalyzeJobFromUrlResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run quick apply.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--sys-color-charcoalBackground-base)] p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page header */}
        <header className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--sys-color-inkGold-base)]/70">
            [ QUICK APPLY ]
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-4xl md:text-6xl font-black text-[var(--sys-color-paperWhite-base)] tracking-tight uppercase">
                Target <span className="text-[var(--sys-color-solidarityRed-base)]">Job</span>
              </h1>
              <p className="font-primary text-[var(--sys-color-stencilYellow-base)] uppercase tracking-widest text-sm mt-1">
                No neutral canvas.
              </p>
            </div>
            <button
              id="apply-quick-toggle-guide"
              onClick={() => setShowGuide((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-worker-ash-base)] font-bold uppercase tracking-widest text-[10px] hover:text-[var(--sys-color-paperWhite-base)] transition-colors"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              {showGuide ? (
                <>
                  <LayoutDashboard size={13} /> Hide Guide
                </>
              ) : (
                <>
                  <Sparkles size={13} /> How It Works
                </>
              )}
            </button>
          </div>
        </header>

        {/* Step guide (expandable) */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-2">
                <StepCard
                  number="1"
                  Icon={Zap}
                  label="Drop a URL"
                  desc="AI reads the job posting and extracts key requirements automatically."
                />
                <StepCard
                  number="2"
                  Icon={Target}
                  label="Match Scored"
                  desc="See exactly where you fit and identify critical skill gaps instantly."
                />
                <StepCard
                  number="3"
                  Icon={Sparkles}
                  label="Tailored Pack"
                  desc="Resume, cover letter, and KSC responses generated and ready to export."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dual-panel input + preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={KrDarkSpring}
            className="border border-[var(--sys-color-outline-variant)] bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 space-y-5"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="apply-quick-title"
                  className="block text-xs font-bold uppercase tracking-widest text-[var(--sys-color-worker-ash-base)] mb-2"
                >
                  Target Role
                </label>
                <Input
                  id="apply-quick-title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Case Manager"
                  className="bg-[var(--sys-color-charcoalBackground-steps-2)]"
                />
              </div>

              <div>
                <label
                  htmlFor="apply-quick-company"
                  className="block text-xs font-bold uppercase tracking-widest text-[var(--sys-color-worker-ash-base)] mb-2"
                >
                  Company Name
                </label>
                <Input
                  id="apply-quick-company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Community First"
                  className="bg-[var(--sys-color-charcoalBackground-steps-2)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="apply-quick-url"
                className="block text-xs font-bold uppercase tracking-widest text-[var(--sys-color-worker-ash-base)] mb-2"
              >
                Job URL
              </label>
              <Input
                id="apply-quick-url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://company.com/careers/role"
                className="bg-[var(--sys-color-charcoalBackground-steps-2)]"
              />
            </div>

            <div>
              <label
                htmlFor="apply-quick-description"
                className="block text-xs font-bold uppercase tracking-widest text-[var(--sys-color-worker-ash-base)] mb-2"
              >
                Job Description{' '}
                <span className="text-[var(--sys-color-concreteGrey-base)] normal-case">
                  (or paste if no URL)
                </span>
              </label>
              <Textarea
                id="apply-quick-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the role description here…"
                className="h-44 bg-[var(--sys-color-charcoalBackground-steps-2)] border-[var(--sys-color-outline-variant)]"
              />
            </div>

            <Button
              id="apply-quick-submit"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="w-full h-12 font-black uppercase tracking-wide"
              style={{
                backgroundColor: 'var(--sys-color-solidarityRed-base)',
                color: 'var(--sys-color-charcoalBackground-base)',
                borderRadius: 'var(--sys-shape-blockRiot01)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analysing role…
                </>
              ) : (
                <>
                  Start My Application <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {error && <p className="text-sm text-[var(--sys-color-solidarityRed-base)]">{error}</p>}
          </motion.section>

          {/* Live JD preview */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={KrDarkSpring}
            className="border border-[var(--sys-color-inkGold-base)]/22 bg-[var(--sys-color-charcoalBackground-base)]/55 p-6"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--sys-color-inkGold-base)] mb-3">
              Live JD Preview
            </p>
            <pre className="font-primary text-sm text-[var(--sys-color-paperWhite-base)]/90 whitespace-pre-wrap leading-relaxed min-h-[220px] max-h-[320px] overflow-auto">
              {jdPreview}
            </pre>
          </motion.section>
        </div>

        {/* Results panel */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={KrDarkSpring}
            >
              <JobAnalysisResultsPanel
                result={result}
                onNavigateToTracker={() => navigate('/tracker')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ApplyQuick;
