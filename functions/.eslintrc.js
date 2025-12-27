module.exports = {
  root: true, // Indicates that this config file is the root for ESLint
  env: {
    es6: true,
    node: true, // Enables Node.js global variables and Node.js scoping.
  },
  parserOptions: {
    'ecmaVersion': 2021, // Allows parsing of modern ECMAScript features
    // If you plan to use ES modules (import/export), you'd add:
    // "sourceType": "module",
  },
  extends: [
    'eslint:recommended', // Basic recommended ESLint rules
    'google', // Google's JavaScript style guide
  ],
  rules: {
    // --- GENERAL JAVASCRIPT & GOOGLE STYLE RULES ---

    // Enforce single quotes for strings (Google style default)
    // If you *really* prefer double quotes, change "single" to "double" here.
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],

    // Enforce 2-space indentation (Google style)
    'indent': ['error', 2, { 'SwitchCase': 1 }],

    // Enforce trailing commas for multiline arrays, objects (Google style)
    'comma-dangle': ['error', 'always-multiline'],

    // Enforce a newline at the end of files (Google style)
    'eol-last': ['error', 'always'],

    // Enforce consistent spacing inside curly braces (Google style)
    'object-curly-spacing': ['error', 'always'],

    // Max line length (Google default is 80, often increased for modern codebases)
    // Adjust 'code' value as you prefer (e.g., 100, 120, 150).
    // 'ignoreUrls', 'ignoreStrings', etc., help prevent errors on naturally long lines.
    'max-len': ['error', {
      'code': 120, // Increased from 80. Adjust as needed.
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreRegExpLiterals': true,
    }],

    // --- FIREBASE SPECIFIC & DEVELOPMENT CONVENIENCE RULES ---

    // Disable restricted globals that might interfere with Firebase Functions context
    // IMPORTANT: Removed 'exports' from this list, as it's a valid global in Node.js
    'no-restricted-globals': ['error', 'name', 'length'],

    // Prefer arrow callbacks for clarity
    'prefer-arrow-callback': 'error',

    // Allow console.log for development/debugging (change to 'error' for strict production)
    'no-console': 'off',

    // Relax unused variable checks (warn instead of error, ignore function arguments)
    'no-unused-vars': ['warn', { 'args': 'none' }],

    // Relax camelcase checks (warn instead of error, ignore object properties if needed)
    // Firebase functions often involve external APIs (like PubChem) that don't use strict camelCase.
    // However, for *your own* variables, still aim for camelCase.
    'camelcase': ['warn', { 'properties': 'never' }],

    // Temporarily turn off JSDoc validation for quicker development
    // You can re-enable and enforce JSDoc comments later if desired.
    'valid-jsdoc': 'off',
    'require-jsdoc': 'off', // Another JSDoc related rule
  },
  overrides: [
    {
      files: ['**/*.spec.*'], // Specific rules for test files
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
