module.exports = {
  collectCoverageFrom: [
    'packages/**/*.{js}',
    '!packages/**/*.test.{js}',
    '!**/node_modules/**',
  ],
  roots: [
    'packages/',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testRegex: '__tests__/.*\\.test\\.js$',
};
