import { RefObject } from 'react';
import { CareerDatabase, MatchAnalysis } from '../../../types/career';
import { TemplateStyle } from '../../../config/resume-constants';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ColumnBreak } from 'docx';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';

interface UseDocumentExportProps {
  activeTab: 'resume' | 'coverLetter' | 'ksc' | 'analysis' | string;
  analysis: MatchAnalysis | null;
  careerData: CareerDatabase;
  selectedTemplate: TemplateStyle;
  coverLetterContent: string;
  resumeRef: RefObject<HTMLDivElement | null>;
  kscRef: RefObject<HTMLDivElement | null>;
}

export function useDocumentExport({
  activeTab,
  analysis,
  careerData,
  selectedTemplate,
  coverLetterContent,
  resumeRef,
  kscRef,
}: UseDocumentExportProps) {
  const exportToPDF = (documentType?: 'resume' | 'coverLetter' | 'ksc') => {
    const target = documentType || activeTab;
    let element: HTMLElement | null = null;
    let filename = 'Document.pdf';

    if (target === 'resume' && resumeRef.current) {
      element = resumeRef.current;
      filename = 'Tailored_Resume.pdf';
    } else if (target === 'ksc' && kscRef.current) {
      element = kscRef.current;
      filename = 'KSC_Responses.pdf';
    } else if (target === 'coverLetter' && analysis) {
      element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: ${selectedTemplate.fontSans}; padding: 40px; color: ${selectedTemplate.textColor}; max-width: 800px; margin: auto;">
          <h1 style="color: ${selectedTemplate.primaryColor}; border-bottom: 2px solid ${selectedTemplate.primaryColor}; padding-bottom: 10px; margin-bottom: 30px; text-transform: uppercase;">Cover Letter</h1>
          <div style="white-space: pre-wrap; line-height: 1.6;">${coverLetterContent || analysis.Cover_Letter_Draft}</div>
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
      (e) => e.Entry_Type === ('Work Experience' as any)
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

  const exportToMarkdown = (documentType?: 'resume' | 'coverLetter' | 'ksc') => {
    const target = documentType || activeTab;
    if (target === 'resume' && analysis) {
      const md = getFullResumeText();
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, 'Tailored_Resume.md');
    } else if (target === 'coverLetter' && analysis) {
      const blob = new Blob([coverLetterContent || analysis.Cover_Letter_Draft || ''], {
        type: 'text/markdown;charset=utf-8',
      });
      saveAs(blob, 'Cover_Letter.md');
    } else if (target === 'ksc' && analysis && analysis.KSC_Responses_Drafts) {
      let md = `# Key Selection Criteria Responses\n\n`;
      analysis.KSC_Responses_Drafts.forEach((ksc, i) => {
        md += `## Criterion ${i + 1}: ${ksc.KSC_Prompt}\n\n${ksc.Response}\n\n`;
      });
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, 'KSC_Responses.md');
    }
  };

  const exportToDOCX = async (documentType?: 'resume' | 'coverLetter' | 'ksc') => {
    const target = documentType || activeTab;
    if (target === 'resume' && analysis) {
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
        ...careerData.Career_Entries.filter((e) => e.Entry_Type === ('Work Experience' as any))
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
        ...careerData.Career_Entries.filter((e) => e.Entry_Type === ('Education' as any)).map(
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
                    space: 720,
                    count: 2,
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
    } else if (target === 'coverLetter' && analysis) {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: (coverLetterContent || analysis.Cover_Letter_Draft || '')
              .split('\n')
              .map((line) => new Paragraph({ text: line })),
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'Cover_Letter.docx');
    } else if (target === 'ksc' && analysis && analysis.KSC_Responses_Drafts) {
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

  return { exportToPDF, exportToMarkdown, exportToDOCX, getFullResumeText };
}
