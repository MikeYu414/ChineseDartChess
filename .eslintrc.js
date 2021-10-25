module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'airbnb-base',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'vue/comment-directive': 'off',
    // for CRLF and LF
    'linebreak-style': 'off',
    'comma-dangle': ['error', 'never'],
    // for eslint var bug
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'variable',
        format: ['camelCase']
      }
    ]
  }
};
