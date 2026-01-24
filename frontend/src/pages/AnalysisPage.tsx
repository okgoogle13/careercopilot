import {
    Lens,
    M3TextArea,
    Pebble,
    Signal,
    StatusBadge,
    Stone,
    M3CardHeader as StoneHeader
} from '@/components/ui';
import { EvidenceUploader } from '@/features/ingestion/components/EvidenceUploader';
import { m3Toast } from '@/utils/toast';
import { Building, Copy, Globe, Heart, MessageCircle, Sparkles, Target } from 'lucide-react';
import React, { useState } from 'react';

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
    // Inputs
    const [jobUrl, setJobUrl] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [resumeText, setResumeText] = useState('');

    // Results
    const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
    const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);

    // Loading States
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
                body: JSON.stringify({
                    resume_text: resumeText,
                    job_description: jobDescription
                })
            });

            if (!response.ok) throw new Error('Analysis failed');

            const result = await response.json();
            setAtsResult(result);
            m3Toast.success('Success', 'ATS Analysis complete!');
        } catch (error) {
            m3Toast.error('Error', 'Analysis failed. Please try again.');
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
                    missing_keywords: atsResult?.missing_keywords || []
                })
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
            m3Toast.error('Failure', 'Strategy generation failed. Please check the URL.');
            console.error(error);
        } finally {
            setIsGeneratingStrategy(false);
        }
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-[var(--color-specimen-night)]">
            {/* Header */}
            <header className="mb-10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-wattle-gold)]/10 flex items-center justify-center border border-[var(--color-wattle-gold)]/30">
                    <Sparkles className="w-8 h-8 text-[var(--color-wattle-gold)]" />
                </div>
                <div>
                    <h1 className="font-bloom text-5xl font-bold text-[var(--color-parchment)] tracking-tight">
                        Application Intelligence
                    </h1>
                    <p className="font-field-note text-[var(--color-flannel-flower-dark)] mt-1">
                        Synthesize corporate strategy with tactical resume optimization.
                    </p>
                </div>
            </header>

            {/* Evidence Uploader Segment */}
            <section className="mb-10">
                <EvidenceUploader />
            </section>

            {/* Input Intelligence Card */}
            <Stone variant="tech" padding="lg" elevation={2} className="mb-8 border-[var(--color-eucalypt-smoke-base)]/20">
                <h2 className="font-bloom text-2xl font-bold text-[var(--color-wattle-gold)] mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6" /> Step 1: Tactical Inputs
                </h2>

                <div className="space-y-6">
                    <Lens
                        fullWidth
                        label="Job Listing URL"
                        placeholder="https://linkedin.com/jobs/view/..."
                        value={jobUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobUrl(e.target.value)}
                        variant="outlined"
                    />

                    <M3TextArea
                        fullWidth
                        rows={6}
                        label="Primary Resume Content"
                        value={resumeText}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResumeText(e.target.value)}
                        placeholder="Paste the raw text of your current resume..."
                    />

                    <div className="flex items-center gap-4 py-2">
                        <div className="h-0.5 bg-white/5 flex-1"></div>
                        <span className="text-[var(--color-flannel-flower-dark)] text-xs font-annotation font-bold tracking-widest opacity-40 uppercase">OR Manual Context</span>
                        <div className="h-0.5 bg-white/5 flex-1"></div>
                    </div>

                    <M3TextArea
                        fullWidth
                        rows={4}
                        label="Supplemental Job Description"
                        value={jobDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                        placeholder="Use this if the URL research is unavailable..."
                        className={jobUrl ? 'opacity-60' : ''}
                    />

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Pebble
                            variant="filled"
                            color="tertiary"
                            onClick={handleHolisticStrategy}
                            disabled={isGeneratingStrategy || !jobUrl || !resumeText}
                            loading={isGeneratingStrategy}
                            size="large"
                            className="px-8"
                        >
                            🚀 Generate Strategy
                        </Pebble>

                        <Pebble
                            variant="outlined"
                            onClick={handleAnalysis}
                            disabled={isAnalyzing || !resumeText || !jobDescription}
                            loading={isAnalyzing}
                            size="large"
                            className="px-8"
                        >
                            Quick ATS Check
                        </Pebble>
                    </div>
                </div>
            </Stone>

            {/* Intelligence Insights */}
            {strategyResult && strategyResult.corporate_profile && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Signal severity="info" variant="tonal" title="Strategy Summary">
                        {strategyResult.strategy_summary}
                    </Signal>

                    <Stone variant="pebble" padding="none" className="overflow-hidden border border-[var(--color-eucalypt-smoke-base)]/20">
                        <div className="p-8 bg-gradient-to-br from-[var(--ref-palette-primary-90)] to-transparent flex items-center gap-6 border-b border-white/5">
                            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Building className="w-8 h-8 text-[var(--color-wattle-gold)]" />
                            </div>
                            <div>
                                <h3 className="font-bloom text-3xl font-bold text-[var(--color-parchment)]">
                                    {strategyResult.corporate_profile.name}
                                </h3>
                                <div className="text-[var(--color-flannel-flower-dark)] text-xs font-annotation tracking-widest uppercase mt-1">
                                    Corporate Intelligence Report
                                </div>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h4 className="flex items-center gap-2 font-bloom text-xl text-[var(--color-flannel-flower)] mb-3">
                                    <Globe className="w-5 h-5" /> Our Mission
                                </h4>
                                <p className="font-field-note text-[var(--color-parchment)]/80 leading-relaxed">
                                    {strategyResult.corporate_profile.mission_statement}
                                </p>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 font-bloom text-xl text-[var(--color-flannel-flower)] mb-3">
                                    <MessageCircle className="w-5 h-5" /> Professional Voice
                                </h4>
                                <StatusBadge
                                    label={strategyResult.corporate_profile.communication_style}
                                    variant="info"
                                    showDot
                                />
                            </div>

                            <div className="md:col-span-2">
                                <h4 className="flex items-center gap-2 font-bloom text-xl text-[var(--color-flannel-flower)] mb-4">
                                    <Heart className="w-5 h-5" /> Foundational Values
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {strategyResult.corporate_profile.core_values.map((val, idx) => (
                                        <StatusBadge
                                            key={idx}
                                            label={val}
                                            variant="neutral"
                                            mode="laboratory"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Stone>
                </div>
            )}

            {/* Results Output */}
            {(strategyResult || atsResult) && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <Stone variant="tech" padding="lg" elevation={4} className="bg-[var(--color-specimen-night)] border-[var(--color-wattle-gold)]/20">
                        <StoneHeader
                            title="✨ Optimized Output"
                            subtitle="Strategic resume ready for submission."
                            icon={<Sparkles className="w-6 h-6" />}
                            action={
                                <Pebble
                                    variant="outlined"
                                    onClick={() => {
                                        navigator.clipboard.writeText(strategyResult ? strategyResult.optimized_resume.resume_text : '');
                                        m3Toast.success('Copied', 'Resume text copied to clipboard');
                                    }}
                                    startIcon={<Copy className="w-4 h-4" />}
                                >
                                    Copy
                                </Pebble>
                            }
                        />
                        <div className="mt-6 font-field-note text-base text-[var(--color-parchment)]/90 bg-white/5 p-8 rounded-[var(--radius-stone)] border border-white/5 whitespace-pre-wrap leading-relaxed shadow-inner">
                            {strategyResult ? strategyResult.optimized_resume.resume_text : 'No data generated.'}
                        </div>
                    </Stone>
                </div>
            )}
        </div>
    );
};
