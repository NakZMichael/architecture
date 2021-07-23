module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'google'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'valid-jsdoc': 'off',
    'max-len': ['warn', {code: 80}],
    'object-curly-spacing': 'warn',
    'react/no-unescaped-entities': 'warn',
    'comma-dangle': 'off',
  },
};
