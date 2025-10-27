const baseConfig = require('../../packages/config/jest/base.cjs');

module.exports = {
  ...baseConfig,
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '.*\\.spec\\.ts$'
};
