const mockCanvas = {
  toDataURL: jest.fn(() => 'data:image/png;base64,mock'),
  width: 800,
  height: 600,
};

const html2canvas = jest.fn().mockResolvedValue(mockCanvas);

export default html2canvas;
