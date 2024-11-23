export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'scope-empty': [2, 'never'],
    'scope-enum': [2, 'always', ['project', 'utils', 'dependencies', 'config']],
  },

  helpUrl: `
  Commit messages must follow the conventional commit format:
  https://github.com/boughtbymany/polaris/blob/main/CONTRIBUTING.md#commit-messages

    type(scope): subject

    [optional body]
  `,
}
