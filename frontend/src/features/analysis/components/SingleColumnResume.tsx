/**
 * SingleColumnResume — DOC3 Harvest
 * ATS-optimised single-column resume layout. Renders inside a white
 * print surface so intentionally uses light-mode colours from template tokens,
 * NOT KR Solidarity dark-mode tokens.
 */
import React from 'react';
import type { CareerDatabase, MatchAnalysis, StructuredAchievement } from '../../../types/career';
import type { TemplateStyle } from '../../../config/resume-constants';

interface SingleColumnResumeProps {
  careerData: CareerDatabase;
  analysis: MatchAnalysis;
  template: TemplateStyle;
  locale: 'US' | 'UK/AU';
  achievements: StructuredAchievement[];
  suggestions: Record<string, string>;
  isPolishing: string | null;
  formatDate: (dateString: string) => string;
  getAchievementsForEntry: (entryId: string) => StructuredAchievement[];
  applySuggestion: (achId: string, field: keyof StructuredAchievement) => void;
  discardSuggestion: (achId: string, field: keyof StructuredAchievement) => void;
  handlePolish: (achId: string, field: keyof StructuredAchievement) => void;
  workEntries: any[];
  educationEntries: any[];
  tailoredSummary: string;
  setTailoredSummary: (summary: string) => void;
}

export const SingleColumnResume: React.FC<SingleColumnResumeProps> = ({
  careerData,
  analysis,
  template,
  achievements,
  suggestions,
  isPolishing,
  formatDate,
  getAchievementsForEntry,
  applySuggestion,
  discardSuggestion,
  handlePolish,
  workEntries,
  educationEntries,
  tailoredSummary,
  setTailoredSummary,
}) => {
  const { Personal_Information, Master_Skills_Inventory } = careerData;

  const sectionHeadingStyle: React.CSSProperties = {
    color: template.headingColor,
    borderColor: template.borderColor,
    fontFamily: template.fontSerif,
  };

  return (
    <>
      {/* Professional Summary */}
      <div className="mb-8">
        <h2
          className="text-xl font-bold uppercase border-b mb-3 pb-1 tracking-wide"
          style={sectionHeadingStyle}
        >
          Professional Summary
        </h2>
        <textarea
          className="w-full text-sm leading-relaxed bg-transparent border-none focus:outline-none resize-none overflow-hidden"
          value={tailoredSummary}
          onChange={(e) => {
            setTailoredSummary(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onFocus={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          rows={4}
        />
      </div>

      {/* Core Competencies */}
      <div className="mb-8">
        <h2
          className="text-xl font-bold uppercase border-b mb-3 pb-1 tracking-wide"
          style={sectionHeadingStyle}
        >
          Core Competencies
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {Master_Skills_Inventory.filter(
            (s) =>
              s.Proficiency === 'Expert' ||
              s.Proficiency === 'Master' ||
              s.Proficiency === 'Proficient'
          )
            .slice(0, 20)
            .map((skill, i) => {
              const isMatched = analysis.Skill_Gaps.some(
                (g) =>
                  g.Skill.toLowerCase() === skill.Skill_Name.toLowerCase() &&
                  g.Match_Level === 'Strong'
              );
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5"
                >
                  <div
                    className="w-1.5 h-1.5"
                    style={{
                      backgroundColor: isMatched ? template.accentColor : template.borderColor,
                      borderRadius: 'var(--sys-shape-blockRiot01)',
                    }}
                  />
                  <span className={`text-sm ${isMatched ? 'font-bold' : ''}`}>
                    {skill.Skill_Name}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Professional Experience */}
      <div className="mb-8">
        <h2
          className="text-xl font-bold uppercase border-b mb-4 pb-1 tracking-wide"
          style={sectionHeadingStyle}
        >
          Professional Experience
        </h2>
        <div className="space-y-8">
          {workEntries.map((entry, i) => {
            const entryAchievements = getAchievementsForEntry(entry.Entry_ID);
            if (entryAchievements.length === 0) return null;

            return (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3
                    className="text-lg font-bold"
                    style={{ color: template.primaryColor }}
                  >
                    {entry.Role}
                  </h3>
                  <span className="text-sm font-bold opacity-80">
                    {formatDate(entry.StartDate)} – {formatDate(entry.EndDate)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-3">
                  <span
                    className="text-sm font-bold italic"
                    style={{ color: template.secondaryColor }}
                  >
                    {entry.Organization}
                  </span>
                  <span className="text-sm opacity-60 italic">{entry.Location}</span>
                </div>

                <ul className="list-none ml-0 space-y-2">
                  {entryAchievements.map((ach, j) => {
                    const isRecommended = analysis.Recommended_Achievement_IDs.includes(
                      ach.Achievement_ID
                    );
                    const suggestionKey = `${ach.Achievement_ID}-Outcome`;
                    const hasSuggestion = Boolean(suggestions[suggestionKey]);

                    return (
                      <li
                        key={j}
                        className={`text-[11pt] leading-relaxed group relative ${
                          isRecommended ? 'font-medium' : 'opacity-90'
                        }`}
                      >
                        <span
                          className="mr-2"
                          style={{ color: template.accentColor }}
                        >
                          •
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: template.primaryColor }}
                        >
                          {ach.Action_Verb}
                        </span>{' '}
                        {ach.Noun_Task} {ach.Strategy} resulting in{' '}
                        {suggestions[suggestionKey] || ach.Outcome}.
                        {isRecommended && (
                          <span
                            className="inline-block ml-2 w-1.5 h-1.5"
                            style={{
                              backgroundColor: template.accentColor,
                              borderRadius: 'var(--sys-shape-blockRiot01)',
                            }}
                            title="Highly relevant to this job"
                          />
                        )}
                        <div className="absolute -right-24 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          {hasSuggestion ? (
                            <>
                              <button
                                onClick={() => applySuggestion(ach.Achievement_ID, 'Outcome')}
                                className="p-1 bg-[var(--kr-color-charcoal-background-steps-2)] hover:bg-[var(--kr-color-charcoal-background-steps-3)] text-[var(--kr-color-ink-gold-base)]"
                                style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                                title="Apply suggestion"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => discardSuggestion(ach.Achievement_ID, 'Outcome')}
                                className="p-1 bg-red-100 hover:bg-red-200 text-red-700"
                                style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                                title="Discard suggestion"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handlePolish(ach.Achievement_ID, 'Outcome')}
                              disabled={isPolishing === suggestionKey}
                              className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
                              title="AI polish outcome"
                            >
                              {isPolishing === suggestionKey ? (
                                <svg
                                  className="animate-spin h-3 w-3"
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
                              ) : (
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                  />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Education */}
      {educationEntries.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xl font-bold uppercase border-b mb-3 pb-1 tracking-wide"
            style={sectionHeadingStyle}
          >
            Education
          </h2>
          <div className="space-y-4">
            {educationEntries.map((entry, i) => (
              <div
                key={i}
                className="flex justify-between items-baseline"
              >
                <div>
                  <h3
                    className="text-sm font-bold"
                    style={{ color: template.primaryColor }}
                  >
                    {entry.Role}
                  </h3>
                  <span className="text-sm opacity-80">{entry.Organization}</span>
                </div>
                <span className="text-sm font-bold opacity-60">{formatDate(entry.EndDate)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
