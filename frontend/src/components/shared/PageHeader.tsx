import React from 'react';

/**
 * PageHeader Component - KR Solidarity v6.0
 * Standardized header for all feature pages and prototype surfaces.
 */
export interface PageHeaderProps {
  /** Main title of the page */
  title: string;
  /** Primary subtitle (Production standard) */
  subtitle?: string;
  /** Specific word within the title to highlight with Ink Gold (Prototype standard) */
  highlightedWord?: string;
  /** Descriptive text, used as subtitle if subtitle is missing (Prototype standard) */
  description?: string;
}

export const PageHeader = ({ title, subtitle, highlightedWord, description }: PageHeaderProps) => {
  // Use subtitle if provided, otherwise fall back to description for prototype compatibility
  const displaySubtitle = subtitle || description;

  /**
   * Renders the title with a highlighted span if highlightedWord is found.
   */
  const renderTitle = () => {
    if (!highlightedWord || !title.includes(highlightedWord)) {
      return title;
    }

    // Split the title into parts around the highlighted word
    // We only highlight the first occurrence to maintain design intent
    const index = title.indexOf(highlightedWord);
    const before = title.substring(0, index);
    const after = title.substring(index + highlightedWord.length);

    return (
      <>
        {before}
        <span className="text-[var(--sys-color-inkGold-base)]">{highlightedWord}</span>
        {after}
      </>
    );
  };

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-[var(--sys-color-paperWhite-base)] type-solidarityProtest">
        {renderTitle()}
      </h1>
      {displaySubtitle && (
        <p className="text-[var(--sys-color-worker-ash-base)] opacity-70 mt-2">{displaySubtitle}</p>
      )}
    </header>
  );
};
