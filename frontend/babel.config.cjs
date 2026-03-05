// Simplified Babel config for Jest with only essential presets
// Note: Vite handles compilation for the actual build, this is only for Jest
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
