import { Lens, LensArea, Pebble, StatusBadge, Stone } from '@/components/ui';
<<<<<<< HEAD
=======
import { SkillBreakdownCard } from '@/components/SkillBreakdownCard';
>>>>>>> restoration-KR-Rage-Figma-v2.0
import { EvidenceUploader } from '@/features/ingestion/components/EvidenceUploader';
import { m3Toast } from '@/utils/toast';
import { motion } from 'framer-motion';
import { Building, Compass, Copy, Gauge, Sparkles, Target } from 'lucide-react';
<<<<<<< HEAD
import React, { useState } from 'react';

// Laboratory Assets
import grindingStone from '../assets/specimens/grinding_stone.jpg';
import paperGrain from '../assets/textures/paper-grain.png';
=======
import React, { useState, useEffect } from 'react';
import { LayeredHero } from '../components/kerala-rage/LayeredHero';
import { loadHeroRegistry } from '../design/hero/heroRegistry';
import { composeHero } from '../utils/heroComposer';
import type { SolidarityManifest } from '../design/hero/heroTypes';

// KrDark Assets
const grindingStone = '/assets/kr-solidarity/specimen/kr-solidarity__specimen__triage-natural-history__v1.png';
const paperGrain = '/assets/kr-solidarity/texture/kr-solidarity__substrate__kr-solidarity--texture--melbourne-laneway--v1__v1.png';
>>>>>>> restoration-KR-Rage-Figma-v2.0

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

/**
 * CareerCopilot Analysis Page ("The Audit Microscope")
 *
<<<<<<< HEAD
 * V3.1 Laboratory Mode Implementation:
=======
 * V3.1 KrDark Mode Implementation:
>>>>>>> restoration-KR-Rage-Figma-v2.0
 * ✓ ASSET-05 Brass Compass Gauge Integration
 * ✓ 2x2 Stone Grid for Corporate Reporting
 * ✓ Precision typography and monospace annotations
 */
export const AnalysisPage: React.FC = () => {
<<<<<<< HEAD
=======
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
          'resistance-portrait-hero-1' // Bhagat Singh
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

>>>>>>> restoration-KR-Rage-Figma-v2.0
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
      m3Toast.success('Done', 'Holistic Strategy Generated!');
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
<<<<<<< HEAD
    <div className="p-8 max-w-[1440px] mx-auto min-h-screen bg-specimen-night-darkest relative overflow-hidden">
=======
    <div className="p-8 max-w-[1440px] mx-auto min-h-screen bg-asphalt-black-darkest relative overflow-hidden">
>>>>>>> restoration-KR-Rage-Figma-v2.0
      {/* Texture Layer: Lab Overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none mix-blend-screen"
        style={{ backgroundImage: `url(${paperGrain})`, backgroundRepeat: 'repeat' }}
      />

<<<<<<< HEAD
      {/* Header: Analytical Focus */}
      <header className="mb-12 flex items-center justify-between border-b border-flannel-flower/10 pb-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-stone bg-wattle-gold/5 flex items-center justify-center border border-wattle-gold/20 shadow-inner">
            <Compass className="w-10 h-10 text-wattle-gold animate-in spin-in-12 duration-1000" />
          </div>
          <div>
            <h1 className="font-bloom text-6xl font-black text-parchment tracking-tighter uppercase">
              Audit Microscope
            </h1>
            <p className="font-annotation text-xs text-flannel-flower tracking-[0.4em] uppercase opacity-50">
=======
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

      {/* Header: Analytical Focus */}
      <header className="mb-12 flex items-center justify-between border-b border-concrete-grey/10 pb-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-stone bg-ink-gold/5 flex items-center justify-center border border-ink-gold/20 shadow-inner">
            <Compass className="w-10 h-10 text-ink-gold animate-in spin-in-12 duration-1000" />
          </div>
          <div>
            <h1 className="font-bloom text-6xl font-black text-paper-white tracking-tighter uppercase">
              Audit Microscope
            </h1>
            <p className="font-annotation text-xs text-concrete-grey tracking-[0.4em] uppercase opacity-50">
>>>>>>> restoration-KR-Rage-Figma-v2.0
              [ SYSTEM.ANALYSIS_ENGINE_V3.1 ]
            </p>
          </div>
        </div>

<<<<<<< HEAD
        {/* Score/Gauge Summary (ASSET-05 Metaphor) */}
        {atsResult && (
          <div className="flex items-center gap-8 bg-specimen-night/30 p-4 rounded-stone border border-flannel-flower/10">
            <div className="relative w-24 h-24">
              <img
                src={grindingStone}
                alt=""
                className="absolute inset-0 w-full h-full object-cover rounded-full opacity-20 grayscale brightness-150"
              />
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  className="text-flannel-flower/10"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * atsResult.overallScore) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="text-wattle-gold"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-parchment">{atsResult.overallScore}</span>
                <span className="text-[8px] font-annotation text-wattle-gold uppercase">Match</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="block font-annotation text-[10px] text-flannel-flower-dark uppercase tracking-widest">
                Global Calibration
              </span>
              <StatusBadge
                label={atsResult.overallScore > 70 ? 'HIGH_COMPATIBILITY' : 'REFINEMENT_REQUIRED'}
                variant={atsResult.overallScore > 70 ? 'success' : 'warning'}
                showDot
              />
            </div>
          </div>
        )}
