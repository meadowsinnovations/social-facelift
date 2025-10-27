module.exports = {
  root: true,
  extends: ['../../packages/config/eslint/base.cjs'],
  env: {
    'react-native/react-native': true
  },
  plugins: ['react-native'],
  rules: {
    'react-native/no-inline-styles': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off'
  }
};
