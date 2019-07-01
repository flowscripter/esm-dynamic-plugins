module.exports = {
    moduleFileExtensions: [
        'js',
        'ts'
    ],
    testEnvironment: 'node',
    testMatch: [
        '**/?(*.)test.ts'
    ],
    transform: {
        ts: 'ts-jest'
    },
    modulePaths: [
        'src'
    ],
    coverageReporters: [
        'lcov'
    ],
    collectCoverageFrom: [
        'src/**/*.ts'
    ],
    coverageDirectory: 'reports'
};
