import { saveAs } from 'file-saver';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';

export type ExportableDocument =
  | {
      type: 'resume';
      fileName: string;
      title: string;
      summary?: string;
      skills?: string[];
      experience?: Array<{
        title: string;
        company?: string;
        duration?: string;
        bullets?: string[];
      }>;
      education?: Array<{
        degree: string;
        school?: string;
        year?: string;
      }>;
    }
  | {
      type: 'cover-letter';
      fileName: string;
      heading?: string;
      content: string;
    }
  | {
      type: 'ksc';
      fileName: string;
      criterion?: string;
      content: string;
    };

const asParagraphs = (content: string): Paragraph[] =>
  content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (text) =>
        new Paragraph({
          children: [new TextRun(text)],
        })
    );

const buildResumeParagraphs = (document: Extract<ExportableDocument, { type: 'resume' }>) => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun(document.title)],
    }),
  ];

  if (document.summary?.trim()) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun('Professional Summary')],
      }),
      ...asParagraphs(document.summary)
    );
  }

  if (document.skills?.length) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun('Skills')],
      }),
      new Paragraph({
        children: [new TextRun(document.skills.join(', '))],
      })
    );
  }

  if (document.experience?.length) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun('Experience')],
      })
    );

    document.experience.forEach((entry) => {
      const headingBits = [entry.title, entry.company, entry.duration].filter(Boolean).join(' | ');
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun(headingBits)],
        })
      );

      entry.bullets?.filter(Boolean).forEach((bullet) => {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun(bullet)],
          })
        );
      });
    });
  }

  if (document.education?.length) {
    paragraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun('Education')],
      })
    );

    document.education.forEach((entry) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun([entry.degree, entry.school, entry.year].filter(Boolean).join(' | ')),
          ],
        })
      );
    });
  }

  return paragraphs;
};

const ensureContent = (document: ExportableDocument) => {
  if (document.type === 'resume') {
    const hasResumeContent =
      document.summary?.trim() ||
      document.skills?.length ||
      document.experience?.length ||
      document.education?.length;

    if (!hasResumeContent) {
      throw new Error('Cannot export an empty document');
    }

    return;
  }

  if (!document.content.trim()) {
    throw new Error('Cannot export an empty document');
  }
};

export async function exportDocumentAsDocx(document: ExportableDocument): Promise<void> {
  ensureContent(document);

  const paragraphs =
    document.type === 'resume'
      ? buildResumeParagraphs(document)
      : [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [
              new TextRun(
                document.type === 'cover-letter'
                  ? document.heading || 'Cover Letter'
                  : document.criterion || 'KSC Response'
              ),
            ],
          }),
          ...asParagraphs(document.content),
        ];

  const doc = new Document({
    sections: [
      {
        children: paragraphs,
      },
    ],
    creator: 'CareerCopilot',
    title:
      document.type === 'resume'
        ? document.title
        : document.type === 'cover-letter'
          ? document.heading || 'Cover Letter'
          : document.criterion || 'KSC Response',
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, document.fileName);
}
