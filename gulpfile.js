const sonarqubeScanner = require('sonarqube-scanner');

function sonar(callback) {
    sonarqubeScanner(
        {
            options: {
                'sonar.sources': 'src',
                'sonar.tests': 'test',
                'sonar.projectKey': 'flowscripter_esm-dynamic-plugins',
                'sonar.projectVersion': `travis_build_${process.env.TRAVIS_BUILD_NUMBER}`,
                'sonar.links.homepage': 'https://www.npmjs.com/package/@flowscripter/esm-dynamic-plugins',
                'sonar.links.ci': 'https://travis-ci.com/flowscripter/esm-dynamic-plugins',
                'sonar.links.scm': 'https://github.com/flowscripter/esm-dynamic-plugins',
                'sonar.links.issue': 'https://github.com/flowscripter/esm-dynamic-plugins/issues',
                'sonar.typescript.lcov.reportPaths': 'reports/lcov.info',
                'sonar.eslint.reportPaths': 'reports/eslint.json'
            }
        },
        callback
    );
}

exports.sonar = sonar;
