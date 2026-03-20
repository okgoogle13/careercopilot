/**
 * CLASSIFICATION: Support Component Only
 * This component is for generation/analysis support and is not a canonical route.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useAutoSave } from '../hooks/useAutoSave';
import { CareerDatabase, JobOpportunity, MatchAnalysis, SavedDocument } from '../types';
import { auth } from '@/config/firebase';
import { TailoredResumeView } from './TailoredResumeView';
import { KSCResponsesView } from './KSCResponsesView';
import { AuditDisplay } from './AuditDisplay';
import { ATSScoreCard } from './ATSScoreCard';
import { CoverLetterSpecificMetrics } from './CoverLetterSpecificMetrics';
import { SuggestionsPanel } from './SuggestionsPanel';
import { useATSScoring } from '../hooks/useATSScoring';
import { RESUME_TEMPLATES, TemplateStyle } from '../constants';
import { CoverLetterScoreResult } from '../types';
import { AnalysisHeader } from './analysis/AnalysisHeader';
import { TemplateSelector } from './analysis/TemplateSelector';
import { DocumentTabBar } from './analysis/DocumentTabBar';
import { ExportToolbar } from './analysis/ExportToolbar';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ColumnBreak } from 'docx';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';

interface MatchDashboardProps {
  careerData: CareerDatabase;
  job: JobOpportunity;
  onUpdate?: (data: CareerDatabase) => void;
  onAnalyze: (careerData: CareerDatabase, job: JobOpportunity) => Promise<MatchAnalysis>;
  onSave: (userId: string, data: CareerDatabase) => Promise<void>;
}

export const StudioMatchPanel: React.FC<MatchDashboardProps> = (props) => {
  const { careerData, job, onUpdate, onAnalyze, onSave } = props;
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(auth.currentUser?.uid);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: { uid: string } | null) => {
      setCurrentUserId(user?.uid);
    });
    return unsubscribe;
  }, []);
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  // Prototype-only navigation state
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter' | 'ksc'>('resume');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>(RESUME_TEMPLATES[0]);
  const [showAudit, setShowAudit] = useState(false);
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [locale, setLocale] = useState<'US' | 'UK/AU'>('US');
  const [hasSelectionCriteria, setHasSelectionCriteria] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const kscRef = useRef<HTMLDivElement>(null);

  // Helper to get resume text for scoring
  const getResumeText = () => {
    if (!analysis) return '';
    let text = `${careerData.Personal_Information.FullName}\n${analysis.Tailored_Summary}\n`;

    const workEntries = careerData.Career_Entries.filter(
      (e) => e.Entry_Type === 'Work Experience'
    ).sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime());

    workEntries.forEach((entry) => {
      const entryAchievements = careerData.Structured_Achievements.filter(
        (a) => a.Entry_ID === entry.Entry_ID
      );
      if (entryAchievements.length > 0) {
        text += `${entry.Role} at ${entry.Organization}\n`;
        entryAchievements.forEach((ach) => {
          text += `- ${ach.Action_Verb} ${ach.Noun_Task} ${ach.Strategy} resulting in ${ach.Outcome}.\n`;
        });
      }
    });

    text += `Skills: ${careerData.Master_Skills_Inventory.map((s) => s.Skill_Name).join(', ')}`;
    return text;
  };

  const jobDescriptionText = `${job.Job_Title} at ${job.Company_Name}\n${job.Key_Responsibilities.join('\n')}\n${job.Required_Hard_Skills.join('\n')}\n${job.Required_Soft_Skills.join('\n')}`;

  const resumeScoring = useATSScoring(getResumeText(), jobDescriptionText, 'resume');
  const coverLetterScoring = useATSScoring(coverLetterContent, jobDescriptionText, 'coverLetter');

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result = await onAnalyze(careerData, job);

      // Self-Correction API Step: Check if the score is below a threshold and try to improve it once
      if (result.Overall_Fit_Score < 70) {
        console.log('Initial score below 70, attempting self-correction...');
        // In a real scenario, you might pass the previous result back to the AI to ask for improvements
        // For now, we'll just re-run it to see if it generates a better fit with a different seed/temperature
        const retryResult = await onAnalyze(careerData, job);
        if (retryResult.Overall_Fit_Score > result.Overall_Fit_Score) {
          console.log('Self-correction improved score.');
          result = retryResult;
        }
      }

      setAnalysis(result);
      setCoverLetterContent(result.Cover_Letter_Draft);
      setHasSelectionCriteria(
        !!result.KSC_Responses_Drafts && result.KSC_Responses_Drafts.length > 0
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDocument = async (content: string) => {
    if (!currentUserId || !analysis || !onUpdate) return;
    const newDoc: SavedDocument = {
      id: crypto.randomUUID(),
      jobTitle: job.Job_Title,
      companyName: job.Company_Name,
      dateSaved: new Date().toISOString(),
      coverLetter: content,
      tailoredSummary: analysis.Tailored_Summary,
    };

    const updatedData = {
      ...careerData,
      Saved_Documents: [...(careerData.Saved_Documents || []), newDoc],
    };

    await onSave(currentUserId, updatedData);
    onUpdate(updatedData);
  };

  const {
    isSaving: isAutoSaving,
    lastSaved,
    save,
  } = useAutoSave(currentUserId, coverLetterContent, saveDocument);

  const isSaving = isAutoSaving;
  const saveSuccess = lastSaved !== null;

  const handleSaveToProfile = async () => {
    try {
      await save(coverLetterContent);
    } catch (err) {
      console.error('Failed to save document:', err);
    }
  };

  const exportToPDF = () => {
    let element: HTMLElement | null = null;
    let filename = 'Document.pdf';

    if (activeTab === 'resume' && resumeRef.current) {
      element = resumeRef.current;
      filename = 'Tailored_Resume.pdf';
    } else if (activeTab === 'ksc' && kscRef.current) {
      element = kscRef.current;
      filename = 'KSC_Responses.pdf';
    } else if (activeTab === 'coverLetter' && analysis) {
      element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: ${selectedTemplate.fontSans}; padding: 40px; color: ${selectedTemplate.textColor}; max-width: 800px; margin: auto;">
          <h1 style="color: ${selectedTemplate.primaryColor}; border-bottom: 2px solid ${selectedTemplate.primaryColor}; padding-bottom: 10px; margin-bottom: 30px; text-transform: uppercase;">Cover Letter</h1>
          <div style="white-space: pre-wrap; line-height: 1.6;">${analysis.Cover_Letter_Draft}</div>
        </div>
      `;
      filename = 'Cover_Letter.pdf';
    }

    if (element) {
      const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  const getFullResumeText = () => {
    if (!analysis) return '';
    let md = `${careerData.Personal_Information.FullName}\n\n`;
    md += `Email: ${careerData.Personal_Information.Email} | Phone: ${careerData.Personal_Information.Phone} | Location: ${careerData.Personal_Information.Location}\n\n`;
    md += `Professional Summary\n${analysis.Tailored_Summary}\n\n`;
    md += `Professional Experience\n`;

    const workEntries = careerData.Career_Entries.filter(
      (e) => e.Entry_Type === 'Work Experience'
    ).sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime());

    workEntries.forEach((entry) => {
      const entryAchievements = careerData.Structured_Achievements.filter(
        (a) => a.Entry_ID === entry.Entry_ID
      );
      if (entryAchievements.length > 0) {
        md += `${entry.Role}\n${entry.Organization} | ${entry.StartDate} - ${entry.EndDate}\n\n`;
        entryAchievements.forEach((ach) => {
          md += `- ${ach.Action_Verb} ${ach.Noun_Task} ${ach.Strategy} resulting in ${ach.Outcome}.\n`;
        });
        md += '\n';
      }
    });

    md += `Skills\n${careerData.Master_Skills_Inventory.map((s) => s.Skill_Name).join(', ')}\n`;
    return md;
  };

  const exportToMarkdown = () => {
    if (activeTab === 'resume' && analysis) {
      let md = `# ${careerData.Personal_Information.FullName}\n\n`;
      md += `**Email:** ${careerData.Personal_Information.Email} | **Phone:** ${careerData.Personal_Information.Phone} | **Location:** ${careerData.Personal_Information.Location}\n\n`;
      md += `## Professional Summary\n${analysis.Tailored_Summary}\n\n`;
      md += `## Professional Experience\n`;

      const workEntries = careerData.Career_Entries.filter(
        (e) => e.Entry_Type === 'Work Experience'
      ).sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime());

      workEntries.forEach((entry) => {
        const entryAchievements = careerData.Structured_Achievements.filter(
          (a) => a.Entry_ID === entry.Entry_ID
        );
        if (entryAchievements.length > 0) {
          md += `### ${entry.Role}\n**${entry.Organization}** | ${entry.StartDate} - ${entry.EndDate}\n\n`;
          entryAchievements.forEach((ach) => {
            md += `- ${ach.Action_Verb} ${ach.Noun_Task} ${ach.Strategy} resulting in ${ach.Outcome}.\n`;
          });
          md += '\n';
        }
      });

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, 'Tailored_Resume.md');
    } else if (activeTab === 'coverLetter' && analysis) {
      const blob = new Blob([analysis.Cover_Letter_Draft], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, 'Cover_Letter.md');
    } else if (activeTab === 'ksc' && analysis && analysis.KSC_Responses_Drafts) {
      let md = `# Key Selection Criteria Responses\n\n`;
      analysis.KSC_Responses_Drafts.forEach((ksc, i) => {
        md += `## Criterion ${i + 1}: ${ksc.KSC_Prompt}\n\n${ksc.Response}\n\n`;
      });
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, 'KSC_Responses.md');
    }
  };

  const exportToDOCX = async () => {
    if (activeTab === 'resume' && analysis) {
      const isTwoColumn = selectedTemplate.layout === 'two-column';

      const leftColumnContent = [
        new Paragraph({
          text: careerData.Personal_Information.FullName,
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [
            new TextRun(
              `${careerData.Personal_Information.Email} | ${careerData.Personal_Information.Phone} | ${careerData.Personal_Information.Location}`
            ),
          ],
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'Professional Summary',
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          text: analysis.Tailored_Summary,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'Professional Experience',
          heading: HeadingLevel.HEADING_2,
        }),
        ...careerData.Career_Entries.filter((e) => e.Entry_Type === 'Work Experience')
          .sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime())
          .flatMap((entry) => {
            const entryAchievements = careerData.Structured_Achievements.filter(
              (a) => a.Entry_ID === entry.Entry_ID
            );
            if (entryAchievements.length === 0) return [];
            return [
              new Paragraph({
                text: entry.Role,
                heading: HeadingLevel.HEADING_3,
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: entry.Organization, bold: true }),
                  new TextRun(` | ${entry.StartDate} - ${entry.EndDate}`),
                ],
              }),
              ...entryAchievements.map(
                (ach) =>
                  new Paragraph({
                    text: `${ach.Action_Verb} ${ach.Noun_Task} ${ach.Strategy} resulting in ${ach.Outcome}.`,
                    bullet: { level: 0 },
                  })
              ),
              new Paragraph({ text: '' }),
            ];
          }),
      ];

      const rightColumnContent = [
        new Paragraph({
          text: 'Skills',
          heading: HeadingLevel.HEADING_2,
        }),
        ...careerData.Master_Skills_Inventory.filter(
          (s) =>
            s.Proficiency === 'Expert' ||
            s.Proficiency === 'Master' ||
            s.Proficiency === 'Proficient'
        )
          .slice(0, 15)
          .map(
            (skill) =>
              new Paragraph({
                text: skill.Skill_Name,
                bullet: { level: 0 },
              })
          ),
        new Paragraph({ text: '' }),
        new Paragraph({
          text: 'Education',
          heading: HeadingLevel.HEADING_2,
        }),
        ...careerData.Career_Entries.filter((e) => e.Entry_Type === 'Education').map(
          (entry) =>
            new Paragraph({
              children: [
                new TextRun({ text: entry.Role, bold: true }),
                new TextRun(`\n${entry.Organization}`),
                new TextRun(`\n${entry.EndDate}`),
              ],
            })
        ),
      ];

      const doc = new Document({
        sections: [
          {
            properties: isTwoColumn
              ? {
                  column: {
                    count: 2,
                    space: 720, // 0.5 inch
                  },
                }
              : {},
            children: isTwoColumn
              ? [
                  ...leftColumnContent,
                  new Paragraph({ children: [new ColumnBreak()] }),
                  ...rightColumnContent,
                ]
              : [...leftColumnContent, ...rightColumnContent],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'Tailored_Resume.docx');
    } else if (activeTab === 'coverLetter' && analysis) {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: analysis.Cover_Letter_Draft.split('\n').map(
              (line) => new Paragraph({ text: line })
            ),
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'Cover_Letter.docx');
    } else if (activeTab === 'ksc' && analysis && analysis.KSC_Responses_Drafts) {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: analysis.KSC_Responses_Drafts.flatMap((ksc, i) => [
              new Paragraph({
                text: `Criterion ${i + 1}: ${ksc.KSC_Prompt}`,
                heading: HeadingLevel.HEADING_1,
              }),
              ...ksc.Response.split('\n').map((line) => new Paragraph({ text: line })),
              new Paragraph({ text: '' }),
            ]),
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'KSC_Responses.docx');
    }
  };

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
            We&apos;ve analyzed the job posting. Now, let&apos;s see how your career database matches up and
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

  // Map recommended achievements (reserved for future use)
  const _recommendedAchievements = analysis.Recommended_Achievement_IDs.map((id) =>
    careerData.Structured_Achievements.find((a) => a.Achievement_ID === id)
  ).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <AnalysisHeader
        score={analysis.Overall_Fit_Score}
        jobTitle={job.Job_Title}
        companyName={job.Company_Name}
      />

      <TemplateSelector
        templates={RESUME_TEMPLATES}
        selected={selectedTemplate}
        onSelect={setSelectedTemplate}
        locale={locale}
        onLocaleChange={setLocale}
      />

      {/* Tabs and Export */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-[var(--sys-color-outline-variant)] pb-0 sticky top-0 bg-[var(--sys-color-charcoalBackground-base)] z-40 pt-4">
        <DocumentTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasKSC={hasSelectionCriteria}
        />
        <ExportToolbar
          activeTab={activeTab}
          showAudit={showAudit}
          onToggleAudit={() => setShowAudit(!showAudit)}
          onRescore={handleAnalyze}
          onSaveToProfile={handleSaveToProfile}
          onCopy={() => {
            const text =
              activeTab === 'resume'
                ? getFullResumeText()
                : activeTab === 'coverLetter'
                  ? coverLetterContent
                  : analysis?.KSC_Responses_Drafts?.map(
                      (k) => `${k.KSC_Prompt}\n${k.Response}`
                    ).join('\n\n') || '';
            navigator.clipboard.writeText(text);
            alert('Copied to clipboard for ATS parsing!');
          }}
          onExportPDF={exportToPDF}
          onExportDOCX={exportToDOCX}
          onExportMarkdown={exportToMarkdown}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          hasUser={!!currentUserId}
        />
      </div>

      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div
            className="xl:col-span-2"
            ref={resumeRef}
          >
            <TailoredResumeView
              careerData={careerData}
              analysis={analysis}
              template={selectedTemplate}
              locale={locale}
            />
          </div>
          <div className="xl:col-span-1 space-y-6 sticky top-8">
            <ATSScoreCard
              score={resumeScoring.score}
              isCalculating={resumeScoring.isCalculating}
              documentType="resume"
            />
            {resumeRef.current &&
              resumeRef.current.clientHeight > 1122 && ( // A4 is ~1122px at 96dpi
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
                    Your resume appears to be longer than one page. Consider trimming older
                    experience or less relevant skills to improve ATS readability.
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
          <div
            className="xl:col-span-2 bg-[var(--sys-color-paperWhite-base)] p-10 shadow-lg"
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
        <div ref={kscRef}>
          <KSCResponsesView
            analysis={analysis}
            template={selectedTemplate}
          />
        </div>
      )}
    </div>
  );
};
