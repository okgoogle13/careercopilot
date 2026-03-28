/**
 * CLASSIFICATION: Support Component Only
 * This component is for generation/analysis support and is not a canonical route.
 */
import React from 'react';
import {
  CareerDatabase,
  JobOpportunity,
  MatchAnalysis,
  CoverLetterScoreResult,
} from '../../../types/career';
import { TailoredResumeView } from './TailoredResumeView';
import { KSCResponsesView } from './KSCResponsesView';
import { AuditDisplay } from './AuditDisplay';
import { ATSScoreCard } from './ATSScoreCard';
import { CoverLetterSpecificMetrics } from './CoverLetterSpecificMetrics';
import { SuggestionsPanel } from './SuggestionsPanel';
import { TemplateSelector } from './feature/TemplateSelector';
import { AnalysisTabContent } from './feature/AnalysisTabContent';
import { ExportActionBar } from './feature/ExportActionBar';
import { MatchScoreHeader } from './feature/MatchScoreHeader';
import { useStudioMatch } from '../hooks/useStudioMatch';

interface MatchDashboardProps {
  careerData: CareerDatabase;
  job: JobOpportunity;
  onUpdate?: (data: CareerDatabase) => void;
  userId?: string;
  onAnalyze: (careerData: CareerDatabase, job: JobOpportunity) => Promise<MatchAnalysis>;
  onSave: (userId: string, data: CareerDatabase) => Promise<void>;
}

