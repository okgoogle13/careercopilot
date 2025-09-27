module.exports = {
  presets: [
    ['next/babel', { 'preset-react': { runtime: 'automatic' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-transform-runtime',
  ],
};
