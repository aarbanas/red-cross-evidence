module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: { '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }] },
  testRegex: '.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};
