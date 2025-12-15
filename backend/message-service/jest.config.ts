import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  testMatch: ['**/__tests__/**/*.spec.ts'],

  setupFiles: ['<rootDir>/test/jest.env.ts'],
  globalSetup: '<rootDir>/test/jest.global-setup.ts',
  globalTeardown: '<rootDir>/test/jest.global-teardown.ts',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  clearMocks: true,
  restoreMocks: true,
};

export default config;
