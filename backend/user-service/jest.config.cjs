/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  maxWorkers: 1,

  testMatch: ['**/__tests__/**/*.spec.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  setupFiles: ['<rootDir>/test/jest.env.js'],

  globalSetup: '<rootDir>/test/jest.global-setup.js',
  globalTeardown: '<rootDir>/test/jest.global-teardown.js',

  clearMocks: true,
  restoreMocks: true,
};