export const StudioMatchPanel: React.FC<MatchDashboardProps> = (props) => {
  const { careerData, job, onUpdate, userId, onAnalyze, onSave } = props;

  const {
    analysis,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    completedSteps,
    selectedTemplate,
    setSelectedTemplate,
    showAudit,
    setShowAudit,
    coverLetterContent,
    setCoverLetterContent,
    isSaving,
    saveSuccess,
    locale,
    setLocale,
    hasSelectionCriteria,
    resumeRef,
    kscRef,
    exportToPDF,
    exportToDOCX,
    resumeScoring,
    coverLetterScoring,
    isGeneratingCoverLetter,
    isGeneratingKSC,
    coverLetterInstructions,
    setCoverLetterInstructions,
    kscInstructions,
    setKscInstructions,
    handleAnalyze,
    handleGenerateCoverLetter,
    handleGenerateKSC,
    handleSaveToProfile,
    handleCopyToClipboard,
    unlockStep,
  } = useStudioMatch({
    careerData,
    job,
    onUpdate,
    userId,
    onAnalyze,
    onSave,
  });

  if (!analysis && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-10 rounded-[var(--sys-shape-radius-xxl)] border border-[var(--sys-color-concreteGrey-steps-0)] shadow-2xl">
          <div className="w-20 h-20 bg-cyan-900/30 rounded-[var(--sys-shape-radius-full)] flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
            <svg
              className="w-10 h-10 text-[var(--sys-color-inkGold-base)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)] mb-4">
            Job Extracted Successfully
          </h2>
          <p className="text-[var(--sys-color-worker-ash-base)] mb-8 max-w-lg mx-auto">
            We've analyzed the job posting. Now, let's see how your career database matches up and
            generate your tailored application materials.
          </p>
          <button
            onClick={handleAnalyze}
            className="bg-[var(--sys-color-solidarityRed-base)] hover:bg-[var(--sys-color-solidarityRed-steps-3)] text-[var(--sys-color-paperWhite-base)] font-bold py-4 px-12 rounded-[var(--sys-shape-radius-xl)] transition-all transform hover:scale-105 shadow-lg shadow-cyan-900/20"
          >
            Start Match Analysis
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-[var(--sys-shape-radius-full)]"></div>
          <div className="absolute inset-0 border-4 border-[var(--sys-color-inkGold-base)] border-t-transparent rounded-[var(--sys-shape-radius-full)] animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-[var(--sys-color-paperWhite-base)] mb-2">
          Analyzing Match...
        </h2>
        <p className="text-[var(--sys-color-worker-ash-base)] animate-pulse">
          Gemini is researching the company and tailoring your profile.
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <MatchScoreHeader
        analysis={analysis}
        job={job}
      />

      <ExportActionBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasSelectionCriteria={hasSelectionCriteria}
        handleAnalyze={handleAnalyze}
        showAudit={showAudit}
        setShowAudit={setShowAudit}
        userId={userId}
        handleSaveToProfile={handleSaveToProfile}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        exportToPDF={exportToPDF}
        exportToDOCX={exportToDOCX}
        handleCopyToClipboard={handleCopyToClipboard}
        completedSteps={completedSteps}
      />

      {activeTab === 'analysis' && (
        <AnalysisTabContent
          analysis={analysis}
          careerData={careerData}
          onNextStep={() => unlockStep('resume')}
        />
      )}

      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div ref={resumeRef}>
              <TailoredResumeView
                careerData={careerData}
                analysis={analysis}
                template={selectedTemplate}
                locale={locale}
                onUpdate={onUpdate}
              />
            </div>
            <div className="flex justify-end">
              {analysis.Cover_Letter_Draft ? (
                <button
                  onClick={() => unlockStep('coverLetter')}
                  className="bg-[var(--sys-color-solidarityRed-base)] hover:bg-[var(--sys-color-solidarityRed-steps-3)] text-[var(--sys-color-paperWhite-base)] font-bold py-3 px-8 rounded-[var(--sys-shape-radius-lg)] transition-colors text-lg flex items-center gap-2 shadow-lg"
                >
                  Next: View Cover Letter
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={isGeneratingCoverLetter}
                  className="bg-[var(--sys-color-solidarityRed-base)] hover:bg-[var(--sys-color-solidarityRed-steps-3)] disabled:opacity-50 text-[var(--sys-color-paperWhite-base)] font-bold py-3 px-8 rounded-[var(--sys-shape-radius-lg)] transition-colors text-lg flex items-center gap-2 shadow-lg"
                >
                  {isGeneratingCoverLetter ? 'Generating...' : 'Next: Generate Cover Letter'}
                  {!isGeneratingCoverLetter && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="xl:col-span-1 space-y-6 sticky top-8">
            <ATSScoreCard
              score={resumeScoring.score}
              isCalculating={resumeScoring.isCalculating}
              documentType="resume"
            />
            {resumeRef.current && resumeRef.current.clientHeight > 1122 && (
              <div className="bg-amber-900/40 border border-amber-500/30 p-4 rounded-[var(--sys-shape-radius-xl)]">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="w-5 h-5 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h4 className="font-bold text-amber-300">Page Length Warning</h4>
                </div>
                <p className="text-sm text-amber-200/80">
                  Your resume appears to be longer than one page. Consider trimming older experience
                  or less relevant skills to improve ATS readability.
                </p>
              </div>
            )}
            {showAudit && analysis.Resume_Audit && (
              <AuditDisplay
                audit={analysis.Resume_Audit}
                title="Resume"
              />
            )}
            <SuggestionsPanel
              score={resumeScoring.score}
              documentType="resume"
            />
          </div>
        </div>
      )}

      {activeTab === 'coverLetter' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div
              className="bg-[var(--sys-color-paperWhite-base)] p-10 shadow-lg"
              style={{ fontFamily: selectedTemplate.fontSans, color: selectedTemplate.textColor }}
            >
              <h1
                className="text-3xl font-bold uppercase mb-8 border-b-2 pb-4"
                style={{
                  color: selectedTemplate.primaryColor,
                  borderColor: selectedTemplate.primaryColor,
                }}
              >
                Cover Letter
              </h1>
              <textarea
                className="w-full h-[600px] bg-transparent text-[var(--sys-color-charcoalBackground-base)] p-0 border-none focus:outline-none leading-relaxed resize-none"
                value={coverLetterContent}
                onChange={(e) => setCoverLetterContent(e.target.value)}
              />
            </div>

            <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 rounded-[var(--sys-shape-radius-xl)] border border-[var(--sys-color-concreteGrey-steps-0)] shadow-lg">
              <label className="block text-sm font-medium text-[var(--sys-color-worker-ash-base)] mb-3">
                Not quite right? Tell the AI what to change (e.g., 'Make it more formal' or 'Focus
                more on leadership').
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={coverLetterInstructions}
                  onChange={(e) => setCoverLetterInstructions(e.target.value)}
                  placeholder="Enter instructions for regeneration..."
                  className="flex-1 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-concreteGrey-steps-0)] rounded-[var(--sys-shape-radius-lg)] px-4 py-3 text-[var(--sys-color-paperWhite-base)] focus:outline-none focus:border-cyan-500/50"
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      coverLetterInstructions.trim() &&
                      !isGeneratingCoverLetter
                    ) {
                      handleGenerateCoverLetter();
                    }
                  }}
                />
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={isGeneratingCoverLetter || !coverLetterInstructions.trim()}
                  className="bg-cyan-900/30 hover:bg-cyan-800/40 text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-[var(--sys-shape-radius-lg)] font-medium transition-colors border border-cyan-500/30 flex items-center gap-2"
                >
                  {isGeneratingCoverLetter ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => unlockStep('export')}
                className="bg-transparent hover:bg-[var(--sys-color-charcoalBackground-steps-2)] text-[var(--sys-color-worker-ash-base)] font-bold py-3 px-6 rounded-[var(--sys-shape-radius-lg)] transition-colors text-lg border border-[var(--sys-color-outline-variant)]"
              >
                Skip to Export
              </button>
              {analysis.KSC_Responses_Drafts && analysis.KSC_Responses_Drafts.length > 0 ? (
                <button
                  onClick={() => unlockStep('ksc')}
                  className="bg-[var(--sys-color-solidarityRed-base)] hover:bg-[var(--sys-color-solidarityRed-steps-3)] text-[var(--sys-color-paperWhite-base)] font-bold py-3 px-8 rounded-[var(--sys-shape-radius-lg)] transition-colors text-lg flex items-center gap-2 shadow-lg"
                >
                  Next: View KSC Responses
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleGenerateKSC}
                  disabled={isGeneratingKSC}
                  className="bg-[var(--sys-color-solidarityRed-base)] hover:bg-[var(--sys-color-solidarityRed-steps-3)] disabled:opacity-50 text-[var(--sys-color-paperWhite-base)] font-bold py-3 px-8 rounded-[var(--sys-shape-radius-lg)] transition-colors text-lg flex items-center gap-2 shadow-lg"
                >
                  {isGeneratingKSC ? 'Generating...' : 'Next: Generate KSC Responses'}
                  {!isGeneratingKSC && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="xl:col-span-1 space-y-6 sticky top-8">
            <ATSScoreCard
              score={coverLetterScoring.score}
              isCalculating={coverLetterScoring.isCalculating}
              documentType="coverLetter"
            />
            {coverLetterScoring.score && (
              <CoverLetterSpecificMetrics
                score={coverLetterScoring.score as CoverLetterScoreResult}
                wordCount={coverLetterContent.split(/\s+/).length}
              />
            )}
            {showAudit && analysis.Cover_Letter_Audit && (
              <AuditDisplay
                audit={analysis.Cover_Letter_Audit}
                title="Cover Letter"
              />
            )}
            <SuggestionsPanel
              score={coverLetterScoring.score}
              documentType="coverLetter"
            />
          </div>
        </div>
      )}

      {activeTab === 'ksc' && (
        <div className="flex flex-col gap-6">
          <div ref={kscRef}>
            <KSCResponsesView
              analysis={analysis}
              template={selectedTemplate}
            />
          </div>
          <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 rounded-[var(--sys-shape-radius-xl)] border border-[var(--sys-color-concreteGrey-steps-0)] shadow-lg">
            <label className="block text-sm font-medium text-[var(--sys-color-worker-ash-base)] mb-3">
              Not quite right? Tell the AI what to change for all KSC responses.
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={kscInstructions}
                onChange={(e) => setKscInstructions(e.target.value)}
                placeholder="Enter instructions for regeneration..."
                className="flex-1 bg-[var(--sys-color-charcoalBackground-steps-2)] border border-[var(--sys-color-concreteGrey-steps-0)] rounded-[var(--sys-shape-radius-lg)] px-4 py-3 text-[var(--sys-color-paperWhite-base)] focus:outline-none focus:border-cyan-500/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && kscInstructions.trim() && !isGeneratingKSC) {
                    handleGenerateKSC();
                  }
                }}
              />
              <button
                onClick={handleGenerateKSC}
                disabled={isGeneratingKSC || !kscInstructions.trim()}
                className="bg-cyan-900/30 hover:bg-cyan-800/40 text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-[var(--sys-shape-radius-lg)] font-medium transition-colors border border-cyan-500/30 flex items-center gap-2"
              >
                {isGeneratingKSC ? 'Regenerating...' : 'Regenerate'}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => unlockStep('export')}
              className="bg-[var(--sys-color-solidarityRed-base)] hover:bg-[var(--sys-color-solidarityRed-steps-3)] text-[var(--sys-color-paperWhite-base)] font-bold py-3 px-8 rounded-[var(--sys-shape-radius-lg)] transition-colors text-lg flex items-center gap-2 shadow-lg"
            >
              Next: Preview & Export
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="flex flex-col gap-8">
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            locale={locale}
            setLocale={setLocale}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 rounded-[var(--sys-shape-radius-xl)] border border-[var(--sys-color-concreteGrey-steps-0)] shadow-lg flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cyan-900/30 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30">
                <svg
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] mb-2">
                Tailored Resume
              </h3>
              <p className="text-[var(--sys-color-worker-ash-base)] text-sm mb-6 flex-1">
                Your resume, optimized for ATS and tailored to the job description.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => exportToPDF('resume')}
                  className="flex-1 bg-cyan-900/30 hover:bg-cyan-800/40 text-cyan-400 px-4 py-2 rounded-lg font-medium transition-colors border border-cyan-500/30"
                >
                  PDF
                </button>
                <button
                  onClick={() => exportToDOCX('resume')}
                  className="flex-1 bg-cyan-900/30 hover:bg-cyan-800/40 text-cyan-400 px-4 py-2 rounded-lg font-medium transition-colors border border-cyan-500/30"
                >
                  DOCX
                </button>
              </div>
            </div>

            <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 rounded-[var(--sys-shape-radius-xl)] border border-[var(--sys-color-concreteGrey-steps-0)] shadow-lg flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-900/30 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
                <svg
                  className="w-8 h-8 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] mb-2">
                Cover Letter
              </h3>
              <p className="text-[var(--sys-color-worker-ash-base)] text-sm mb-6 flex-1">
                A compelling narrative connecting your experience to their needs.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => exportToPDF('coverLetter')}
                  className="flex-1 bg-amber-900/30 hover:bg-amber-800/40 text-amber-400 px-4 py-2 rounded-lg font-medium transition-colors border border-amber-500/30"
                >
                  PDF
                </button>
                <button
                  onClick={() => exportToDOCX('coverLetter')}
                  className="flex-1 bg-amber-900/30 hover:bg-amber-800/40 text-amber-400 px-4 py-2 rounded-lg font-medium transition-colors border border-amber-500/30"
                >
                  DOCX
                </button>
              </div>
            </div>

            {hasSelectionCriteria && (
              <div className="bg-[var(--sys-color-charcoalBackground-steps-1)] p-6 rounded-[var(--sys-shape-radius-xl)] border border-[var(--sys-color-concreteGrey-steps-0)] shadow-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
                  <svg
                    className="w-8 h-8 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] mb-2">
                  KSC Responses
                </h3>
                <p className="text-[var(--sys-color-worker-ash-base)] text-sm mb-6 flex-1">
                  Detailed STAR-method responses to key selection criteria.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => exportToPDF('ksc')}
                    className="flex-1 bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-400 px-4 py-2 rounded-lg font-medium transition-colors border border-emerald-500/30"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => exportToDOCX('ksc')}
                    className="flex-1 bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-400 px-4 py-2 rounded-lg font-medium transition-colors border border-emerald-500/30"
                  >
                    DOCX
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-[var(--sys-color-paperWhite-base)] mb-4">
              Resume Preview
            </h3>
            <div className="opacity-75 pointer-events-none transform scale-95 origin-top">
              <TailoredResumeView
                careerData={careerData}
                analysis={analysis}
                template={selectedTemplate}
                locale={locale}
                onUpdate={onUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
