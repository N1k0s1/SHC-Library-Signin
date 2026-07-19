/**
 * Jest config for the mobile app's pure-logic unit tests (services/utils).
 * Uses ts-jest in a node environment so tests run without the Expo/React Native
 * runtime. Modules that pull in React Native (e.g. constants/Api) are mocked
 * inside the tests that need them.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  clearMocks: true,
  collectCoverageFrom: ['services/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage',
};
