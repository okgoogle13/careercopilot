const mockCanvas = {
  toDataURL: () => 'data:image/png;base64,mock',
  width: 800,
  height: 600,
};

module.exports = function html2canvas() {
  return Promise.resolve(mockCanvas);
};

module.exports.default = module.exports;
