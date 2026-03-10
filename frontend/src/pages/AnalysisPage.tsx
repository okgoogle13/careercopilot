import { Lens, LensArea, Pebble, StatusBadge, Stone } from '@/components/ui';
import { SkillBreakdownCard } from '@/components/SkillBreakdownCard';
import { EvidenceUploader } from '@/features/ingestion/components/EvidenceUploader';
import { m3Toast } from '@/utils/toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';
import { Building, Compass, Copy, Gauge, Sparkles, Target } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayeredHero } from '../components/kerala-rage/LayeredHero';
import { loadHeroRegistry } from '../design/hero/heroRegistry';
import { composeHero } from '../lib/composeHero';
import type { SolidarityManifest } from '../design/hero/heroTypes';

// KrDark Assets
const solidarityTexture =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';
const paperGrain =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';

interface AtsResult {
  overallScore: number;
  categories: Array<{
    name: string;
    score: number;
    status: string;
    suggestions: string[];
  }>;
  matched_keywords: string[];
  missing_keywords: string[];
}

interface CorporateProfile {
  name: string;
  mission_statement: string;
  core_values: string[];
  strategic_focus: string;
  communication_style: string;
  known_for: string;
}

interface StrategyResult {
  job_details: any;
  corporate_profile: CorporateProfile | null;
  optimized_resume: {
    resume_text: string;
  };
  strategy_summary: string;
  gap_analysis?: {
    missing_skills: string[];
    evidence_found: string[];
    strategy_advice: string;
  };
}

