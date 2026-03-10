module.exports = {
  rules: {
    'no-hardcoded-styles': require('./rules/no-hardcoded-styles'),
    'no-banned-design-terms': require('./rules/no-banned-design-terms'),
  },
  configs: {
    recommended: {
      plugins: ['kerala-rage'],
      rules: {
        'kerala-rage/no-hardcoded-styles': 'error',
        'kerala-rage/no-banned-design-terms': 'error',
      },
    },
    screens: require('./configs/screens'),
    features: require('./configs/features'),
  },
};