=======
        {/* Score/Gauge Summary (Replaced by SkillBreakdownCard in sidebar) */}
>>>>>>> restoration-KR-Rage-Figma-v2.0
      </header>

      {/* Main Grid: Lab Inputs and Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Step 1: Tactical Inputs */}
        <section className="lg:col-span-2 space-y-8">
          <EvidenceUploader />

          <Stone
<<<<<<< HEAD
            mode="laboratory"
            elevation="raised"
            className="border-flannel-flower/10 p-10 bg-specimen-night/20"
          >
            <h2 className="font-bloom text-2xl font-bold text-wattle-gold mb-8 flex items-center gap-3 uppercase tracking-tight">
=======
           
            elevation="raised"
            className="border-concrete-grey/10 p-10 bg-asphalt-black/20"
          >
            <h2 className="font-bloom text-2xl font-bold text-ink-gold mb-8 flex items-center gap-3 uppercase tracking-tight">
>>>>>>> restoration-KR-Rage-Figma-v2.0
              <Target className="w-6 h-6" /> Tactical Inputs
            </h2>

            <div className="grid grid-cols-1 gap-8">
              <Lens
                label="Job ID (Listing URL)"
                placeholder="https://station-records.net/listing/..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                variant="filled"
                className="w-full font-field-note"
              />

              <LensArea
                rows={8}
<<<<<<< HEAD
                label="Primary Specimen (Resume Text)"
=======
                label="Primary KrMotif (Resume Text)"
>>>>>>> restoration-KR-Rage-Figma-v2.0
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Extract text from your professional history and deposit here..."
                className="w-full font-field-note text-sm"
              />

              <div className="flex items-center gap-4">
<<<<<<< HEAD
                <div className="h-px bg-flannel-flower/10 flex-1"></div>
                <span className="font-annotation text-[9px] text-flannel-flower opacity-30 uppercase tracking-[0.5em]">
                  Diagnostic Override
                </span>
                <div className="h-px bg-flannel-flower/10 flex-1"></div>
=======
                <div className="h-px bg-concrete-grey/10 flex-1"></div>
                <span className="font-annotation text-[9px] text-concrete-grey opacity-30 uppercase tracking-[0.5em]">
                  Diagnostic Override
                </span>
                <div className="h-px bg-concrete-grey/10 flex-1"></div>
