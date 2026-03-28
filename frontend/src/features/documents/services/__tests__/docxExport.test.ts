import { jest } from '@jest/globals';

const saveAs = jest.fn();
const toBlob = jest.fn();
const paragraphMock = jest.fn((input) => ({ kind: 'paragraph', input }));
const textRunMock = jest.fn((input) => ({ kind: 'text-run', input }));
const documentMock = jest.fn((input) => ({ kind: 'document', input }));

(jest as any).unstable_mockModule('file-saver', () => ({
  saveAs,
}));

(jest as any).unstable_mockModule('docx', () => ({
  Document: documentMock,
  Paragraph: paragraphMock,
  TextRun: textRunMock,
  HeadingLevel: {
    TITLE: 'TITLE',
    HEADING_1: 'HEADING_1',
    HEADING_2: 'HEADING_2',
  },
  Packer: {
    toBlob,
  },
}));

const { exportDocumentAsDocx } = await import('../docxExport');

describe('docxExport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    toBlob.mockResolvedValue(
      new Blob(['docx'], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
    );
  });

  it('exports a cover letter DOCX with the requested filename', async () => {
    await exportDocumentAsDocx({
      type: 'cover-letter',
      fileName: 'Cover_Letter.docx',
      heading: 'Cover Letter',
      content: 'Paragraph one.\n\nParagraph two.',
    });

    expect(documentMock).toHaveBeenCalled();
    expect(toBlob).toHaveBeenCalled();
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'Cover_Letter.docx');
  });

  it('exports a KSC DOCX with criterion heading and content', async () => {
    await exportDocumentAsDocx({
      type: 'ksc',
      fileName: 'KSC_Response.docx',
      criterion: 'Demonstrated leadership',
      content: 'Situation\nTask\nAction\nResult',
    });

    expect(documentMock).toHaveBeenCalled();
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'KSC_Response.docx');
  });

  it('supports resume exports through the shared contract', async () => {
    await exportDocumentAsDocx({
      type: 'resume',
      fileName: 'Resume.docx',
      title: 'Candidate Name',
      summary: 'Professional summary',
      skills: ['Leadership', 'Community engagement'],
      experience: [
        {
          title: 'Community Worker',
          company: 'Collective Services',
          duration: '2022-2025',
          bullets: ['Ran outreach', 'Coordinated referrals'],
        },
      ],
    });

    expect(documentMock).toHaveBeenCalled();
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'Resume.docx');
  });

  it('throws when the document content is empty', async () => {
    await expect(
      exportDocumentAsDocx({
        type: 'cover-letter',
        fileName: 'Empty.docx',
        content: '   ',
      })
    ).rejects.toThrow('Cannot export an empty document');
  });
});
