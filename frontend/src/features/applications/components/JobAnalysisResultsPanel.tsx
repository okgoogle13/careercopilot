/**
 * JobAnalysisResultsPanel — P4 Harvest
 * Displays ATS preview, chunk match visualization, generated artifacts
 * (resume, cover letter, KSC), and export action. KR Solidarity v6.0.
 */
import { Button } from '@careercopilot/ui';
import type { AnalyzeJobFromUrlResponse } from '@/types/masterResume';
import { Link2, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

export interface JobAnalysisResultsPanelProps {
  result: AnalyzeJobFromUrlResponse;
  onNavigateToTracker: () => void;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'var(--sys-color-kr-activistSmokeGreen-base)'
      : score >= 60
        ? 'var(--sys-color-stencilYellow-base)'
        : 'var(--sys-color-solidarityRed-base)';
  return (
    <p
      className="text-5xl font-black tabular-nums"
      style={{ color }}
    >
      {score}
    </p>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest border border-[var(--kr-color-concrete-grey-steps-0)] text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)] transition-colors"
      style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
    >
      {copied ? (
        <Check
          size={12}
          className="text-[var(--sys-color-kr-activistSmokeGreen-base)]"
        />
      ) : (
        <Copy size={12} />
      )}
      {copied ? 'Copied!' : `Copy ${label}`}
    </button>
  );
}

export function JobAnalysisResultsPanel({
  result,
  onNavigateToTracker,
}: JobAnalysisResultsPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={KrDarkSpring}
      className="space-y-6"
    >
      {/* Row 1: ATS Score + Target job */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="border border-[var(--sys-color-inkGold-base)]/22 bg-[var(--sys-color-charcoalBackground-steps-1)] p-5"
          style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--sys-color-inkGold-base)]/80">
            ATS Preview
          </p>
          <ScoreBadge score={result.ats_preview.score} />
          <p className="font-primary text-xs text-[var(--sys-color-concreteGrey-base)] mt-1">
            /100 estimated fit
          </p>
        </div>
        <div
          className="border border-[var(--kr-color-concrete-grey-steps-0)] bg-[var(--sys-color-charcoalBackground-steps-1)] p-5 md:col-span-2"
          style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--sys-color-concreteGrey-base)]">
            Target Role
          </p>
          <p className="font-display text-2xl text-[var(--sys-color-paperWhite-base)] mt-1">
            {result.job_title}
          </p>
          <p className="font-primary text-[var(--sys-color-concreteGrey-base)]">
            {result.company_name}
          </p>
        </div>
      </div>

      {/* Row 2: Chunk match visualization */}
      <div
        className="border border-[var(--kr-color-concrete-grey-steps-0)]/18 bg-[var(--sys-color-charcoalBackground-steps-1)] p-6"
        style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--sys-color-inkGold-base)] mb-4">
          Chunk Match Visualization
        </p>
        <div className="space-y-3">
          {result.chunk_matches.map((match) => (
            <div
              key={match.chunk_id}
              className="border border-[var(--kr-color-concrete-grey-steps-0)]/15 p-4"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="font-primary text-[var(--sys-color-paperWhite-base)] font-semibold text-sm">
                  {match.label}
                </p>
                <span
                  className="font-mono text-xs tabular-nums font-bold"
                  style={{
                    color:
                      match.score >= 0.8
                        ? 'var(--sys-color-kr-activistSmokeGreen-base)'
                        : match.score >= 0.6
                          ? 'var(--sys-color-stencilYellow-base)'
                          : 'var(--sys-color-solidarityRed-base)',
                  }}
                >
                  {(match.score * 100).toFixed(0)}%
                </span>
              </div>
              {/* Score bar */}
              <div
                className="h-1 w-full bg-[var(--kr-color-concrete-grey-steps-0)] mb-2"
                style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
              >
                <div
                  className="h-1 transition-all duration-700"
                  style={{
                    width: `${match.score * 100}%`,
                    borderRadius: 'var(--sys-shape-blockRiot01)',
                    backgroundColor:
                      match.score >= 0.8
                        ? 'var(--sys-color-kr-activistSmokeGreen-base)'
                        : match.score >= 0.6
                          ? 'var(--sys-color-stencilYellow-base)'
                          : 'var(--sys-color-solidarityRed-base)',
                  }}
                />
              </div>
              <p className="font-mono text-[11px] text-[var(--sys-color-concreteGrey-base)]">
                terms: {match.matched_terms.join(', ') || 'none'}
              </p>
              <p className="font-primary text-sm text-[var(--sys-color-paperWhite-base)]/75 mt-1">
                {match.snippet}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Generated artifacts */}
      {result.artifacts && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tailored Resume */}
          <div
            className="border border-[var(--kr-color-concrete-grey-steps-0)] bg-[var(--sys-color-charcoalBackground-steps-1)] p-5 space-y-3"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--sys-color-inkGold-base)]">
                Tailored Resume
              </p>
              <CopyButton
                text={result.artifacts.tailored_resume}
                label="Resume"
              />
            </div>
            <pre className="font-mono text-[11px] text-[var(--sys-color-worker-ash-base)] whitespace-pre-wrap leading-relaxed max-h-48 overflow-auto">
              {result.artifacts.tailored_resume || 'Not generated.'}
            </pre>
          </div>

          {/* Cover Letter */}
          <div
            className="border border-[var(--kr-color-concrete-grey-steps-0)] bg-[var(--sys-color-charcoalBackground-steps-1)] p-5 space-y-3"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--sys-color-inkGold-base)]">
                Cover Letter
              </p>
              <CopyButton
                text={result.artifacts.cover_letter}
                label="Letter"
              />
            </div>
            <pre className="font-mono text-[11px] text-[var(--sys-color-worker-ash-base)] whitespace-pre-wrap leading-relaxed max-h-48 overflow-auto">
              {result.artifacts.cover_letter || 'Not generated.'}
            </pre>
          </div>

          {/* KSC Response */}
          <div
            className="border border-[var(--kr-color-concrete-grey-steps-0)] bg-[var(--sys-color-charcoalBackground-steps-1)] p-5 space-y-3"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--sys-color-inkGold-base)]">
                KSC Response
              </p>
              <CopyButton
                text={result.artifacts.ksc_response}
                label="KSC"
              />
            </div>
            <pre className="font-mono text-[11px] text-[var(--sys-color-worker-ash-base)] whitespace-pre-wrap leading-relaxed max-h-48 overflow-auto">
              {result.artifacts.ksc_response || 'Not generated.'}
            </pre>
          </div>
        </div>
      )}

      {/* Row 4: Export Pack CTA */}
      <div
        className="border border-[var(--sys-color-inkGold-base)]/20 bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 space-y-3"
        style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--sys-color-inkGold-base)]">
          Export Pack
        </p>
        <p className="font-primary text-[var(--sys-color-concreteGrey-base)] text-sm">
          Your application pack is ready. Continue to the tracker to manage your application stage
          and store it in your history.
        </p>
        <Button
          id="apply-quick-go-to-tracker"
          onClick={onNavigateToTracker}
          className="font-bold uppercase tracking-wide"
          style={{
            backgroundColor: 'var(--sys-color-solidarityRed-base)',
            color: 'var(--sys-color-charcoalBackground-base)',
            borderRadius: 'var(--sys-shape-blockRiot01)',
          }}
        >
          Go To Tracker <Link2 className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.section>
  );
}
