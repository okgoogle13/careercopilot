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
import { LayeredHero } from '@/components/kerala-rage/LayeredHero';
import { loadHeroRegistry } from '@/design/hero/heroRegistry';
import { composeHero } from '@/lib/composeHero';
import type { SolidarityManifest } from '@/design/hero/heroTypes';

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
          'resistance-portrait-hero'
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
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
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
                <Pebble
                  onClick={handleAnalysis}
                  disabled={isAnalyzing}
                >
                  Calibration Check
                </Pebble>
                <Pebble
                  onClick={handleHolisticStrategy}
                  disabled={isGeneratingStrategy}
                  variant="secondary"
                >
                  Synthesize Strategy
                </Pebble>
              </div>
            </div>
          </Stone>
        </section>

        <aside className="space-y-8">
          {atsResult ? (
            <SkillBreakdownCard
              overallScore={atsResult.overallScore}
              categories={atsResult.categories.map((category) => ({
                label: category.name,
                value: category.score,
                status: category.status,
              }))}
            />
          ) : (
            <EmptyState
              title="No analysis yet"
              description="Run ATS analysis to view your alignment breakdown."
              icon={Gauge}
            />
          )}

          {strategyResult && (
            <Stone
              elevation="raised"
              className="p-6 border-concrete-grey/10 bg-asphalt-black/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl uppercase text-paper-white">
                  Strategy Output
                </h3>
                <StatusBadge
                  label="Ready"
                  variant="success"
                />
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
                    <Pebble variant="secondary">
                      <Copy className="h-4 w-4" />
                      Export Pack
                    </Pebble>
                  </Link>
                  <Link to="/apply/quick">
                    <Pebble>
                      <Sparkles className="h-4 w-4" />
                      Continue to Quick Apply
                    </Pebble>
                  </Link>
                </div>
              </div>
            </Stone>
          )}
        </aside>
      </div>
    </div>
  );
};

export default AnalysisPage;
