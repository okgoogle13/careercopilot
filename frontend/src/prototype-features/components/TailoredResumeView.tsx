/* eslint-disable */
/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React, { useState } from 'react';
import { CareerDatabase, MatchAnalysis, StructuredAchievement } from '../types';
import { TemplateStyle } from '../constants';
import { refineAchievementField } from '../services/geminiService';

interface TailoredResumeViewProps {
  careerData: CareerDatabase;
  analysis: MatchAnalysis;
  template: TemplateStyle;
  locale?: 'US' | 'UK/AU';
}

export const TailoredResumeView: React.FC<TailoredResumeViewProps> = ({
  careerData,
  analysis,
  template,
  locale = 'US',
}) => {
  const { Personal_Information, Career_Entries, Structured_Achievements, Master_Skills_Inventory } =
    careerData;
  const [achievements, setAchievements] =
    useState<StructuredAchievement[]>(Structured_Achievements);
  const [isPolishing, setIsPolishing] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    if (locale === 'US') {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    }
  };

  const handlePolish = async (achId: string, field: keyof StructuredAchievement) => {
    setIsPolishing(`${achId}-${field}`);
    try {
      const ach = achievements.find((a) => a.Achievement_ID === achId);
      if (!ach) return;
      const polishedText = await refineAchievementField(ach, field);
      setSuggestions((prev) => ({ ...prev, [`${achId}-${field}`]: polishedText }));
    } catch (error) {
      console.error('Failed to polish text:', error);
      alert('Failed to polish text. Please try again.');
    } finally {
      setIsPolishing(null);
    }
  };

  const applySuggestion = (achId: string, field: keyof StructuredAchievement) => {
    const suggestion = suggestions[`${achId}-${field}`];
    if (!suggestion) return;
    setAchievements((prev) =>
      prev.map((a) => (a.Achievement_ID === achId ? { ...a, [field]: suggestion } : a))
    );
    setSuggestions((prev) => {
      const next = { ...prev };
      delete next[`${achId}-${field}`];
      return next;
    });
  };

  const discardSuggestion = (achId: string, field: keyof StructuredAchievement) => {
    setSuggestions((prev) => {
      const next = { ...prev };
      delete next[`${achId}-${field}`];
      return next;
    });
  };

  // Filter and sort achievements: recommended ones first, then others, grouped by Entry_ID
  const getAchievementsForEntry = (entryId: string) => {
    const entryAchievements = achievements.filter((a) => a.Entry_ID === entryId);

    // Sort so recommended achievements appear first
    return entryAchievements.sort((a, b) => {
      const aIsRecommended = analysis.Recommended_Achievement_IDs.includes(a.Achievement_ID);
      const bIsRecommended = analysis.Recommended_Achievement_IDs.includes(b.Achievement_ID);
      if (aIsRecommended && !bIsRecommended) return -1;
      if (!aIsRecommended && bIsRecommended) return 1;
      return 0;
    });
  };

  const workEntries = Career_Entries.filter((e) => e.Entry_Type === 'Work Experience').sort(
    (a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime()
  );

  const educationEntries = Career_Entries.filter((e) => e.Entry_Type === 'Education');

  return (
    <div
      className="bg-white p-10 shadow-lg max-w-4xl mx-auto"
      style={{
        fontFamily: template.fontSans,
        color: template.textColor,
        lineHeight: '1.5',
      }}
    >
      {/* Header - ATS Friendly */}
      <div
        className="text-center mb-8 border-b-2 pb-6"
        style={{ borderColor: template.primaryColor }}
      >
        <h1
          className="text-4xl font-bold uppercase tracking-tight mb-2"
          style={{ color: template.primaryColor }}
        >
          {Personal_Information.FullName}
        </h1>
        {analysis.Headline_Suggestion && (
          <h2
            className="text-xl font-medium mb-4"
            style={{ color: template.secondaryColor }}
          >
            {analysis.Headline_Suggestion}
          </h2>
        )}
        {template.layout === 'single' && (
          <div className="text-sm flex flex-wrap justify-center gap-4 font-medium">
            <span>{Personal_Information.Email}</span>
            <span style={{ color: template.accentColor }}>•</span>
            <span>{Personal_Information.Phone}</span>
            <span style={{ color: template.accentColor }}>•</span>
            <span>{Personal_Information.Location}</span>
          </div>
        )}
        {template.layout === 'single' &&
          Personal_Information.Portfolio_Website_URLs?.length > 0 && (
            <div
              className="text-sm mt-2 font-semibold"
              style={{ color: template.secondaryColor }}
            >
              {Personal_Information.Portfolio_Website_URLs.join(' | ')}
            </div>
          )}
      </div>

      {template.layout === 'single' ? (
        <>
          {/* Professional Summary */}
          <div className="mb-8">
            <h2
              className="text-xl font-bold uppercase border-b mb-3 pb-1 tracking-wide"
              style={{
                color: template.headingColor,
                borderColor: template.borderColor,
                fontFamily: template.fontSerif,
              }}
            >
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed">{analysis.Tailored_Summary}</p>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2
              className="text-xl font-bold uppercase border-b mb-3 pb-1 tracking-wide"
              style={{
                color: template.headingColor,
                borderColor: template.borderColor,
                fontFamily: template.fontSerif,
              }}
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
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: isMatched ? template.accentColor : template.borderColor,
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
              style={{
                color: template.headingColor,
                borderColor: template.borderColor,
                fontFamily: template.fontSerif,
              }}
            >
              Professional Experience
            </h2>
            <div className="space-y-8">
              {workEntries.map((entry, i) => {
                const achievements = getAchievementsForEntry(entry.Entry_ID);
                if (achievements.length === 0) return null;

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
                      {achievements.map((ach, j) => {
                        const isRecommended = analysis.Recommended_Achievement_IDs.includes(
                          ach.Achievement_ID
                        );
                        return (
                          <li
                            key={j}
                            className={`text-[11pt] leading-relaxed group relative ${isRecommended ? 'font-medium' : 'opacity-90'}`}
                          >
                            - <span className="font-bold text-cyan-600">{ach.Action_Verb}</span>{' '}
                            {ach.Noun_Task} {ach.Strategy} resulting in{' '}
                            {suggestions[`${ach.Achievement_ID}-Outcome`] || ach.Outcome}.
                            {isRecommended && (
                              <span
                                className="inline-block ml-2 w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: template.accentColor }}
                                title="Highly relevant to this job"
                              />
                            )}
                            <div className="absolute -right-24 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              {suggestions[`${ach.Achievement_ID}-Outcome`] ? (
                                <>
                                  <button
                                    onClick={() => applySuggestion(ach.Achievement_ID, 'Outcome')}
                                    className="p-1 bg-green-100 hover:bg-green-200 rounded text-green-700"
                                    title="Apply"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={() => discardSuggestion(ach.Achievement_ID, 'Outcome')}
                                    className="p-1 bg-red-100 hover:bg-red-200 rounded text-red-700"
                                    title="Discard"
                                  >
                                    ✕
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handlePolish(ach.Achievement_ID, 'Outcome')}
                                  disabled={isPolishing === `${ach.Achievement_ID}-Outcome`}
                                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                                  title="AI Polish Outcome"
                                >
                                  {isPolishing === `${ach.Achievement_ID}-Outcome` ? (
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
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
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
                style={{
                  color: template.headingColor,
                  borderColor: template.borderColor,
                  fontFamily: template.fontSerif,
                }}
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
                    <span className="text-sm font-bold opacity-60">
                      {formatDate(entry.EndDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column (Primary) - 65% */}
          <div className="md:col-span-2 space-y-8">
            {/* Contact Info in Left Column for Two-Column */}
            <div className="space-y-1">
              <h2
                className="text-sm font-bold uppercase tracking-widest mb-2"
                style={{ color: template.secondaryColor }}
              >
                Contact Information
              </h2>
              <div className="text-sm space-y-1">
                <p>{Personal_Information.Email}</p>
                <p>{Personal_Information.Phone}</p>
                <p>{Personal_Information.Location}</p>
                {Personal_Information.Portfolio_Website_URLs?.map((url, idx) => (
                  <p
                    key={idx}
                    className="truncate"
                  >
                    {url}
                  </p>
                ))}
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <h2
                className="text-lg font-bold uppercase border-b mb-3 pb-1 tracking-wide"
                style={{
                  color: template.headingColor,
                  borderColor: template.borderColor,
                  fontFamily: template.fontSerif,
                }}
              >
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed">{analysis.Tailored_Summary}</p>
            </div>

            {/* Professional Experience */}
            <div>
              <h2
                className="text-lg font-bold uppercase border-b mb-4 pb-1 tracking-wide"
                style={{
                  color: template.headingColor,
                  borderColor: template.borderColor,
                  fontFamily: template.fontSerif,
                }}
              >
                Work Experience
              </h2>
              <div className="space-y-6">
                {workEntries.map((entry, i) => {
                  const achievements = getAchievementsForEntry(entry.Entry_ID);
                  if (achievements.length === 0) return null;

                  return (
                    <div key={i}>
                      <div className="mb-1">
                        <h3
                          className="text-md font-bold"
                          style={{ color: template.primaryColor }}
                        >
                          {entry.Role}
                        </h3>
                        <div className="flex justify-between text-xs font-bold opacity-70">
                          <span>{entry.Organization}</span>
                          <span>
                            {formatDate(entry.StartDate)} – {formatDate(entry.EndDate)}
                          </span>
                        </div>
                      </div>

                      <ul className="list-none ml-0 space-y-1.5">
                        {achievements.map((ach, j) => {
                          const isRecommended = analysis.Recommended_Achievement_IDs.includes(
                            ach.Achievement_ID
                          );
                          return (
                            <li
                              key={j}
                              className={`text-[10pt] leading-relaxed group relative ${isRecommended ? 'font-medium' : 'opacity-90'}`}
                            >
                              - <span className="font-bold text-cyan-600">{ach.Action_Verb}</span>{' '}
                              {ach.Noun_Task} {ach.Strategy} resulting in{' '}
                              {suggestions[`${ach.Achievement_ID}-Outcome`] || ach.Outcome}.
                              <div className="absolute -right-24 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                {suggestions[`${ach.Achievement_ID}-Outcome`] ? (
                                  <>
                                    <button
                                      onClick={() => applySuggestion(ach.Achievement_ID, 'Outcome')}
                                      className="p-1 bg-green-100 hover:bg-green-200 rounded text-green-700"
                                      title="Apply"
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() =>
                                        discardSuggestion(ach.Achievement_ID, 'Outcome')
                                      }
                                      className="p-1 bg-red-100 hover:bg-red-200 rounded text-red-700"
                                      title="Discard"
                                    >
                                      ✕
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handlePolish(ach.Achievement_ID, 'Outcome')}
                                    disabled={isPolishing === `${ach.Achievement_ID}-Outcome`}
                                    className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                                    title="AI Polish Outcome"
                                  >
                                    {isPolishing === `${ach.Achievement_ID}-Outcome` ? (
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
                                        ></circle>
                                        <path
                                          className="opacity-75"
                                          fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
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
          </div>

          {/* Right Column (Secondary) - 35% */}
          <div className="space-y-8">
            {/* Skills */}
            <div>
              <h2
                className="text-lg font-bold uppercase border-b mb-3 pb-1 tracking-wide"
                style={{
                  color: template.headingColor,
                  borderColor: template.borderColor,
                  fontFamily: template.fontSerif,
                }}
              >
                Skills
              </h2>
              <div className="space-y-2">
                {Master_Skills_Inventory.filter(
                  (s) =>
                    s.Proficiency === 'Expert' ||
                    s.Proficiency === 'Master' ||
                    s.Proficiency === 'Proficient'
                )
                  .slice(0, 15)
                  .map((skill, i) => {
                    const isMatched = analysis.Skill_Gaps.some(
                      (g) =>
                        g.Skill.toLowerCase() === skill.Skill_Name.toLowerCase() &&
                        g.Match_Level === 'Strong'
                    );
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2"
                      >
                        <span className={`text-xs ${isMatched ? 'font-bold' : ''}`}>
                          - {skill.Skill_Name}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Education */}
            {educationEntries.length > 0 && (
              <div>
                <h2
                  className="text-lg font-bold uppercase border-b mb-3 pb-1 tracking-wide"
                  style={{
                    color: template.headingColor,
                    borderColor: template.borderColor,
                    fontFamily: template.fontSerif,
                  }}
                >
                  Education
                </h2>
                <div className="space-y-4">
                  {educationEntries.map((entry, i) => (
                    <div key={i}>
                      <h3
                        className="text-xs font-bold"
                        style={{ color: template.primaryColor }}
                      >
                        {entry.Role}
                      </h3>
                      <p className="text-xs opacity-80">{entry.Organization}</p>
                      <p className="text-[10px] font-bold opacity-60">
                        {formatDate(entry.EndDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
