module.exports = {
  root: true,
  extends: ['../../packages/config/eslint/base.cjs'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname
  },
  env: {
    node: true
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'off'
  }
};
