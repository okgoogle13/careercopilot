/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React from 'react';
import { CareerDatabase, MatchAnalysis, StructuredAchievement } from '../../../types/career';
import { TemplateStyle } from '../../../config/resume-constants';
import { SingleColumnResume } from './feature/SingleColumnResume';
import { TwoColumnResume } from './feature/TwoColumnResume';
import { useTailoredResume } from '../hooks/useTailoredResume';

interface TailoredResumeViewProps {
  careerData: CareerDatabase;
  analysis: MatchAnalysis;
  template: TemplateStyle;
  locale?: 'US' | 'UK/AU';
  onUpdate?: (data: CareerDatabase) => void;
}

export const TailoredResumeView: React.FC<TailoredResumeViewProps> = ({
  careerData,
  analysis,
  template,
  locale = 'US',
  onUpdate,
}) => {
  const { Personal_Information } = careerData;

  const {
    achievements,
    tailoredSummary,
    setTailoredSummary,
    isPolishing,
    suggestions,
    handlePolish,
    applySuggestion,
    discardSuggestion,
    getAchievementsForEntry,
    workEntries,
    educationEntries,
  } = useTailoredResume({ careerData, analysis, onUpdate });

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

  return (
    <div
      className="p-10 max-w-4xl mx-auto"
      style={{
        backgroundColor: template.bgLight,
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
        <SingleColumnResume
          careerData={careerData}
          analysis={analysis}
          template={template}
          locale={locale}
          achievements={achievements}
          suggestions={suggestions}
          isPolishing={isPolishing}
          formatDate={formatDate}
          getAchievementsForEntry={getAchievementsForEntry}
          applySuggestion={applySuggestion}
          discardSuggestion={discardSuggestion}
          handlePolish={handlePolish}
          workEntries={workEntries}
          educationEntries={educationEntries}
          tailoredSummary={tailoredSummary}
          setTailoredSummary={setTailoredSummary}
        />
      ) : (
        <TwoColumnResume
          careerData={careerData}
          analysis={analysis}
          template={template}
          locale={locale}
          achievements={achievements}
          suggestions={suggestions}
          isPolishing={isPolishing}
          formatDate={formatDate}
          getAchievementsForEntry={getAchievementsForEntry}
          applySuggestion={applySuggestion}
          discardSuggestion={discardSuggestion}
          handlePolish={handlePolish}
          workEntries={workEntries}
          educationEntries={educationEntries}
          tailoredSummary={tailoredSummary}
          setTailoredSummary={setTailoredSummary}
        />
      )}
    </div>
  );
};
