const jsPDF = jest.fn().mockImplementation(() => ({
  addImage: jest.fn(),
  save: jest.fn(),
  output: jest.fn(() => new Blob(['mock-pdf'], { type: 'application/pdf' })),
  internal: { pageSize: { getWidth: jest.fn(() => 210), getHeight: jest.fn(() => 297) } },
}));
export default jsPDF;
