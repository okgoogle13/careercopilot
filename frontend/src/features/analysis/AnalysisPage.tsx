import { ScaffoldInput, Strike, Placard, ScaffoldArea } from '@/components/ui';
import { EvidenceUploader } from '@/features/ingestion/components/EvidenceUploader';
import { ATSScoreCard } from './components/ATSScoreCard';
import { AuditDisplay } from './components/AuditDisplay';
import type { ATSScoreResult, DocumentAudit } from '@/types/analysis';
import { m3Toast } from '@/utils/toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';
import { Building, Compass, Copy, Gauge, Sparkles, Target } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayeredHero } from '@/components/kerala-rage/LayeredHero';
import { loadHeroRegistry } from '@/design/hero/heroRegistry';
import { composeHero } from '@/lib/composeHero';
import type { SolidarityManifest } from '@/design/hero/heroTypes';
import { AiOutputsTabs, type ResumeKeyword } from './components/AiOutputsTabs';
import {
  analysisService,
  type AtsScoreResponse,
  type StrategyResponse,
} from '@/api/analysisService';

// KrDark Assets
const solidarityTexture =
  '/assets/kr-solidarity/abstract/kr-solidarity__atmospheric__texture--solidarity-chatgpt-image-f--v1.png';
const paperGrain =
  '/assets/kr-solidarity/texture/kr-solidarity__substrate__landmark--melbourne-laneway--v1.png';

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
          'resistance-portrait-hero-1'
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
  const [atsResult, setAtsResult] = useState<AtsScoreResponse | null>(null);
  const [strategyResult, setStrategyResult] = useState<StrategyResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);

  const aiCriteria =
    strategyResult?.job_details.key_responsibilities?.map((title, index) => ({
      id: index + 1,
      title,
      required: true,
    })) ?? [];

  const resumeKeywords: ResumeKeyword[] = atsResult
    ? [
        ...atsResult.matched_keywords.map((label) => ({ label, match: 'strong' as const })),
        ...atsResult.missing_keywords.map((label) => ({ label, match: 'missing' as const })),
      ]
    : [];

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
      const result = await analysisService.getATSScore(resumeText, jobDescription);
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
      const result = await analysisService.getStrategy({
        jobUrl,
        resumeText,
        missingKeywords: atsResult?.missing_keywords,
      });
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
      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: `url(${paperGrain})`, backgroundRepeat: 'repeat' }}
      />

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

      <header className="mb-12 flex items-center justify-between border-b border-concrete-grey/10 pb-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-march bg-ink-gold/5 flex items-center justify-center border border-ink-gold/20 shadow-inner">
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
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <section className="lg:col-span-2 space-y-8">
          <EvidenceUploader />

          <Placard
            elevation="raised"
            className="border-concrete-grey/10 p-10 bg-asphalt-black/20"
          >
            <h2 className="font-display text-2xl font-bold text-ink-gold mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Target className="w-6 h-6" /> Application Inputs
            </h2>

            <div className="grid grid-cols-1 gap-8">
              <ScaffoldInput
                label="Job URL"
                placeholder="https://example.com/job-posting"
                value={jobUrl}
                onChange={(e: any) => setJobUrl(e.target.value)}
                variant="filled"
                className="w-full font-primary"
              />

              <ScaffoldArea
                rows={8}
                label="Resume Text"
                value={resumeText}
                onChange={(e: any) => setResumeText(e.target.value)}
                placeholder="Paste your current resume text here..."
                className="w-full font-primary text-sm"
              />

              <div className="flex items-center gap-4">
                <Strike
                  onClick={handleAnalysis}
                  disabled={isAnalyzing}
                >
                  Calibration Check
                </Strike>
                <Strike
                  onClick={handleHolisticStrategy}
                  disabled={isGeneratingStrategy}
                  variant="secondary"
                >
                  Synthesize Strategy
                </Strike>
              </div>
            </div>
          </Placard>
        </section>

        <aside className="space-y-8">
          {atsResult ? (
            <div className="space-y-6">
              <ATSScoreCard
                score={{
                  overallScore: atsResult.overallScore,
                  breakdown: {
                    keywordMatch:
                      atsResult.categories.find((c) => c.name.toLowerCase().includes('keyword'))
                        ?.score || 0,
                    skillsAlignment:
                      atsResult.categories.find((c) => c.name.toLowerCase().includes('skill'))
                        ?.score || 0,
                    jobTitleMatch:
                      atsResult.categories.find((c) => c.name.toLowerCase().includes('title'))
                        ?.score || 0,
                    experienceRelevance:
                      atsResult.categories.find((c) => c.name.toLowerCase().includes('experience'))
                        ?.score || 0,
                    formatCompliance:
                      atsResult.categories.find((c) => c.name.toLowerCase().includes('format'))
                        ?.score || 0,
                  },
                  matchedKeywords: atsResult.matched_keywords,
                  missingKeywords: atsResult.missing_keywords,
                  suggestions: atsResult.categories.flatMap((c) => c.suggestions),
                  keywordDensity: {},
                }}
                isCalculating={isAnalyzing}
                documentType="resume"
              />

              <AuditDisplay
                title="Resume"
                audit={{
                  overallScore: atsResult.overallScore,
                  scanSimulation:
                    "The recruiter's eye is drawn to your skills section first. Ensure your core competencies are prominent.",
                  violations: atsResult.categories.flatMap((c) =>
                    c.suggestions.map((s) => ({
                      ruleId: c.name,
                      severity:
                        c.status === 'ERROR'
                          ? 'error'
                          : c.status === 'WARNING'
                            ? 'warning'
                            : 'info',
                      message: s,
                    }))
                  ),
                  recommendations: atsResult.categories.flatMap((c) => c.suggestions),
                }}
              />
            </div>
          ) : (
            <EmptyState
              title="No analysis yet"
              description="Run ATS analysis to view your alignment breakdown."
              icon={Gauge}
            />
          )}

          {strategyResult && (
            <Placard
              elevation="raised"
              className="p-6 border-concrete-grey/10 bg-asphalt-black/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl uppercase text-paper-white">
                  Strategy Output
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--sys-color-kr-activistSmokeGreen-base)] border border-[var(--sys-color-kr-activistSmokeGreen-base)]/30 bg-[var(--sys-color-kr-activistSmokeGreen-base)]/10 rounded-march">
                  Ready
                </span>
              </div>
              <div className="space-y-4 text-sm text-paper-white/80">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-ink-gold" />
                  <span>{strategyResult.corporate_profile?.name}</span>
                </div>
                <p>{strategyResult.strategy_summary}</p>
                <div className="rounded-placard border border-concrete-grey/10 bg-black/20 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-concrete-grey">
                    Optimized Resume
                  </p>
                  <p className="mt-3 whitespace-pre-wrap leading-relaxed">
                    {strategyResult.optimized_resume.resume_text}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/documents">
                    <Strike variant="secondary">
                      <Copy className="h-4 w-4" />
                      Export Pack
                    </Strike>
                  </Link>
                  <Link to="/apply/quick">
                    <Strike>
                      <Sparkles className="h-4 w-4" />
                      Continue to Quick Apply
                    </Strike>
                  </Link>
                </div>
              </div>
            </Placard>
          )}

          {(strategyResult || atsResult) && (
            <AiOutputsTabs
              criteria={aiCriteria}
              resumeKeywords={resumeKeywords}
              coverLetterDraft=""
            />
          )}
        </aside>
      </div>
    </div>
  );
};

export default AnalysisPage;
