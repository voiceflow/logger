module.exports = {
  extends: '@voiceflow/eslint-config',
  rules: {
    'no-continue': 'off',
    'no-process-env': 'off',
    'class-methods-use-this': 'off', // migrating away from classes anyways
    'require-jsdoc': 'off', // not sure we want this
    quotes: ['error', 'single', 'avoid-escape'],
    'valid-jsdoc': 'off',
    'func-names': 'off',
    // disabled temporarily by setting as warnings
    'eslint-comments/disable-enable-pair': 'warn',
    'eslint-comments/no-unlimited-disable': 'warn',
    'promise/always-return': 'warn',
    'promise/param-names': 'warn',
    'sonarjs/cognitive-complexity': 'warn',
    'sonarjs/no-duplicate-string': 'warn',
    'sonarjs/no-identical-functions': 'warn',
    'sonarjs/no-useless-catch': 'warn',
    'sonarjs/no-collapsible-if': 'warn',
    'sonarjs/prefer-object-literal': 'warn',
    'consistent-return': 'warn',
  },
};
