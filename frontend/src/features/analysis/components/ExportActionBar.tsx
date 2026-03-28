/**
 * ExportActionBar — DOC2 Harvest
 * Sticky tab/action bar for the analysis workbench: navigates between
 * analysis, resume, cover letter, KSC, and export tabs; also houses
 * quick-action buttons (Save & Rescore, Audit toggle, PDF/DOCX export).
 *
 * KR Solidarity v6.0 compliant — semantic tokens only.
 */
import React from 'react';
import type { DocumentType } from '../../../types/career';

/** Union of all navigable workbench tabs. */
export type WorkbenchTab = DocumentType | 'analysis' | 'ksc' | 'export';

interface ExportActionBarProps {
  activeTab: WorkbenchTab | string;
  setActiveTab: (tab: WorkbenchTab | string) => void;
  hasSelectionCriteria: boolean;
  handleAnalyze: () => void;
  showAudit: boolean;
  setShowAudit: (show: boolean) => void;
  userId?: string;
  handleSaveToProfile: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  exportToPDF: () => void;
  exportToDOCX: () => void;
  handleCopyToClipboard: () => void;
  completedSteps: string[];
}

const TAB_DEFS = [
  { key: 'analysis', label: 'Analysis' },
  { key: 'resume', label: 'Resume' },
  { key: 'coverLetter', label: 'Cover Letter' },
  { key: 'ksc', label: 'KSC Responses', requiresKsc: true },
  { key: 'export', label: 'Preview & Export' },
] as const;

export const ExportActionBar: React.FC<ExportActionBarProps> = ({
  activeTab,
  setActiveTab,
  hasSelectionCriteria,
  handleAnalyze,
  showAudit,
  setShowAudit,
  userId,
  handleSaveToProfile,
  isSaving,
  saveSuccess,
  exportToPDF,
  exportToDOCX,
  handleCopyToClipboard,
  completedSteps,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-end border-b border-[var(--sys-color-outline-variant)] pb-0 sticky top-0 bg-[var(--sys-color-charcoalBackground-base)] z-40 pt-4">
      {/* Tab navigation */}
      <div className="flex w-full md:w-auto overflow-x-auto scrollbar-hide">
        {TAB_DEFS.map((tab) => {
          const isKscTab = 'requiresKsc' in tab && tab.requiresKsc === true;
          if (isKscTab && (!hasSelectionCriteria || !completedSteps.includes(tab.key))) return null;
          if (!isKscTab && !completedSteps.includes(tab.key)) return null;
          const { key, label } = tab;

          const isActive = activeTab === key;
          return (
            <button
              key={key}
              id={`workbench-tab-${key}`}
              onClick={() => setActiveTab(key)}
              className={`relative flex-1 md:flex-none px-6 py-3 text-sm font-medium transition-colors font-primary whitespace-nowrap ${
                isActive
                  ? 'text-[var(--sys-color-paperWhite-base)]'
                  : 'text-[var(--sys-color-worker-ash-base)] hover:text-[var(--sys-color-paperWhite-base)]'
              }`}
            >
              {label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--sys-color-solidarityRed-base)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end pb-3 md:pb-2 pr-2">
        {/* Save & Rescore — always visible */}
        <button
          id="workbench-action-rescore"
          onClick={handleAnalyze}
          className="fixed bottom-20 right-4 md:static md:bottom-auto md:right-auto z-50 flex items-center gap-2 bg-[var(--sys-color-charcoalBackground-steps-3)] hover:bg-[var(--sys-color-charcoalBackground-steps-4)] text-[var(--sys-color-paperWhite-base)] font-bold py-4 px-6 md:py-2 md:px-4 transition-colors shadow-lg md:shadow-none border border-[var(--sys-color-outline-variant)]"
          style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
        >
          Save &amp; Rescore
        </button>

        {/* Document-level actions */}
        {(activeTab === 'resume' || activeTab === 'coverLetter' || activeTab === 'ksc') && (
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
            {/* Audit toggle — resume and cover letter */}
            {(activeTab === 'resume' || activeTab === 'coverLetter') && (
              <button
                id="workbench-action-audit"
                onClick={() => setShowAudit(!showAudit)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border ${
                  showAudit
                    ? 'bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)] border-[var(--sys-color-solidarityRed-base)]'
                    : 'bg-transparent text-[var(--sys-color-paperWhite-base)] border-[var(--sys-color-outline-variant)] hover:bg-[var(--sys-color-charcoalBackground-steps-2)]'
                }`}
                style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
              >
                <svg
                  className="w-4 h-4"
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
                <span className="hidden sm:inline">{showAudit ? 'Hide Audit' : 'Show Audit'}</span>
                <span className="sm:hidden">Audit</span>
              </button>
            )}

            {/* Save to profile — cover letter, authenticated users only */}
            {activeTab === 'coverLetter' && userId && (
              <button
                id="workbench-action-save-profile"
                onClick={handleSaveToProfile}
                disabled={isSaving || saveSuccess}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border ${
                  saveSuccess
                    ? 'bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)] border-[var(--sys-color-solidarityRed-base)]'
                    : 'bg-transparent text-[var(--sys-color-paperWhite-base)] border-[var(--sys-color-outline-variant)] hover:bg-[var(--sys-color-charcoalBackground-steps-2)]'
                }`}
                style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
              >
                {isSaving ? (
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="hidden sm:inline">Saving…</span>
                  </span>
                ) : saveSuccess ? (
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="hidden sm:inline">Saved!</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    <span className="hidden sm:inline">Save</span>
                  </span>
                )}
              </button>
            )}

            {/* ATS clipboard, PDF, DOCX */}
            <button
              id="workbench-action-copy-clipboard"
              onClick={handleCopyToClipboard}
              className="border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-2)] px-4 py-2 text-sm font-medium transition-colors"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              Copy to Clipboard
            </button>
            <button
              id="workbench-action-export-pdf"
              onClick={exportToPDF}
              className="border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-2)] px-3 py-2 text-sm font-medium transition-colors"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              PDF
            </button>
            <button
              id="workbench-action-export-docx"
              onClick={exportToDOCX}
              className="border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-2)] px-3 py-2 text-sm font-medium transition-colors"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              DOCX
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
