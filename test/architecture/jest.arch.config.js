/** Config separado para boundaries.spec.ts (dependency-cruiser tarda más que las invariantes unitarias). */
const base = require('../../jest.config.js');

module.exports = {
  ...base,
  rootDir: '../..',
  testMatch: ['<rootDir>/test/architecture/boundaries.spec.ts'],
};