/** CareerCopilot Analysis Page */
export const AnalysisPage: React.FC = () => {
  const { track } = useAnalytics();
  const [heroData, setHeroData] = useState<{
    layers: any[];
    typography: any;
    animation: any;
    zIndexMap: any;
  } | null>(null);

  useEffect(() => {
    async function loadHero() {
      try {
        const [manifest, registry] = await Promise.all([
          fetch('/assets/kerala-rage-kr-solidarity-manifest.json').then((r) => r.json()),
          loadHeroRegistry(),
        ]);

        const result = composeHero(
          manifest as SolidarityManifest,
          registry,
          'resistance-portrait-hero' // Bhagat Singh
        );

        if (result.valid) {
          setHeroData({
            layers: result.resolvedLayers,
            typography: result.typography,
            animation: result.animation,
            zIndexMap: result.zIndexMap,
          });
        }
      } catch (error) {
        console.error('Failed to load analysis hero:', error);
      }
    }
    loadHero();
  }, []);

  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);

  const handleAnalysis = async () => {
    if (!resumeText || !jobDescription) {
      m3Toast.error('Incomplete Details', 'Please enter both resume text and job description');
      return;
    }
    setIsAnalyzing(true);
    track('ats_score_run', {
      has_job_description: Boolean(jobDescription),
      has_resume: Boolean(resumeText),
    });
    setAtsResult(null);
    try {
      const response = await fetch('/api/v1/analysis/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
      });
      if (!response.ok) throw new Error('Analysis failed');
      const result = await response.json();
      setAtsResult(result);
      m3Toast.success('Success', 'ATS Analysis complete!');
    } catch (error) {
      m3Toast.error('Error', 'Analysis failed.');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHolisticStrategy = async () => {
    if (!jobUrl || !resumeText) {
      m3Toast.error('Action Required', 'Please provide a Job URL and Resume Text');
      return;
    }
    setIsGeneratingStrategy(true);
    setStrategyResult(null);
    try {
      const response = await fetch('/api/v1/analysis/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_url: jobUrl,
          resume_text: resumeText,
          missing_keywords: atsResult?.missing_keywords || [],
        }),
      });
      if (!response.ok) throw new Error('Strategy Generation failed');
      const result = await response.json();
      setStrategyResult(result);
      m3Toast.success('Done', 'Resume strategy generated.');
      if (result.job_details) {
        const jdText = `Company: ${result.corporate_profile?.name || 'Unknown'}\nRole: ${result.job_details.role_title}\nTasks: ${(result.job_details.key_responsibilities || []).join(', ')}`;
        setJobDescription(jdText);
      }
    } catch (error) {
      m3Toast.error('Failure', 'Strategy generation failed.');
      console.error(error);
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  return (
    <div className="p-8 max-w-[1440px] mx-auto min-h-screen bg-asphalt-black-darkest relative overflow-hidden">
      {/* Texture Layer */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: `url(${paperGrain})`, backgroundRepeat: 'repeat' }}
      />

      {/* Hero Engine Integration: Static Hero Header */}
      {heroData && (
        <div className="absolute top-0 left-0 w-full h-[300px] pointer-events-none opacity-20 mask-gradient-to-bottom">
          <LayeredHero
            layers={heroData.layers}
            typography={{ ...heroData.typography, headline: '', supporting: '' }}
            animation={{ ...heroData.animation, scroll_behavior: 'none' }}
            zIndexMap={heroData.zIndexMap}
            className="h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-asphalt-black-darkest" />
        </div>
      )}

      {/* Header */}
      <header className="mb-12 flex items-center justify-between border-b border-concrete-grey/10 pb-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-megaphone bg-ink-gold/5 flex items-center justify-center border border-ink-gold/20 shadow-inner">
            <Compass className="w-10 h-10 text-ink-gold animate-in spin-in-12 duration-1000" />
          </div>
          <div>
            <h1 className="font-display text-6xl font-black text-paper-white tracking-tighter uppercase">
              ATS Analyzer
            </h1>
            <p className="font-mono text-xs text-concrete-grey tracking-[0.4em] uppercase opacity-50">
              [ ROLE MATCH ANALYSIS ]
            </p>
          </div>
        </div>

        {/* Score/Gauge Summary (Replaced by SkillBreakdownCard in sidebar) */}
      </header>

      {/* Main Grid: Inputs and Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Step 1: Inputs */}
        <section className="lg:col-span-2 space-y-8">
          <EvidenceUploader />

          <Stone
            elevation="raised"
            className="border-concrete-grey/10 p-10 bg-asphalt-black/20"
          >
            <h2 className="font-display text-2xl font-bold text-ink-gold mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Target className="w-6 h-6" /> Application Inputs
            </h2>

            <div className="grid grid-cols-1 gap-8">
              <Lens
                label="Job URL"
                placeholder="https://example.com/job-posting"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                variant="filled"
                className="w-full font-primary"
              />

              <LensArea
                rows={8}
                label="Resume Text"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your current resume text here..."
                className="w-full font-primary text-sm"
              />

              <div className="flex items-center gap-4">
                <div className="h-px bg-concrete-grey/10 flex-1"></div>
                <span className="font-mono text-[9px] text-concrete-grey opacity-30 uppercase tracking-[0.5em]">
                  OR
                </span>
                <div className="h-px bg-concrete-grey/10 flex-1"></div>
              </div>

              <LensArea
                rows={5}
                label="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description if URL analysis is unavailable..."
                className={`w-full font-primary text-sm ${jobUrl ? 'opacity-40 grayscale' : ''}`}
              />
            </div>

            <div className="flex gap-4 mt-10">
              <Pebble
                variant="primary"
                onClick={handleHolisticStrategy}
                disabled={isGeneratingStrategy || !jobUrl || !resumeText}
                isLoading={isGeneratingStrategy}
                className="flex-1 h-14 uppercase font-black"
                size="lg"
              >
                Generate Resume Strategy
              </Pebble>
              <Pebble
                variant="secondary"
                onClick={handleAnalysis}
                disabled={isAnalyzing || !resumeText || !jobDescription}
                isLoading={isAnalyzing}
                className="flex-1 h-14 uppercase font-black"
                size="lg"
              >
                Run ATS Check
              </Pebble>
            </div>
          </Stone>
        </section>

        {/* Company Snapshot / Reporting */}
        <aside className="space-y-8">
          {strategyResult && strategyResult.corporate_profile && (
            <Stone
              elevation="floating"
              className="p-0 border-ink-gold/20 overflow-hidden bg-asphalt-black-dark"
            >
              <div className="p-6 bg-ink-gold/[0.03] border-b border-concrete-grey/10 flex items-center gap-4">
                <Building className="w-6 h-6 text-ink-gold" />
                <div>
                  <h3 className="font-display text-xl text-paper-white leading-none">
                    {strategyResult.corporate_profile.name}
                  </h3>
                  <span className="text-[9px] font-mono text-concrete-grey opacity-50 uppercase tracking-widest">
                    Company Snapshot
                  </span>
                </div>
              </div>

              {/* 2x2 Forensic Grid */}
              <div className="grid grid-cols-2">
                <div className="p-6 border-r border-b border-concrete-grey/5">
                  <h4 className="font-mono text-[10px] text-ink-gold/60 uppercase mb-2">Voice</h4>
                  <span className="text-xs font-primary text-paper-white">
                    {strategyResult.corporate_profile.communication_style}
                  </span>
                </div>
                <div className="p-6 border-b border-concrete-grey/5">
                  <h4 className="font-mono text-[10px] text-ink-gold/60 uppercase mb-2">
                    Known For
                  </h4>
                  <span className="text-xs font-primary text-paper-white truncate block">
                    {strategyResult.corporate_profile.known_for}
                  </span>
                </div>
                <div className="p-6 border-r border-concrete-grey/5">
                  <h4 className="font-mono text-[10px] text-ink-gold/60 uppercase mb-2">
                    Strategic Focus
                  </h4>
                  <span className="text-xs font-primary text-paper-white line-clamp-2">
                    {strategyResult.corporate_profile.strategic_focus}
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="font-mono text-[10px] text-ink-gold/60 uppercase mb-2">
                    Company Values
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {strategyResult.corporate_profile.core_values.slice(0, 2).map((v, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-[var(--color-asphalt-black-light)] px-1.5 py-0.5 rounded-megaphone text-concrete-grey"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-concrete-grey/10 bg-black/20">
                <h4 className="font-mono text-[10px] text-concrete-grey-dark uppercase mb-3 tracking-widest">
                  Mission
                </h4>
                <p className="font-primary text-[11px] leading-relaxed text-paper-white/60 italic">
                  "{strategyResult.corporate_profile.mission_statement}"
                </p>
              </div>
            </Stone>
          )}

          {/* Skill Breakdown (Audit Microscope) */}
          {atsResult && (
            <SkillBreakdownCard
              overallScore={atsResult.overallScore}
              categories={atsResult.categories.map((cat) => ({
                label: cat.name,
                value: cat.score,
                details: cat.suggestions,
              }))}
              onAction={(type) => {
                if (type === 'strengthen') {
                  m3Toast.success('Refining Draft', 'Identifying low-impact sections to improve.');
                }
              }}
            />
          )}
        </aside>
      </div>

      {!strategyResult && !atsResult && (
        <div className="mt-8 relative z-10">
          <EmptyState
            icon={Gauge}
            title="Ready to run ATS scoring"
            description="Paste your resume and a job ad to see ATS alignment, missing keywords, and optimization guidance."
            className="border-concrete-grey/15 bg-asphalt-black/35"
          />
        </div>
      )}

      {atsResult && (
        <div className="mt-8 relative z-10">
          <Stone
            elevation="floating"
            className="p-6 border-outline-variant bg-surface-container-high/40"
          >
            <p className="text-label-small font-mono uppercase tracking-wider text-on-surface-variant mb-2">
              What's next?
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/cover-letter-generator${jobDescription ? `?jobDescription=${encodeURIComponent(jobDescription)}` : ''}`}
                className="inline-flex items-center rounded-march bg-primary-container text-on-primary-container px-4 py-2 text-sm font-bold"
              >
                Generate a tailored cover letter
              </Link>
              <Link
                to="/ksc-generator"
                className="inline-flex items-center rounded-march border border-outline px-4 py-2 text-sm font-semibold text-on-surface"
              >
                Draft KSC responses
              </Link>
            </div>
          </Stone>
        </div>
      )}

      {/* Results Output: Optimized Resume */}
      {(strategyResult || atsResult) && (
        <div className="mt-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Stone
            elevation="floating"
            className="border-ink-gold/30 p-0 overflow-hidden"
            header={
              <div className="flex justify-between items-center w-full bg-ink-gold/[0.02] p-6 border-b border-concrete-grey/10">
                <div>
                  <h3 className="text-2xl font-black text-paper-white flex items-center gap-3 uppercase tracking-tighter">
                    <Sparkles className="w-6 h-6 text-ink-gold" /> Optimized Output
                  </h3>
                  <p className="text-[10px] font-mono text-concrete-grey-dark mt-1 uppercase tracking-widest">
                    Ready for export
                  </p>
                </div>
                <Pebble
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      strategyResult?.optimized_resume.resume_text || ''
                    );
                    m3Toast.success('Copied', 'Optimized resume text copied to clipboard.');
                  }}
                  iconLeft={<Copy className="w-4 h-4" />}
                  size="sm"
                  className="px-6"
                >
                  Export Payload
                </Pebble>
              </div>
            }
          >
            <div className="font-primary text-sm text-paper-white/90 bg-black/40 p-10 whitespace-pre-wrap leading-relaxed shadow-inner font-mono">
              {strategyResult
                ? strategyResult.optimized_resume.resume_text
                : 'Waiting for generated output...'}
            </div>
          </Stone>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
