export const Document = jest.fn().mockImplementation(() => ({}));
export const Paragraph = jest.fn().mockImplementation(() => ({}));
export const TextRun = jest.fn().mockImplementation(() => ({}));
export const HeadingLevel = { HEADING_1: 1, HEADING_2: 2, HEADING_3: 3 };
export const Packer = {
  toBlob: jest.fn().mockResolvedValue(
    new Blob(['mock-docx'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
  ),
  toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-docx')),
};
export const AlignmentType = { LEFT: 'left', CENTER: 'center', RIGHT: 'right' };
export const BorderStyle = { SINGLE: 'single' };
export const ShadingType = { CLEAR: 'clear' };
