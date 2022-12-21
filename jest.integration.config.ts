import type { Config } from 'jest';

// https://jestjs.io/docs/configuration
const config: Config = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.integration.test.ts'],
  setupFiles: ['core-js'],
  setupFilesAfterEnv: ['./jest.integration.env.ts'],
};

// eslint-disable-next-line import/no-default-export
export default config;
