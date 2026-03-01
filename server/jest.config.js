/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // @scalar/fastify-api-reference e pure ESM e incompativel com o modo CommonJS do Jest.
    // Substituimos por um mock que registra um plugin noop para nao quebrar o startup.
    '^@scalar/fastify-api-reference$': '<rootDir>/tests/mocks/scalar-api-reference.ts',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.test.json',
      },
    ],
  },
  globalSetup: './tests/globalSetup.ts',
  globalTeardown: './tests/globalTeardown.ts',
  // TestContainers pode demorar para baixar a imagem Docker na primeira execucao
  testTimeout: 60000,
};
