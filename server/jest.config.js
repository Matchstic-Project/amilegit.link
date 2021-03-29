module.exports = {
  "moduleFileExtensions": ['js', 'ts'],
  "testMatch": [
    '**/__tests__/*.test.ts',
  ],
  "transform": {
    "^.+\\.(ts)$": "ts-jest"
  },
  "transformIgnorePatterns": ['/node_modules/'],
  "coveragePathIgnorePatterns": [
    "/node_modules/"
  ],
  "testEnvironment": 'node'
}