>>>>>>> restoration-KR-Rage-Figma-v2.0
              </div>

              <LensArea
                rows={5}
                label="Secondary Context (Manual JD)"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter requirements if station URL is unreachable..."
                className={`w-full font-field-note text-sm ${jobUrl ? 'opacity-40 grayscale' : ''}`}
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
                Synthesize Strategy
              </Pebble>
              <Pebble
                variant="secondary"
                onClick={handleAnalysis}
                disabled={isAnalyzing || !resumeText || !jobDescription}
                isLoading={isAnalyzing}
                className="flex-1 h-14 uppercase font-black"
                size="lg"
              >
                Calibration Check
              </Pebble>
            </div>
          </Stone>
        </section>

        {/* Intelligence Sidebar / Reporting */}
        <aside className="space-y-8">
          {strategyResult && strategyResult.corporate_profile && (
            <Stone
<<<<<<< HEAD
              mode="laboratory"
              elevation="floating"
              className="p-0 border-wattle-gold/20 overflow-hidden bg-specimen-night-dark"
            >
              <div className="p-6 bg-wattle-gold/[0.03] border-b border-flannel-flower/10 flex items-center gap-4">
                <Building className="w-6 h-6 text-wattle-gold" />
                <div>
                  <h3 className="font-bloom text-xl text-parchment leading-none">
                    {strategyResult.corporate_profile.name}
                  </h3>
                  <span className="text-[9px] font-annotation text-flannel-flower opacity-50 uppercase tracking-widest">
=======
             
              elevation="floating"
              className="p-0 border-ink-gold/20 overflow-hidden bg-asphalt-black-dark"
            >
              <div className="p-6 bg-ink-gold/[0.03] border-b border-concrete-grey/10 flex items-center gap-4">
                <Building className="w-6 h-6 text-ink-gold" />
                <div>
                  <h3 className="font-bloom text-xl text-paper-white leading-none">
                    {strategyResult.corporate_profile.name}
                  </h3>
                  <span className="text-[9px] font-annotation text-concrete-grey opacity-50 uppercase tracking-widest">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    Corporate DNA Map
                  </span>
                </div>
              </div>

              {/* 2x2 Forensic Grid */}
              <div className="grid grid-cols-2">
<<<<<<< HEAD
                <div className="p-6 border-r border-b border-flannel-flower/5">
                  <h4 className="font-annotation text-[10px] text-wattle-gold/60 uppercase mb-2">
                    Voice
                  </h4>
                  <span className="text-xs font-field-note text-parchment">
                    {strategyResult.corporate_profile.communication_style}
                  </span>
                </div>
                <div className="p-6 border-b border-flannel-flower/5">
                  <h4 className="font-annotation text-[10px] text-wattle-gold/60 uppercase mb-2">
                    Known For
                  </h4>
                  <span className="text-xs font-field-note text-parchment truncate block">
                    {strategyResult.corporate_profile.known_for}
                  </span>
                </div>
                <div className="p-6 border-r border-flannel-flower/5">
                  <h4 className="font-annotation text-[10px] text-wattle-gold/60 uppercase mb-2">
                    Strategic Focus
                  </h4>
                  <span className="text-xs font-field-note text-parchment line-clamp-2">
=======
                <div className="p-6 border-r border-b border-concrete-grey/5">
                  <h4 className="font-annotation text-[10px] text-ink-gold/60 uppercase mb-2">
                    Voice
                  </h4>
                  <span className="text-xs font-field-note text-paper-white">
                    {strategyResult.corporate_profile.communication_style}
                  </span>
                </div>
                <div className="p-6 border-b border-concrete-grey/5">
                  <h4 className="font-annotation text-[10px] text-ink-gold/60 uppercase mb-2">
                    Known For
                  </h4>
                  <span className="text-xs font-field-note text-paper-white truncate block">
                    {strategyResult.corporate_profile.known_for}
                  </span>
                </div>
                <div className="p-6 border-r border-concrete-grey/5">
                  <h4 className="font-annotation text-[10px] text-ink-gold/60 uppercase mb-2">
                    Strategic Focus
                  </h4>
                  <span className="text-xs font-field-note text-paper-white line-clamp-2">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    {strategyResult.corporate_profile.strategic_focus}
                  </span>
                </div>
                <div className="p-6">
<<<<<<< HEAD
                  <h4 className="font-annotation text-[10px] text-wattle-gold/60 uppercase mb-2">
=======
                  <h4 className="font-annotation text-[10px] text-ink-gold/60 uppercase mb-2">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    Core Ethos
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {strategyResult.corporate_profile.core_values.slice(0, 2).map((v, i) => (
                      <span
                        key={i}
<<<<<<< HEAD
                        className="text-[10px] font-annotation bg-white/5 px-1.5 py-0.5 rounded-sm text-flannel-flower"
=======
                        className="text-[10px] font-annotation bg-white/5 px-1.5 py-0.5 rounded-sm text-concrete-grey"
>>>>>>> restoration-KR-Rage-Figma-v2.0
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              <div className="p-6 border-t border-flannel-flower/10 bg-black/20">
                <h4 className="font-annotation text-[10px] text-flannel-flower-dark uppercase mb-3 tracking-widest">
                  Mission Protocol
                </h4>
                <p className="font-field-note text-[11px] leading-relaxed text-parchment/60 italic">
=======
              <div className="p-6 border-t border-concrete-grey/10 bg-black/20">
                <h4 className="font-annotation text-[10px] text-concrete-grey-dark uppercase mb-3 tracking-widest">
                  Mission Protocol
                </h4>
                <p className="font-field-note text-[11px] leading-relaxed text-paper-white/60 italic">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                  "{strategyResult.corporate_profile.mission_statement}"
                </p>
              </div>
            </Stone>
          )}

<<<<<<< HEAD
          {/* Diagnostic categories from quick check */}
          {atsResult && (
            <Stone
              mode="laboratory"
              elevation="raised"
              className="border-flannel-flower/5 bg-specimen-night-darkest"
            >
              <h3 className="font-annotation text-[10px] text-flannel-flower uppercase mb-6 flex items-center gap-2">
                <Gauge className="w-3 h-3" /> Diagnostic Categories
              </h3>
              <div className="space-y-6">
                {atsResult.categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-end">
                      <span className="font-field-note text-xs text-parchment/80">{cat.name}</span>
                      <span className="font-annotation text-[10px] text-wattle-gold">
                        {cat.score}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.score}%` }}
                        className="h-full bg-flannel-flower/30"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Stone>
=======
          {/* Skill Breakdown (Audit Microscope) */}
          {atsResult && (
            <SkillBreakdownCard
              overallScore={atsResult.overallScore}
              categories={atsResult.categories.map(cat => ({
                label: cat.name,
                value: cat.score,
                details: cat.suggestions
              }))}
              onAction={(type) => {
                if (type === 'strengthen') {
                  m3Toast.success('Refining Tray', 'Identifying weak KrMotif filaments...');
                }
              }}
            />
>>>>>>> restoration-KR-Rage-Figma-v2.0
          )}
        </aside>
      </div>

<<<<<<< HEAD
      {/* Results Output: Optimized Specimen */}
      {(strategyResult || atsResult) && (
        <div className="mt-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Stone
            mode="laboratory"
            elevation="floating"
            className="border-wattle-gold/30 p-0 overflow-hidden"
            header={
              <div className="flex justify-between items-center w-full bg-wattle-gold/[0.02] p-6 border-b border-flannel-flower/10">
                <div>
                  <h3 className="text-2xl font-black text-parchment flex items-center gap-3 uppercase tracking-tighter">
                    <Sparkles className="w-6 h-6 text-wattle-gold" /> Optimized Output
                  </h3>
                  <p className="text-[10px] font-annotation text-flannel-flower-dark mt-1 uppercase tracking-widest">
=======
      {/* Results Output: Optimized KrMotif */}
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
                  <p className="text-[10px] font-annotation text-concrete-grey-dark mt-1 uppercase tracking-widest">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    Ready for archival submission
                  </p>
                </div>
                <Pebble
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      strategyResult?.optimized_resume.resume_text || ''
                    );
<<<<<<< HEAD
                    m3Toast.success('Archived', 'Specimen data copied to terminal clipboard.');
=======
                    m3Toast.success('Archived', 'KrMotif data copied to terminal clipboard.');
>>>>>>> restoration-KR-Rage-Figma-v2.0
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
<<<<<<< HEAD
            <div className="font-field-note text-sm text-parchment/90 bg-black/40 p-10 whitespace-pre-wrap leading-relaxed shadow-inner font-mono">
=======
            <div className="font-field-note text-sm text-paper-white/90 bg-black/40 p-10 whitespace-pre-wrap leading-relaxed shadow-inner font-mono">
>>>>>>> restoration-KR-Rage-Figma-v2.0
              {strategyResult
                ? strategyResult.optimized_resume.resume_text
                : 'Pending manual calibration...'}
            </div>
          </Stone>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
