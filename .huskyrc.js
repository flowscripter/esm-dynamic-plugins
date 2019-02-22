module.exports = {
    hooks: {
        'pre-commit': 'npm run lint',
        'pre-push': 'npm test',
        'commit-msg': 'npx commitlint -E HUSKY_GIT_PARAMS'
    }
};
