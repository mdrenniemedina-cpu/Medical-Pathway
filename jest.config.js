/** Configuración base de Jest: unit + invariantes de dominio (no incluye test:arch, que tiene su propio config). */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/test/unit/**/*.spec.ts', '<rootDir>/test/architecture/invariantes.*.spec.ts'],
  moduleNameMapper: {
    '^@shared-kernel/(.*)$': '<rootDir>/src/shared-kernel/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@contexts/(.*)$': '<rootDir>/src/bounded-contexts/$1',
  },
  setupFiles: ['<rootDir>/test/jest.setup.ts'],
};
