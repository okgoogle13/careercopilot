import { Button } from '@careercopilot/ui';
import type { AnalyzeJobFromUrlResponse } from '@/types/masterResume';
import { Link2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface JobAnalysisResultsPanelProps {
  result: AnalyzeJobFromUrlResponse;
  onNavigateToTracker: () => void;
}

export function JobAnalysisResultsPanel({
  result,
  onNavigateToTracker,
}: JobAnalysisResultsPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="space-y-6"
    >
      {/* ATS Score & Target Job */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-placard border border-ink-gold/22 bg-asphalt-black/50 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-gold/80">
            ATS Preview
          </p>
          <p className="text-5xl font-black text-paper-white mt-2 tabular-nums">
            {result.ats_preview.score}
          </p>
        </div>
        <div className="rounded-placard border border-concrete-grey/20 bg-asphalt-black/50 p-5 md:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-concrete-grey">
            Target
          </p>
          <p className="font-display text-2xl text-paper-white">{result.job_title}</p>
          <p className="font-primary text-concrete-grey">{result.company_name}</p>
        </div>
      </div>

      {/* Chunk Matches */}
      <div className="rounded-placard border border-concrete-grey/18 bg-asphalt-black/55 p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-gold mb-4">
          Chunk Match Visualization
        </p>
        <div className="space-y-3">
          {result.chunk_matches.map((match) => (
            <div
              key={match.chunk_id}
              className="border border-concrete-grey/15 rounded-megaphone p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-primary text-paper-white font-semibold">{match.label}</p>
                <span className="font-mono text-xs text-ink-gold tabular-nums">
                  {(match.score * 100).toFixed(0)}%
                </span>
              </div>
              <p className="font-mono text-[11px] text-concrete-grey mt-2">
                terms: {match.matched_terms.join(', ') || 'none'}
              </p>
              <p className="font-primary text-sm text-paper-white/75 mt-2">{match.snippet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Pack CTA */}
      <div className="rounded-placard border border-ink-gold/20 bg-asphalt-black/55 p-6 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-gold">
          Export Pack
        </p>
        <p className="font-primary text-concrete-grey text-sm">
          Resume, cover letter, and KSC artifacts are generated for this role. Continue to tracker
          to manage your application stage.
        </p>
        <Button
          onClick={onNavigateToTracker}
          className="rounded-strike font-bold uppercase tracking-wide"
          style={{
            backgroundColor: 'var(--sys-color-solidarityRed-base)',
            color: 'var(--sys-color-charcoalBackground-base)',
          }}
        >
          Go To Tracker <Link2 className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.section>
  );
}
