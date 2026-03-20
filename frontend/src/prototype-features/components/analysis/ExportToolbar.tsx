/* eslint-disable */
import React from 'react';

type TabKey = 'resume' | 'coverLetter' | 'ksc';

interface ExportToolbarProps {
  activeTab: TabKey;
  showAudit: boolean;
  onToggleAudit: () => void;
  onRescore: () => void;
  onSaveToProfile: () => void;
  onCopy: () => void;
  onExportPDF: () => void;
  onExportDOCX: () => void;
  onExportMarkdown: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  hasUser: boolean;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  activeTab,
  showAudit,
  onToggleAudit,
  onRescore,
  onSaveToProfile,
  onCopy,
  onExportPDF,
  onExportDOCX,
  isSaving,
  saveSuccess,
  hasUser,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end pb-3 md:pb-2 pr-2">
      {/* Save & Rescore FAB */}
      <button
        onClick={onRescore}
        className="fixed bottom-20 right-4 md:static md:bottom-auto md:right-auto z-50 flex items-center gap-2 bg-[var(--sys-color-charcoalBackground-steps-3)] hover:bg-[var(--sys-color-charcoalBackground-steps-4)] text-[var(--sys-color-paperWhite-base)] font-bold py-4 px-6 md:py-2 md:px-4 rounded-2xl md:rounded-full transition-colors shadow-lg md:shadow-none border border-[var(--sys-color-outline-variant)]"
      >
        <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Save & Rescore
      </button>

      {(activeTab === 'resume' || activeTab === 'coverLetter' || activeTab === 'ksc') && (
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-end">
          {/* Audit toggle */}
          {(activeTab === 'resume' || activeTab === 'coverLetter') && (
            <button
              onClick={onToggleAudit}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors border ${
                showAudit
                  ? 'bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)] border-[var(--sys-color-solidarityRed-base)]'
                  : 'bg-transparent text-[var(--sys-color-paperWhite-base)] border-[var(--sys-color-outline-variant)] hover:bg-[var(--sys-color-charcoalBackground-steps-2)]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Save to Profile */}
          {activeTab === 'coverLetter' && hasUser && (
            <button
              onClick={onSaveToProfile}
              disabled={isSaving || saveSuccess}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors border ${
                saveSuccess
                  ? 'bg-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-paperWhite-base)] border-[var(--sys-color-solidarityRed-base)]'
                  : 'bg-transparent text-[var(--sys-color-paperWhite-base)] border-[var(--sys-color-outline-variant)] hover:bg-[var(--sys-color-charcoalBackground-steps-2)]'
              }`}
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
                  <span className="hidden sm:inline">Saving...</span>
                </span>
              ) : saveSuccess ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Copy to Clipboard */}
          <button
            onClick={onCopy}
            className="border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-2)] px-4 py-2 rounded-full text-sm font-medium transition-colors"
            title="Copy Text"
          >
            Copy to Clipboard for ATS
          </button>

          {/* PDF */}
          <button
            onClick={onExportPDF}
            className="border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-2)] px-3 py-2 rounded-full text-sm font-medium transition-colors"
          >
            PDF
          </button>

          {/* DOCX */}
          <button
            onClick={onExportDOCX}
            className="border border-[var(--sys-color-outline-variant)] text-[var(--sys-color-paperWhite-base)] hover:bg-[var(--sys-color-charcoalBackground-steps-2)] px-3 py-2 rounded-full text-sm font-medium transition-colors"
          >
            DOCX
          </button>
        </div>
      )}
    </div>
  );
};
