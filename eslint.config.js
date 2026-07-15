export default [
  {
    ignores: [
      'node_modules/',
      'music/',
      'images/',
      '**/*.mp3',
      '**/*.webp',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        gsap: 'readonly',
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        MediaMetadata: 'readonly',
        URL: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        getComputedStyle: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-duplicate-imports': 'warn',
      'no-unused-expressions': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
    },
  },
];
