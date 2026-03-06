import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TechCard } from '@/features/analysis/TechCard';
import { Activity, ShieldCheck, Zap, RefreshCw, FileText } from 'lucide-react';
import { KeralaRageButton } from '@/components/ui/KeralaRageButton';
import { useAnalysis } from '@/hooks/useAnalysis';

export const AnalysisAnchor: React.FC = () => {
  const { analyzeDocument, analyzing, result } = useAnalysis();

  const results = useMemo(() => {
    if (result) {
      return {
        overall: result.score.overall,
        ats: result.score.atsReadability,
        impact: result.score.impact,
        insights: result.recommendations.map((text) => ({ type: 'note', text })),
      };
    }

    return {
      overall: 84,
      ats: 91,
      impact: 78,
      insights: [
        { type: 'strength', text: 'Strong alignment with leadership and collaboration keywords.' },
        { type: 'warning', text: 'Add measurable outcomes for recent project impacts.' },
        { type: 'note', text: 'Resume structure remains ATS-friendly.' },
      ],
    };
  }, [result]);

  const handleReAnalyze = () => {
    analyzeDocument('Sample resume text', 'Sample criteria').catch(() => {});
  };

  if (analyzing && !result) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-8 h-8 text-ink-gold opacity-50" />
        </motion.div>
        <p className="font-field-note text-secondary-concrete-grey animate-pulse">
          Parsing KrMotifs...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TechCard
          title="Overall Score"
          description="Composite employability rating."
          level={results.overall > 80 ? 'expert' : 'intermediate'}
          icon={<Activity className="w-5 h-5" />}
          tags={[`${results.overall}/100`]}
          className="col-span-1"
        />
        <TechCard
          title="ATS Compliance"
          description="Parseability by tracking systems."
          level={results.ats > 90 ? 'expert' : 'advanced'}
          icon={<ShieldCheck className="w-5 h-5" />}
          tags={results.ats > 90 ? ['Pass', 'Clean'] : ['Review']}
          className="col-span-1"
        />
        <TechCard
          title="Impact Score"
          description="Quantifiable achievements."
          level="advanced"
          icon={<Zap className="w-5 h-5" />}
          tags={[`${results.impact}/100`]}
          className="col-span-1"
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="flex-1 bg-surface-KrDark-glass-low border border-white/5 rounded-pebble p-6 backdrop-blur-sm flex flex-col gap-4">
        <div className="flex justify-between items-end border-b border-white/10 pb-2">
          <h3 className="font-field-note text-lg text-ink-gold">Analysis Insights</h3>
          <span className="text-xs font-mono text-secondary-concrete-grey opacity-50">
            {results.insights.length} Findings
          </span>
        </div>

        <div className="space-y-3 overflow-y-auto pr-2">
          <AnimatePresence>
            {results.insights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-3 rounded bg-surface-KrDark-plate/30 border border-white/5 group hover:border-white/10 transition-colors"
              >
                <span
                  className={`mt-1.5 w-2 h-2 rounded-sentry shrink-0 ${
                    insight.type === 'strength'
                      ? 'bg-status-KrDark-clinical-sage shadow-[0_0_8px_rgba(74,222,128,0.4)]'
                      : insight.type === 'warning'
                        ? 'bg-status-KrDark-clinical-alert shadow-[0_0_8px_rgba(248,113,113,0.4)]'
                        : 'bg-ink-gold'
                  }`}
                />
                <span className="text-sm font-body text-secondary-concrete-grey group-hover:text-on-surface-KrDark-paper-white transition-colors">
                  {insight.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-4 flex gap-3">
          <KeralaRageButton variant="primary">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </KeralaRageButton>
          <KeralaRageButton
            variant="secondary"
            onClick={handleReAnalyze}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-Analyze
          </KeralaRageButton>
        </div>
      </div>
    </div>
  );
};
